import express, { urlencoded } from "express";
import "dotenv/config";
import { prisma } from "@onecompiler/db";
import cookieParser from "cookie-parser";
import { createClient } from "redis";
import cors from "cors";

const app = express();

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

app.use(
  express.json({
    limit: "16kb",
  }),
);
app.use(
  urlencoded({
    extended: true,
  }),
);

app.use(cors())

app.use(cookieParser());

app.get("/health", async (req, res) => {
 
});

app.post("/execute", async (req, res) => {
  const { code, lang,input } = req.body;

  try {
    

    const response = await prisma.submission.create({
      data: {
        code,
        lang,
        status: "processing",
        output:"",
        input
      },
    });

    

    await client.lPush("problems", JSON.stringify({id:response.id ,code, lang ,input}));
    res.status(200).json({submissionId:response.id} );
  } catch (error) {
    console.log("Error in executing code", error);
    res.status(400).send("Error in executing code .");
  }
});



app.get("/submission/:sumissionId", async(req,res)=>{
        const id = req.params.sumissionId

      const respose = await prisma.submission.findFirst({where:{id}})

      res.status(200).json({
        result:respose
      })

})





async function startServer() {
  try {
    const PORT = process.env.PORT || 5000;

    await client.connect();
    console.log("Connected to Redis");

    app.listen(Number(PORT), () => {
      console.log(`server is runing on port: ${PORT}`);
    });
  } catch (error) {
    console.log("error on connecting to the redis server");
  }
}

startServer();
