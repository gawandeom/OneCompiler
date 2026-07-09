import { useState } from "react";
import "./index.css";
import NavBar from "./components/NavBar";
import { Editor } from "@monaco-editor/react";
import useTheme from "./hooks/useTheme";
import useCodeExecution from "./hooks/useCodeExecution";



export function App() {
  const { theme, toggleTheme } = useTheme();
  const [code, setCode] = useState("console.log('hello')");
  const { output, runCode, isRunning } = useCodeExecution();

  return (
    <div className="min-h-screen w-screen bg-background text-foreground">
      <NavBar
        theme={theme}
        onToggleTheme={toggleTheme}
        onRun={() => runCode(code)}
      />
      <div className=" flex h-screen w-full">
        <div className="flex-1 border border-border rounded-md m-5 h-5/6">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            language="javascript"
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
        </div>
      </div>
    </div>
  );
}

export default App;
