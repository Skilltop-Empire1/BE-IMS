const { User, Profile } = require("../models");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");

// Modify multer for in-memory storage to upload directly to Cloudinary
const storage = multer.memoryStorage(); // Use memory storage instead of disk
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = file.mimetype;
    if (ext !== 'image/jpeg' && ext !== 'image/png' && ext !== 'image/jpg') {
      return cb(new Error('File type is not supported'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Optional: Limit file size to 5MB
});

// Upload Profile Picture
exports.uploadProfilePic = async (req, res) => {
  upload.single('profilePic')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'File upload error: ' + err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      // Fetch user by userId (assuming it's passed in the request body or available through auth middleware)
      const { userId } = req.body;

      // Check if the user exists
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Upload the image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'profile_pics' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }).end(req.file.buffer);
      });

      // Save Cloudinary URL to Profile model
      let profile = await Profile.findOne({ where: { userId } });
      if (!profile) {
        profile = await Profile.create({ userId, url: result.secure_url });
      } else {
        profile.url = result.secure_url;
        await profile.save();
      }

      res.status(200).json({ message: 'Profile picture uploaded successfully', profile });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Get Profile Picture by User ID
exports.getProfilePic = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is passed as a route parameter

    // Fetch the user's profile picture
    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) {
      return res.status(404).json({ error: 'Profile picture not found' });
    }

    res.status(200).json({ profilePic: profile.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

