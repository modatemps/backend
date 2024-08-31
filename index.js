const express = require("express");
const mongoose = require("mongoose");
const route = require("./Routes/UserRoutes.js")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors");
const prod_router = require("./Routes/ProductsRoutes.js");
const order_router = require("./Routes/Orderroutes.js");
require("dotenv").config()

const app = express()
app.use(cors());


app.use(bodyParser.json({ extended: true, limit: "5mb" }))
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }))
app.use(express.json({ extended: true, limit: "5mb" }))
app.use(express.urlencoded({ extended: true, limit: "5mb" }))

app.use(morgan("dev"))


app.use("/user", route)
app.use("/product",prod_router)
app.use("/orders",order_router)
app.use("/", (req, res) => {
    res.send("hello world")
})

mongoose.connect(process.env.mongoDB_URL, {})
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("server is up and running");
            console.log("connected to the database");
        })

    })
    .catch((err) => {
        console.log(err.message);
    })

