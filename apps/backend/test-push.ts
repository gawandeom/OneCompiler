// test-push.ts
import { createClient } from "redis";
import { randomUUID } from "node:crypto";
import { prisma } from "@onecompiler/db";

const client = createClient();

async function main() {
  await client.connect();
  setTimeout(()=>{},2000)

  const jobs = [
    {lang: "js", code: `setTimeout(() => console.log("JOB A"), 2000)`,status:"processing" , output:"" },
    {lang: "js", code: `setTimeout(() => console.log("JOB B"), 2000)`,status:"processing" , output:"" },
    {lang: "js", code: `setTimeout(() => console.log("JOB C"), 2000)`,status:"processing" , output:"" },

  ];

  

    for (const job of jobs) {
      // Prisma's generated types expect a specific Status enum; cast to any for this test helper
      const res = await prisma.submission.create({ data: job as any });
      await client.rPush("problems", JSON.stringify({ id: res.id, code: job.code, lang: job.lang }));
      console.log(`Pushed ${res.id} -> expecting output containing "${job.code.split('"')[1]}"`);
  }

   client.destroy();
}

main();
