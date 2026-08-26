import { useState } from "react";
import "./index.css";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import { Editor } from "@monaco-editor/react";
import useTheme from "./hooks/useTheme";
import useCodeExecution from "./hooks/useCodeExecution";
import Xterm from "./components/Xterm";
import { LANGUAGES, type ExecutionLanguage } from "./lib/languages";

type RightTab = "output" | "input" | "terminal";

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [code, setCode] = useState("console.log('hello')");
  const [language, setLanguage] = useState<ExecutionLanguage>("javascript");
  const { output, runCode, isRunning } = useCodeExecution();
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<RightTab>("output");

  const tabs: { id: RightTab; label: string }[] = [
    { id: "output", label: "Output" },
    { id: "input", label: "Input" },
    { id: "terminal", label: "Terminal" },
  ];

  return (
    <div className="flex h-dvh w-screen flex-col bg-background text-foreground">
      <NavBar
        theme={theme}
        onToggleTheme={toggleTheme}
        language={language}
        onLanguageChange={setLanguage}
        onRun={() => {
          runCode(code, language, input);
          setActiveTab("output");
        }}
        isRunning={isRunning}
      />
      <div className="flex flex-1 min-h-0">
        <Sidebar language={language} />

        <div className="flex flex-1 min-h-0 flex-col md:flex-row gap-4 p-4">
          <div className="flex-1 min-h-0 border border-border rounded-md overflow-hidden">
            <Editor
              height="100%"
              language={language}
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

          <div className="flex-1 min-h-0 flex flex-col border border-border rounded-md overflow-hidden">
            <div className="flex border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 min-h-0 relative">
              <div className={`absolute inset-0 overflow-auto p-3 ${activeTab === "output" ? "block" : "hidden"}`}>
                {isRunning ? (
                  <span className="text-muted-foreground text-sm">Running...</span>
                ) : (
                  <pre className="text-sm whitespace-pre-wrap">{output || "Run your code to see output here."}</pre>
                )}
              </div>

              <div className={`absolute inset-0 p-3 ${activeTab === "input" ? "block" : "hidden"}`}>
                <textarea
                  className="w-full h-full resize-none border border-border rounded-md p-2 text-sm font-mono bg-background"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter stdin input..."
                />
              </div>

              {/* visibility, not display:none — xterm needs real dimensions to init correctly */}
              <div className={`absolute inset-0 ${activeTab === "terminal" ? "visible" : "invisible"}`}>
                <Xterm code={code} language={language} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;