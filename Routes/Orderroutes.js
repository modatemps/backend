const express = require("express");
const {CreateOrder}=require("../Controller/orderController")
const{createPayment,verifyPayment}=require("../Controller/Payment")
const order_router = express.Router();
const app = express(); 
order_router.post("/create-order",CreateOrder)
order_router.post('/create', createPayment);
order_router.post('/verify', verifyPayment);

module.exports=order_router