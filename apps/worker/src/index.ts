import client, { CONCURRENCY } from "./queue/redisClient";
import workerLoop from "./queue/workerLoop";

async function startWorker() {
  await client.connect();
  console.log("Worker connected to Redis");
  await Promise.all(Array.from({ length: CONCURRENCY }, workerLoop));
}

startWorker();
