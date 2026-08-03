
const PYTHON_COMMAND = process.platform === "win32" ? "py" : "python3";

export const LANG_CONFIG: Record<
  "js" | "py",
  { file: string; command: string; image: string }
> = {
  js: {
    file: "a.js",
    command: "node",
    image: "node:20-slim",
  },

  py: {
    file: "a.py",
    command: "python3",
    image: "python:3.11-slim",
  },
};