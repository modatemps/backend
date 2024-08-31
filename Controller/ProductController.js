// const User = require("../models/UserSchema")

require("dotenv").config()

const Product = require("../models/ProductSchema");

const CreateProduct = async (req, res) => {
    const data = req.body
    const NewProduct = new Product(data)

    console.log(data);
    try {
        const ProductExist = await Product.findOne({
            Title: data.Title
        })
        if (ProductExist) return res.status(400).json({
            message: "product is already here"
        })
        await NewProduct.save()
        return res.status(200).json({
            message: "product created successfully",
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
const GetProducts = async (req, res) => {
    try {
        const products = await Product.find()
        return res.status(200).json(products)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


const Get_One = async (req, res) => {

    const id = req.params.id;
    try {
        const products = await Product.findOne({
            _id: id
        })
        if (!products) {
            return res.status(404).json({
                message: 'user not found '
            })
        }
        return res.status(200).json({
            message: "product fetched",
            result: products
        })
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const Update = async (req, res) => {
    const id = req.params.id
    const data = req.body
    console.log(id, data);
    try {
        const product = await Product.findById({ _id: id })
        if (!product) {
            return res.status(404).json({
                message: "product not found"
            })
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

        return res.status(200).json({
            message: "product updated",
            result: data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const Delete = async (req, res) => {
    const id = req.params.id
    try {
        const product = await Product.findOne({ _id: id })
        if (!product) {
            return res.status(404).json({
                message: "Product Not Found "
            })
        }
        const Deletedproduct = await Product.findByIdAndDelete(id)
        return res.status(200).json({
            message: "Product Added Successfully",
            return: Deletedproduct
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
module.exports = { CreateProduct, GetProducts, Get_One, Update ,Delete}