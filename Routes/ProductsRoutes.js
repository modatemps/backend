const express = require("express");
const { CreateProduct,GetProducts,Get_One,Update, Delete } = require("../Controller/ProductController")

const prod_router = express.Router();
const app = express(); // Create an instance of the Express app

prod_router.post("/create",CreateProduct)
prod_router.get("/get-products",GetProducts)
prod_router.get("/get-one/:id",Get_One)
prod_router.put("/update/:id",Update)
prod_router.delete("/delete/:id",Delete)
module.exports = prod_router