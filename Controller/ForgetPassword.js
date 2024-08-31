const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
require("dotenv").config();

// Step 1: Request for password reset (Generate OTP)
const requestPasswordReset = async (req, res) => {
    const { E_mail } = req.body;
    try {
        const user = await User.findOne({ E_mail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;

        // Set OTP expiry time (10 minutes from now)
        user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

        // Save the OTP to the database
        await user.save();

        // Send OTP to user's email
        await sendOTPEmail(user);

        return res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Step 2: Reset Password
const resetPassword = async (req, res) => {
    const { E_mail, otp, newPassword } = req.body;
  
    if (!E_mail || !otp || !newPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      const user = await User.findOne({ E_mail });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      console.log("Stored OTP:", user.otp);
      console.log("Received OTP:", otp);
      console.log("OTP Expiry Time:", user.otpExpiresAt ? user.otpExpiresAt.toISOString() : 'Not set');
      console.log("Current Time:", new Date().toISOString());
  
      if (user.otp == otp) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiresAt = null;
    
        await user.save();
    
        return res.status(200).json({ message: "Password reset successfully" });
    }
    else {
    console.log("OTP validation failed");
    return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    } catch (error) {
      console.error("Error in resetPassword:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  


// Function to send OTP email
const sendOTPEmail = async (user) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.mail, // use environment variables for sensitive data
            pass: process.env.password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.E_mail,
        subject: 'Reset your password',
        text: `Your OTP Code to Reset Your Password is: ${user.otp} If you did not request this, please ignore this message. `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully')
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
    // After generating OTP
    console.log("Generated OTP:", user.otp);
    console.log("OTP Expiry Time:", user.otpExpiry);

};

module.exports = {
    requestPasswordReset,
    resetPassword
};
