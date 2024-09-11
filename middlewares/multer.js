
const multer = require("multer");
const path = require("path");

// Define the storage location and file name format
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "utils/prodPhoto")); 
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const cleanFileName = file.originalname.replace(/\s+/g, '-'); 
    cb(null, `${timestamp}-${cleanFileName}`); 
  }
});

// Define the file filter to allow only image files
const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase(); 
  if (ext !== ".jpeg" && ext !== ".jpg" && ext !== ".png") {
    return cb(new Error("File type is not supported"), false); 
  }
  cb(null, true); // Accept the file
};

// Define the multer upload object
const upload = multer({
  storage: storage,
  fileFilter: fileFilter, 
  limits: { fileSize: 5 * 1024 * 1024 } // Optional: Limit file size to 5MB
});

module.exports = upload;
