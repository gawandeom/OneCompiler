import { createClient } from "redis";
import { spawn } from "node:child_process";
import fs from "fs";
import { prisma } from "./db.ts";
import path from "path";

const client = createClient();

client.on("error", (err) => {
  console.log("Redis connection error");
});

const CONCURRENCY = 5
const PYTHON_COMMAND = process.platform === "win32" ? "py" : "python3";

const LANG_CONFIG: Record<"js" | "py", { file: string; command: string ,image: string} > = {
  js: {
    file: "a.js",
    command: "node",
    image: "node:20-slim",
  },

  py: {
    file: "a.py",
    command: "python3",
    image: "python:3.11-slim"
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
    const codeDir = path.join(__dirname + "/code")
    fs.mkdirSync(codeDir, { recursive: true });
    const filepath = path.join(codeDir+ "/" + config.file);
    fs.writeFileSync(filepath, code);

    const dockerArgs = [
      "run",
      "--rm",                              // auto-remove the container when it exits
      "--network", "none",                 // no internet access from inside
      "--memory", "100m",                  // hard memory cap
      "--cpus", "0.5",                     // hard CPU cap
      "-v", `${codeDir}:/app`,             // mount the WHOLE code folder, not just one file
      config.image,                        // e.g. python:3.11-slim
      config.command,                      // e.g. python3
      `/app/${config.file}`,               // the path INSIDE the container
    ];

    const CompilerResponse = spawn("docker", dockerArgs);

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
        await dbFunction(id, data)
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
