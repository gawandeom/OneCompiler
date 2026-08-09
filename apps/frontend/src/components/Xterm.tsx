import { Terminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";
const term = new Terminal();

function Xterm() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }
    term.open(terminalRef.current);
    term.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
    const socket = new WebSocket("ws://localhost:8080");
    socket.onmessage = (event) => term.write(event.data);
    term.onData((data) => socket.send(data));
    return () => socket.close();
  });
  return (
    <>
      <div className="h-full w-full" ref={terminalRef}></div>
    </>
  );
}

export default Xterm;
