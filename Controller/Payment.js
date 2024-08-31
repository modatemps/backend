const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { Cashfree } = require('cashfree-pg');

Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

function generateOrderId() {
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256');
    hash.update(uniqueId);
    const orderId = hash.digest('hex');
    return orderId.substr(0, 12); // Adjust if necessary
}

const createPayment = async (req, res) => {
    try {
        console.log("Received data:", req.body);  // Log incoming data

        const { customer_name, customer_email, customer_phone, order_amount } = req.body;

        if (typeof customer_phone !== 'string') {
            return res.status(400).json({
                message: "customer_details.customer_phone should be string",
                code: "customer_details.customer_phone_invalid",
                type: "invalid_request_error",
            });
        }

        // Proceed with the rest of your code...
    } catch (error) {
        console.error("Error in createPayment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};





const verifyPayment = async (req, res) => {
    try {
        let { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
        res.json(response.data);

    } catch (error) {
        console.error("Cashfree API Error:", error.response?.data?.message || error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



module.exports = {
    createPayment,
    verifyPayment,
    generateOrderId
};
