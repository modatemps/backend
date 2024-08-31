const express = require("express");
const {
  createUser,
  updateUser,
  deleteUser,
  GetUser,
  AddAddress,
  verifyOTP
} = require("../Controller/Usercontroller");

const { login, checkadmin } = require("../middlewares/Authcontroller");
const { uploadController, uploadMiddleware } = require("../Controller/Cloudinary");
const { resetPassword, requestPasswordReset } = require("../Controller/ForgetPassword");

const router = express.Router();

// Public Routes
router.post("/create-user", createUser);
router.post("/otp-verification", verifyOTP);
router.post("/request-password-reset", requestPasswordReset);
router.post("/address",AddAddress)
router.post("/reset-password", resetPassword);
router.post("/login", login);
router.get("/get-user",GetUser); 
router.put("/update/:id",updateUser); 
router.delete("/delete/:id", deleteUser); 
router.post("/upload", uploadMiddleware, uploadController.upload);

module.exports = router;
