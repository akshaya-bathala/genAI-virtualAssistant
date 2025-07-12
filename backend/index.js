import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import cors from 'cors'
import geminiResponse from "./gemini.js"

// config to start
dotenv.config()

const app = express()
app.use(cors({
    origin:"https://virtualassistant-uoli.onrender.com",
    credentials:true
}))
const port = process.env.PORT || 5000

// app.get("/",(req,res)=>{
//     res.send("hiii")
//     })

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

// app.get("/",async (req,res)=>{
//     let prompt = req.query.prompt
//     let data = await geminiResponse(prompt)
//     res.json(data)
// })

app.listen(port, ()=>{
    connectDb()
    console.log("server started")
})
