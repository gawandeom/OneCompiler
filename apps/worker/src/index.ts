import { connection } from "./queue/redisClient";
import "./queue/workerLoop.js";

connection.on("connect",()=>{
  console.log("connected to redis")
})
