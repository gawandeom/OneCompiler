import express, { urlencoded } from "express";
import "dotenv/config";
import { prisma } from "./db";
import cookieParser from "cookie-parser";
import { createClient } from "redis";

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

app.use(cookieParser());

app.get("/health", async (req, res) => {
 
});

app.post("/execute", async (req, res) => {
  const { code, lang } = req.body;

  try {
    

    const response = await prisma.sumission.create({
      data: {
        code,
        lang,
        status: "processing",
        output:""
      },
    });

    

    await client.lPush("problems", JSON.stringify({id:response.id ,code, lang }));
    res.status(200).send("Submission received and stored.");
  } catch (error) {
    console.log("Error in executing code", error);
    res.status(400).send("Error in executing code .");
  }
});

async function startServer() {
  try {
    const PORT = process.env.PORT || 3000;

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
