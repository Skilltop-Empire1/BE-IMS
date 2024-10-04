const { User, Profile ,Staff } = require("../models");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");


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
  limits: { fileSize: 5 * 1024 * 1024 } // Limited the file size to 5MB
});

// // Upload Profile Picture
// exports.uploadProfilePic = async (req, res) => {
//   upload.single('profilePic')(req, res, async (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).json({ error: 'File upload error: ' + err.message });
//     } else if (err) {
//       return res.status(400).json({ error: err.message });
//     }

//     try {
//       // Fetch user by userId
//       const { userId } = req.user;

//        // Check if the user exists
//        const user = await User.findByPk(userId);
//        if (!user) {
//          return res.status(404).json({ error: 'User not found' });
//        }

//       // Upload the image to Cloudinary
//       const result = await new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream({ folder: 'profile_pics' }, (error, result) => {
//           if (error) return reject(error);
//           resolve(result);
//         }).end(req.file.buffer);
//       });

//       // Save Cloudinary URL to Profile model
//       let profile = await Profile.findOne({ where: { userId } });
//       if (!profile) {
//         profile = await Profile.create({ userId, url: result.secure_url });
//       } else {
//         profile.url = result.secure_url;
//         await profile.save();
//       }

//       res.status(200).json({ message: 'Profile picture uploaded successfully', profile });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
// };

// // Get Profile Picture by User ID
// exports.getProfilePic = async (req, res) => {
//   try {
//     const { userId } = req.user;

//     // Fetch the user's profile picture
//     const profile = await Profile.findOne({ where: { userId } });
//     if (!profile) {
//       return res.status(404).json({ error: 'Profile picture not found' });
//     }

//     res.status(200).json({ profilePic: profile.url });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Upload Profile Picture
exports.uploadProfilePic = async (req, res) => {
  upload.single('profilePic')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'File upload error: ' + err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { userId, role } = req.user; // Extracting role to differentiate between user and staff

      let profile;
      let profileIdField;
      let profileField;
      let profileCondition;

      // Logic to handle super admin or staff
      if (role === 'superAdmin') {
        // If the user is a super admin (user), fetch by userId
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        profileCondition = { userId }; // Look for profile by userId
        profileField = 'userId';
      } else {
        // If the user is a staff member, fetch by staffId
        const staff = await Staff.findByPk(userId); // Assuming userId in req.user is actually staffId for staff members
        if (!staff) {
          return res.status(404).json({ error: 'Staff member not found' });
        }

        profileCondition = { staffId: userId }; // Look for profile by staffId
        profileField = 'staffId';
      }

      // Upload the image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'profile_pics' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }).end(req.file.buffer);
      });

      // Save Cloudinary URL to Profile model
      profile = await Profile.findOne({ where: profileCondition });
      if (!profile) {
        const profileData = { [profileField]: userId, url: result.secure_url };
        profile = await Profile.create(profileData);
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

// Get Profile Picture by User ID or Staff ID
exports.getProfilePic = async (req, res) => {
  try {
    const { userId, role } = req.user; // Extract role from token
    let profile;

    if (role === 'superAdmin') {
      // Fetch the profile picture by userId for super admin
      profile = await Profile.findOne({ where: { userId } });
    } else {
      // Fetch the profile picture by staffId for staff member
      profile = await Profile.findOne({ where: { staffId: userId } });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile picture not found' });
    }

    res.status(200).json({ profilePic: profile.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


