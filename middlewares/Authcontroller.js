const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const login = async (req, res, next) => {
  const { E_mail, password } = req.body;

  try {
    const user = await User.findOne({ E_mail: E_mail });
    if (!user) {
      return res.status(401).json({ message: "E-mail is incorrect!" });
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(400).json({ message: "Password is incorrect!" });
    }

    // Create payload with minimal information
    const payload = {
      userId: user._id,
      is_admin: user.is_admin,
    };

    const token = jwt.sign(payload, process.env.secret_key, { expiresIn: '1h' });

    return res.status(200).json({
      message: "Login Success!",
      token: token,
      result: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};


const checkadmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        message: "No token provided",
        code: 403
      });
    }

    const decoded = jwt.verify(token, process.env.secret_key);

    if (!decoded.is_admin) {
      return res.status(403).json({
        message: "You are not authorized to access this route",
        code: 403
      });
    }

    // Fetch the user from the database if needed for further checks
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        code: 404
      });
    }

    req.user = user;
     // Attach user to request object for later use
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Unauthorized or invalid token",
      code: 403
    });
  }
};


  
module.exports = { login,checkadmin, };