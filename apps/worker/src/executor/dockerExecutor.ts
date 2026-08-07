import path from "path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import fs from "fs";
import { LANG_CONFIG } from "../config/languages";

const workerDir = path.dirname(fileURLToPath(import.meta.url));

const runCode = (code: string, lang: keyof typeof LANG_CONFIG, id: string,input: string) => {
  return new Promise((resolvePromise) => {
    let config = LANG_CONFIG[lang];
    console.log(config)

    if (!config) {
      resolvePromise({
        success: false,
        output: "",
        error: `Unsupported language: ${lang}`,
      });
      return;
    }
    
    const jobDir = path.join(workerDir, "code",id);
    fs.mkdirSync(jobDir, { recursive: true });
    const filepath = path.join(jobDir, config.file);

    const containerName = `sandbox-${id}`;

    fs.writeFileSync(filepath, code);

let containerCmd: string[]

if(config.compile_cmd){
  const compilePart = config.compile_cmd(config.file);
  const runPart = config.run_cmd(config.file);
    const fullCmd = `${compilePart} 2>compile_error.txt || (cat compile_error.txt && exit 99) && ${runPart}`;
      containerCmd = ["bash", "-c", fullCmd];
}
else {
      // interpreted language: just run directly
      // containerCmd = [config.run_cmd, `/app/${config.file}`];
containerCmd = ["bash", "-c", config.run_cmd(config.file)];    }
    const dockerArgs = [
      "run",
      "--rm", // auto-remove the container when it exits
      "--name",
      containerName,
      "--network",
      "none", // no internet access from inside
      "--memory",
      "100m", // hard memory cap
      "--cpus",
      "0.5", // hard CPU cap
      "-v",
      `${jobDir}:/app`, // mount the WHOLE code folder, not just one file
      "-w",
        "/app",
        "-i",
      config.image, // e.g. python:3.11-slim
      ...containerCmd
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

    CompilerResponse.stdin.write(input);
    CompilerResponse.stdin.end();

    const timeout = setTimeout(() => {
      CompilerResponse.kill("SIGKILL");

      spawn("docker", ["kill", containerName]);
    }, 10000);

    CompilerResponse.on("error", (error) => {
      resolvePromise({
        success: false,
        output,
        error: error.message,
      });
    });

    CompilerResponse.on("exit", (exitcode) => {
      clearTimeout(timeout);

       fs.rmSync(jobDir, { recursive: true, force: true });

        if(exitcode === 99){
             resolvePromise({
        success: false,
        output:"",
        error:output,
      });
        }else{
            
        resolvePromise({
        success: exitcode === 0,
        output,
        error,
      });
    }
      
    });
  });
};

export default runCode;

// function buildContainerCmd(lang:string,filePath:string){
// let config = LANG_CONFIG[lang];
//     console.log(config)

//     if (!config) throw new Error(`Unsupported Language ${lang}` )

//       let runCmd = config.run
// }