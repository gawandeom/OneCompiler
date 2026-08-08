import "dotenv/config";

import dbFunction from "../db/submissions.js";
import runCode from "../executor/dockerExecutor.js";
import { CONCURRENCY, connection } from "./redisClient.js";
import { Worker, Job } from "bullmq";

const queueName = process.env.QUEUE_NAME;

if (!queueName) {
  throw new Error("QUEUE_NAME must be set");
}

const worker = new Worker(
  queueName,
  async (job: Job) => {
    const { submissionId, code, lang, input } = job.data;
    if (typeof submissionId !== "string") {
      throw new Error("Job is missing a submission ID");
    }

    let data;

    try {
      data = await runCode(code, lang, submissionId, input);
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      await dbFunction(submissionId, {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        output: "",
      });
      return;
    }

    await dbFunction(submissionId, data as any);
  },
  { connection, concurrency: CONCURRENCY },
);
