const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

require("dotenv").config();

// Load Cloudinary credentials from environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name:cloudName,
  api_key:apiKey,
  api_secret:apiSecret
});
// console.log(cloudinary.config()); // Verify configuration

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ["jpg", "png", "gif","webp","pdf"],
  },
});

const upload = multer({ storage: storage })

const uploadMiddleware = upload.any(); // Use upload.any() instead of upload.array()

const uploadController = {
  upload: async (req, res) => {
    try {
      if (req.files.length === 0) {
        res.status(400).json({ message: 'No files uploaded' });
      } else {
        const urls = req.files.map((file, index) => ({[`url${index + 1}`]: file.path }));
        res.json(Object.assign({}, ...urls));
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'Upload failed', error: err.message });
    }
  },
};
module.exports = { uploadController, uploadMiddleware };