
const PYTHON_COMMAND = process.platform === "win32" ? "py" : "python3";

type LanguageKey = "js" | "py" | "cpp";

type LanguageConfig = {
  file: string;
  compile_cmd: string | null;
  run_cmd: string;
  image: string;
};

export const LANG_CONFIG: Record<LanguageKey, LanguageConfig> = {
  js: {
    file: "a.js",
    compile_cmd:null,
    run_cmd: "node",
    image: "node:20-slim",
  },

  py: {
    file: "a.py",
    compile_cmd:null,
    run_cmd: PYTHON_COMMAND,
    image: "python:3.11-slim",
  },
  cpp:{
    file: "main.cpp",
    compile_cmd:"g++ main.cpp -o main",
    run_cmd: "./main",
    image: "gcc",
  }
};