import "dotenv/config";
import { Queue } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@onecompiler/db";

const queueName = process.env.QUEUE_NAME;

if (!queueName) {
  throw new Error("QUEUE_NAME must be set");
}

const connection = new IORedis("redis://localhost:6379", {
  maxRetriesPerRequest: null,
});
const queue = new Queue(queueName, { connection });

async function main() {
  const jobs = [
    {lang: "js", code: `setTimeout(() => console.log("JOB A"), 2000)`,status:"processing" , output:"" },
    {lang: "js", code: `setTimeout(() => console.log("JOB B"), 2000)`,status:"processing" , output:"" },
    {lang: "js", code: `setTimeout(() => console.log("JOB C"), 2000)`,status:"processing" , output:"" },

  ];

  

    for (const job of jobs) {
      const res = await prisma.submission.create({ data: job as any });
      await queue.add("execute", {
        submissionId: res.id,
        code: job.code,
        lang: job.lang,
        input: "",
      });
      console.log(`Pushed ${res.id} -> expecting output containing "${job.code.split('"')[1]}"`);
  }

  await queue.close();
  await connection.quit();
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await queue.close();
  await connection.quit();
  await prisma.$disconnect();
  process.exitCode = 1;
});
