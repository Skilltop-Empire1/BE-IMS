// const multer = require("multer")
// const path = require("path")

// const storage = multer.diskStorage({
//     destination:function (req,file,cb){
//         cb(null, path.join(__dirname,"..","utils/prodPhoto"))
//     },
//     filename: function(req,file,cb){
//         cb(null, Date.now()+file.originalname)
//     },
//     fileFilter:function(req,file,cb){
//         let ext = path.extname(file.originalname)
//         if(ext !== ".jpeg" && ext !== ".jpg" && ext !== ".png"){
//             cb(new Error("file type is supported"), false)
//             return
//         }
//         cb(null, true)
//     }
// })

// const upload = multer({storage:storage})

// module.exports = upload

const multer = require("multer");
const path = require("path");

// Define the storage location and file name format
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "utils/prodPhoto")); // Path to save the file
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const cleanFileName = file.originalname.replace(/\s+/g, '-'); // Replace spaces with hyphens
    cb(null, `${timestamp}-${cleanFileName}`); // File name with timestamp and original name
  }
});

// Define the file filter to allow only image files
const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase(); // Ensure extension is lowercase
  if (ext !== ".jpeg" && ext !== ".jpg" && ext !== ".png") {
    return cb(new Error("File type is not supported"), false); // Corrected error message
  }
  cb(null, true); // Accept the file
};

// Define the multer upload object
const upload = multer({
  storage: storage,
  fileFilter: fileFilter, // Add file filter
  limits: { fileSize: 5 * 1024 * 1024 } // Optional: Limit file size to 5MB
});

module.exports = upload;
