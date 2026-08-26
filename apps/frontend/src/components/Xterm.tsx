import { Terminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";
const term = new Terminal();

function Xterm({ code, language }: { code: string; language: string }) {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const socket = useRef<WebSocket | null>(null);
  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }

    term.open(terminalRef.current);
    term.write("Welcome to the Terminal!\r\n");

    const ws = new WebSocket("ws://localhost:8080");
    socket.current = ws;
    ws.onmessage = (event) => term.write(event.data);
    term.onData((data) => ws.send(data));
    return () => ws.close();
  }, []);

  useEffect(() => {
  const ws = socket.current;
  if (!ws) return;

  const initialize = () =>
    ws.send(JSON.stringify({ type: "terminal-init", lang: language, code }));

  if (ws.readyState === WebSocket.OPEN) {
    initialize();
  } else {
    ws.addEventListener("open", initialize);
    return () => ws.removeEventListener("open", initialize);
  }
}, [language]);

 useEffect(() => {
  const ws = socket.current;
  if (!ws) return;

  const initialize = () =>
    ws.send(JSON.stringify({ type: "terminal-file", lang: language, code }));

  if (ws.readyState === WebSocket.OPEN) {
    initialize();
  } else {
    ws.addEventListener("open", initialize);
    return () => ws.removeEventListener("open", initialize);
  }
}, [code]);

  return (
    <>
      <div className="h-full w-full" ref={terminalRef}></div>
    </>
  );
}

export default Xterm;
