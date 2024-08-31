const User = require("../models/UserSchema")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
require("dotenv").config()
const nodemailer = require('nodemailer');

const createUser = async (req, res) => {
    const data = req.body
    const NewUser = new User(data);
    try {
        const emailExist = await User.findOne({
            E_mail: data.E_mail
        })
        if (emailExist) {
            console.log("Email already exist")
            return res.status(400).json({
                message: "Email already exist"
                
            })
        }
        const hashedPassword = await bcrypt.hash(data.password, 10)
        NewUser.password = hashedPassword

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        NewUser.otp = otp;

        // Save user to database
        await NewUser.save();

        // Send OTP to user's email
        await sendOTPEmail(NewUser)

        return res.status(201).json({
            message: "user created successfully please verify your email",
            result: NewUser
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        })
    }
}
const sendOTPEmail = async (user) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.mail,
            pass: process.env.password
        }
    })

    const mailOptions = {
        from: process.env.mail,
        to: user.E_mail,
        subject: 'Verify your email',
        text: `Dear ${user.First_Name} Your OTP Code for Account Registration is: ${user.otp} Do not share it with anyone.`
    };
    console.log(`Sending OTP ${user.otp} to user's email ${user.E_mail}`);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
}

const GetUser = async (req, res) => {
    try {
        const Users = await User.find({})
        return res.status(200).json({
            message: "users fetched successfully",
            result: Users
        })
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
const updateUser = async (req, res) => {
    const id = req.params.id;
    const { First_Name, Last_Name, E_mail, Phone, Alt_phone, address } = req.body;
    
    console.log("Updating user with ID:", id);
    console.log("Update data:", { First_Name, Last_Name, E_mail, Phone, Alt_phone, address });

    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        // Update only the fields provided
        const updateData = {
            ...(First_Name && { First_Name }),
            ...(Last_Name && { Last_Name }),
            ...(E_mail && { E_mail }),
            ...(Phone && { Phone }),
            ...(Alt_phone && { Alt_phone }),
            ...(address && { address })
        };

        const result = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });

        console.log("Update result:", result);
        return res.status(200).json({
            message: "User updated successfully",
            result
        });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ message: error.message });
    }
};




const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findOne({
            _id: id
        })
        if (!user)
            return res.status(404).json({ message: "user not found" })
        await User.findByIdAndDelete(id);
        return res.status(200).json({ message: "user deleted successfully" })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const AddAddress = async (req, res) => {
    const { E_mail, address } = req.body; // Extract E_mail and address from the request body
    console.log(`E_mail: ${E_mail}`);
    console.log(`Address: ${JSON.stringify(address)}`);

    try {
        const user = await User.findOne({ E_mail: E_mail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.address = address;
        await user.save();
        return res.status(200).json({ message: "Address saved successfully", user: user });
    } catch (error) {
        console.error(`Error: ${error.message}`); // Log error for debugging
        return res.status(500).json({ message: error.message });
    }
};

// module.exports = AddAddress;


const verifyOTP = async (req, res) => {
    const E_mail = req.body.E_mail;
    const otp = req.body.otp;

    try {
        const user = await User.findOne({
            E_mail: E_mail
        })
        console.log(user); // Log the user's document to see if OTP is being saved correctly

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (!user.otp || Number(user.otp) !== otp) { // Convert user.otp to a number before comparing
            // console.log("Invalid OTP");
            // console.log(user.otp); // Log the user's OTP to see if it matches the entered OTP
            // console.log(otp); // Log the entered OTP to see if it matches the user's OTP
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Update user's verified status
        user.verified = true;
        await user.save();

        return res.status(200).json({
            message: "OTP verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
module.exports = {
    createUser,
    verifyOTP,
    // sendGreetingEmail,
    GetUser,
    updateUser,
    deleteUser,
    AddAddress
}