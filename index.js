const express = require('express')
const dotenv = require('dotenv')
dotenv.config()

const router = require('./routers/router')
const connectDb = require('./db/db')
const cookieParser = require("cookie-parser")
const port = 3000
const app= express()
app.set("view engine", "ejs")

app.use("/public" , express.static("public"))
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cookieParser());
app.use("/" , router)

connectDb()

app.listen(port, ()=>{
    console.log(`app running on port : ${port}`)
})
