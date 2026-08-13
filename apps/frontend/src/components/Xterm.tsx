import { Terminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";
const term = new Terminal();

function Xterm({code, language}: {code: string, language: string}) {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const socket = useRef<WebSocket | null>(null);
  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }
    
    
    
    term.open(terminalRef.current);
    term.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
    
    const ws = new WebSocket("ws://localhost:8080");
    socket.current = ws
    ws.onmessage = (event) => term.write(event.data);
    term.onData((data) => ws.send(data));
    return () => ws.close();
  });


useEffect(() => {
    const ws = socket.current
    const initialize = () => ws?.send(JSON.stringify({ type: "terminal-init", lang: language, code }));
    ws?.addEventListener("open", initialize);
    return () => ws?.removeEventListener("open", initialize);
  }, [language, code]);

  

  return (
    <>
      <div className="h-full w-full" ref={terminalRef}></div>
    </>
  );
}

export default Xterm;
