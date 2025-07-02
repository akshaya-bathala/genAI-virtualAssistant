import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"

// config to start
dotenv.config()

const app = express()
const port = process.env.port || 5000

// app.get("/",(req,res)=>{
//     res.send("hiii")
//     })

app.listen(port, ()=>{
    connectDb()
    console.log("server started")
})