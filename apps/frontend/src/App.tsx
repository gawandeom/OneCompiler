import { useState } from "react";
import "./index.css";
import NavBar from "./components/NavBar";
import { Editor } from "@monaco-editor/react";
import useTheme from "./hooks/useTheme";
import useCodeExecution from "./hooks/useCodeExecution";

type ExecutionLanguage = "js" | "py" | "cpp"|"java";

const monacoLanguageByExecutionLanguage: Record<ExecutionLanguage, string> = {
  js: "javascript",
  py: "python",
  cpp: "cpp",
  java:"java"
};

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [code, setCode] = useState("console.log('hello')");
  const [language, setLanguage] = useState<ExecutionLanguage>("js");
  const { output, runCode, isRunning } = useCodeExecution();
  const [input, setInput] = useState("");

  return (
    <div className="min-h-screen w-screen bg-background text-foreground">
      <NavBar
        theme={theme}
        onToggleTheme={toggleTheme}
        language={language}
        onLanguageChange={setLanguage}
        onRun={() => runCode(code, language, input)}
      />
      <div className=" flex h-screen w-full">
        <div className="flex-1 border border-border rounded-md m-5 h-5/6">
          <Editor
            height="100%"
            language={monacoLanguageByExecutionLanguage[language]}
            value={code}
            onChange={(value) => setCode(value ?? "")}
            theme={theme === "dark" ? "vs-dark" : "vs-light"}
            options={{
              automaticLayout: true,
              minimap: { enabled: false },
              fontSize: 14,
              fontLigatures: true,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              padding: { top: 16 },
            }}
          />
        </div>
        <div className="flex-1 border border-border rounded-md m-5 h-5/6 ">
          <h1>{output}</h1>
          <input 
            className="border border-border rounded-md p-2" 
            onChange={(e) => setInput(e.target.value)} 
            type="text" 
            placeholder="Enter input..." 
            />
            
        </div>
      </div>
    </div>
  );
}

export default App;
