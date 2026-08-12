import path from "path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import fs from "fs";
import { LANG_CONFIG } from "../src/config/languages";
import WebSocket, { WebSocketServer } from "ws";
import pty from "node-pty";
import { error } from "node:console";
import { randomUUID } from "node:crypto";
import { exitCode } from "node:process";
import type { tryCatch } from "bullmq";

const sessionRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "sessions"
);




type Language = keyof typeof LANG_CONFIG;

type TerminalMessage =
  | { type: "terminal-init"; lang: Language; code: string }
  | { type: "terminal-file"; code: string };

const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server started on port 8080");

wss.on("connection", (ws) => {
  let sessionId = randomUUID();
  const sessionDir = path.join(sessionRoot,sessionId);
  let terminal: ReturnType<typeof pty.spawn> | undefined;
  let containerName: string | undefined;
  let currentLanguage: Language | undefined;;
  let cleanedUp = false;

  const stopContainer = () => {
    terminal?.kill();
    terminal = undefined;

    if (containerName)
      spawn("docker", ["kill", containerName]).on("error", (error) => {
        console.log(`error while stoping the container ${containerName}`);
      });
    containerName = undefined;
  };
  const cleanup = () => {
    if (cleanedUp) return;

    cleanedUp = true;

    stopContainer();

    fs.rmSync(sessionDir, {
        recursive: true,
        force: true
    });
};

  const startTerminal = (lang: Language, code: string) => {
    let config = LANG_CONFIG[lang];
    stopContainer();

    if (!config) return new Error("Unsupported Language");
    currentLanguage = lang;
    containerName = `web-term${randomUUID()}`;
    fs.mkdirSync(sessionDir, { recursive: true });
    fs.writeFileSync(path.join(sessionDir, config.file), code);

    const dockerArgs = [
      "run",
      "-it",
      "--rm",
      "--name",
      containerName,
      "--network",
      "none",
      "--memory",
      "100m",
      "--cpus",
      "0.5",
      "-v",
      `${sessionDir}:/workspaces`,
      "-w",
      "/workspaces",
      config.image,
      "/bin/bash",
    ];
    terminal = pty.spawn("docker", dockerArgs, {
      name: "xterm-color",
      cols: 80,
      rows: 24,
    });

    terminal.onData((data) => {
     if(ws.readyState === WebSocket.OPEN) ws.send(data);
    });

   terminal.onExit(({ exitCode, signal }) => {
  console.log("PTY exited:", {
    exitCode,
    signal,
  });
});
  };
  const handleMessages = (data: WebSocket.RawData): boolean => {
    let message: TerminalMessage;
    try {
      message = JSON.parse(data.toString()) as TerminalMessage;
    } catch (error) {
      return false;
    }

    if (
      message.type === "terminal-init" &&
      typeof message.code === "string" &&
      message.lang in LANG_CONFIG
    ) {
      startTerminal(message.lang, message.code);
      return true;
    }

    if (
      message.type === "terminal-file" &&
      typeof message.code === "string" &&
      currentLanguage &&
      currentLanguage in LANG_CONFIG
    ) {
      fs.writeFileSync(
        path.join(sessionDir, LANG_CONFIG[currentLanguage].file),
        message.code,
      );
      return true;
    }

    return false;
  };

  ws.on("message", (data) => {
    if (!handleMessages(data)) terminal?.write(data.toString());
  });


  ws.on("close", cleanup);
  ws.on("error", (error) => console.log("WebSocket error:", error.message));
});

