import express from "express"

const app = express()

app.get('/health',(req,res)=>{
    res.send("Health check ")
}
)

app.listen(3000)