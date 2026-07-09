import { use, useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import "./index.css";
import NavBar from "./components/NavBar";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { Summary } from "lucide-react";

const THEME_STORAGE_KEY = "onecompiler-theme";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [code, setCode] = useState("console.log('hello')");
  const [submissionId, setSubmissionId] = useState(null);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput("Processing");

    try {
      const response = await axios.post("http://localhost:5000/execute", {
        code,
        lang: "js",
      });
      setSubmissionId(response.data.submissionId);
    } catch (error) {
      setOutput("Failed to submit code");
      setIsRunning(false);
    }
  }, [code]);


    useEffect( ()=>{

      if(!submissionId) return 
      let cancelled = false 

      let timeoutId:ReturnType<typeof setTimeout>;


    const poll = async()=>{
        try {

        const response = await axios.get(`http://localhost:5000/submission/${submissionId}`);

        if(cancelled) return

        const {status,output,error} = response.data.result

    if(status === "processing"){
      timeoutId = setTimeout(poll, 1000);
    }
    else{
      setOutput(status === "sucess"? output : error)
      setIsRunning(false)
    }
      
        
      } catch (error) {
        console.log('Error in getting output')
      }
    }
     poll();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };

    },[submissionId])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  return (
    <div className="min-h-screen w-screen bg-background text-foreground">
      <NavBar theme={theme} onToggleTheme={toggleTheme} onRun={runCode} />
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
