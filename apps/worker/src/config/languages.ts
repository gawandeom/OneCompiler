type LanguageKey = "js" | "py" | "cpp"|"java";

type LanguageConfig = {
  file: string;
  fileExtension:string;
  compile_cmd?: (filePath: string) => string ;
  run_cmd: (filePath: string) => string ;
  image: string;
};

export const LANG_CONFIG: Record<LanguageKey, LanguageConfig> = {
  js: {
    file: "a.js",
    fileExtension:"js"
,    run_cmd: (file) => `node ${file}`,
    image: "node:20-slim",
  },

  py: {
    file: "a.py",
    fileExtension:"py",
    run_cmd: (file)=> `python3 ${file}`,
    image: "python:3.11-slim",
  },
  cpp: {
    file: "main.cpp",
    fileExtension:"cpp",
    compile_cmd: (file)=>`g++ ${file} -o main`,
    run_cmd:(file) => `./main`,
    image: "gcc:latest",
  },
  java: {
    file:"Main.java",
    fileExtension: "java",
    compile_cmd: (file) => `javac ${file}`,
    // Java class name must match filename — usually you name the file Main.java
    run_cmd: (file) => `java Main}`,
    image:"eclipse-temurin:21-jdk"
  },
};
