require("dotenv").config()
const order=require("../models/orderSchema")
const CreateOrder = async (req,res) => {
    const data = req.body;
    const neworder = new order(data)
    try {
        await neworder.save()
        return res.status(200).json({
            message: "Order created successfully",
            return: neworder
        })
    } catch (error) {
        return res.status(404).json({
            message: "Error creating order",
        })
    }
}
module.exports = { CreateOrder }