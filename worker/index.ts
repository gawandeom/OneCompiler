import { createClient } from "redis";
import { spawn } from "node:child_process";
import fs from "fs";
import { prisma } from "./db.ts";


const client = createClient();

client.on("error", (err) => {
  console.log("Redis connection error");
});

const CONCURRENCY = 5
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


type dbResponse = {
  success: boolean,
  error: string,
  output: string,
}

const dbFunction = async (id: string, data: dbResponse) => {
  const dbRes = await prisma.submission.update({
    where: { id },
    data: {
      status: data.success ? "sucess" : "failure",
      error: data.success ? "" : data.error,
      output: data.output,
    },
  });
}

async function workerLoop() {
  while (true) {
    const response = await client.blPop("problems", 0);
    if (!response) continue;
    const { id, code, lang } = JSON.parse(response.element);
    try {
      const data = await runCode(code, lang);
        await dbFunction(id, data?);
    } catch (err) {
      console.error(`Job ${id} failed:`, err);
        await dbFunction(id, {
          success: false,
          error: err instanceof Error ? err.message : String(err),
          output: "",
        });
    }
  }
}

async function startWorker() {
  await client.connect();
  console.log("Worker connected to Redis");
  await Promise.all(Array.from({ length: CONCURRENCY }, workerLoop));
}

startWorker()
