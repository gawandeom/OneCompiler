import { createClient } from "redis";
import { spawn } from "node:child_process";
import fs from "fs";
import { prisma } from "./db.ts";


const client = createClient();

client.on("error", (err) => {
  console.log("Redis connection error");
});

const LANG_CONFIG: Record<"js" | "py", { file: string; command: string }> = {
  js: {
    file: "a.js",
    command: "node",
  },

  py: {
    file: "a.py",
    command: "python3",
  },
};

const runCode = (code: string, lang: keyof typeof LANG_CONFIG) => {
  return new Promise((resolvePromise) => {
    let config = LANG_CONFIG[lang];

    if (!config) {
      resolvePromise({
        success: false,
        output: "",
        error: `Unsupported language: ${lang}`,
      });
      return;
    }

    const filepath = __dirname + "/code/" + config.file;
    fs.writeFileSync(filepath, code);
    const CompilerResponse = spawn(config.command, [filepath]);

    let output = "";
    let error = "";
    CompilerResponse.stdout.on("data", (chunk) => {
      output += chunk.toString();
    });

    CompilerResponse.stderr.on("data", (chunk) => {
      error += chunk.toString();
    });

    CompilerResponse.on("error", (error) => {
      resolvePromise({
        success: false,
        output,
        error: error.message,
      });
    });

    const timeout = setTimeout(() => {
      CompilerResponse.kill("SIGKILL");
    }, 10000);

    CompilerResponse.on("exit", (exitcode) => {
      clearTimeout(timeout);
      resolvePromise({
        success: exitcode === 0,
        output,
        error,
      });
    });
  });
};

async function executor() {
  while (true) {
    const response = await client.rPop("problems");

    if (!response) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    let parsedResponse = JSON.parse(response);
    let { id, code, lang } = parsedResponse;

    const ans = await runCode(code, lang);
    

    const dbRes = await prisma.sumission.update({
      where: { id },
      data: {
        status: ans.success ? "sucess" : "failure",
        error: ans.success ? "null" : ans.error,
        output: ans.output,
      },
    });
   
  }
}

async function startWorker() {
  try {
    await client.connect().then();
    console.log("Worker Connected to Redis");

    executor();
  } catch (error) {
    console.log(`error in coonecting to redis ${error}`);
  }
}

startWorker();
