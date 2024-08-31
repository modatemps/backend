const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    First_Name: { type: String, required: true },
    Last_Name: { type: String },
    E_mail: { type: String, required: true, unique: true },
    Phone: { type: Number, required: true },
    Alt_phone: { type: Number },
    password: { type: String, required: true },
    is_admin: { type: Boolean, default: false }, 
    address: {
        country: { type: String  },
        state: { type: String },
        city: { type: String },
        area: { type: String },
        landmark: { type: String },
        pincode: { type: Number },
        house:{type:String},

    }  ,
    otp: { type: Number, required: false },
    otpExpiresAt: { 
        type: Date, 
        required: false, 
        index: { expires: '10m' } 
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
