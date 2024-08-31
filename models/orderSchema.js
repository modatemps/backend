const mongoose = require("mongoose");
const orderSchmea = new mongoose.Schema({

    payment_status: { type: Boolean },
    // user_details:{}

    title: { type: String, required: true },
    quantity: { type: Number },
    price:{type:String},
    totalprice:{type:Number},
    size: { type: String },
    color: { Type: String },
    userId: { type: String },
    FirstName: { type: String },
    LastName: { type: String },
    E_mail: { type: String },
    Phone: { type: Number },
    Alt_phone: { type: String },


}, { timestamps: true })
const orders = mongoose.model("orders", orderSchmea)
module.exports = orders