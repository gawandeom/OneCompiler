import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => {
  console.log("Redis connection error");
});

export const CONCURRENCY = 5;
export default client