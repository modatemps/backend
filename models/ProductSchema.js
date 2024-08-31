const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
    Title: { type: String, required: true },
    price: { type: Number, required: true },
    Description: { type: String, required: true },
    weight: { type: String },
    collar: [{ type: String }], // Update to accept array of strings
    sleeves: [{ type: String }], // Update to accept array of strings
    fit_type: [{ type: String }],
    Dimension: { type: String },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    off: { type: String },
    category: [],
    URL: [],
    stock: { type: String }
})
const Product = mongoose.model("Product", ProductSchema)
module.exports = Product
