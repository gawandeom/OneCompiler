import IORedis from "ioredis"


export const CONCURRENCY = 5;




export const connection = new IORedis({maxRetriesPerRequest: null});

connection.on("error", (err) => {
  console.log("Redis Client Error", err);
});
