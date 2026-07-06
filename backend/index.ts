import express, { urlencoded } from "express"
import "dotenv/config";
import { prisma } from "./db";
import cookieParser from "cookie-parser"
const app = express()

app.use(express.json({
    limit:"16kb"
}))
app.use(urlencoded({
    extended:true,
}))

app.use(cookieParser());

app.get('/health',async(req,res)=>{
const users = await prisma.user.findMany()
console.log(users)
    res.send(`user: ${users}`)
}
)

app.listen(3000)