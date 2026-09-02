// Orquestra `vite` + `proto-autosync.mjs` juntos pra `npm run dev` — sem
// depender de um pacote novo tipo `concurrently`, só child_process da stdlib.
// PROTO_AUTOSYNC=0 pula o watcher (sobe só o Vite, como antes desta feature).

import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const autosyncEnabled = process.env.PROTO_AUTOSYNC !== "0";

const children = [];

function spawnChild(command, args, label) {
  const child = spawn(command, args, { cwd: repoRoot, stdio: "inherit" });
  children.push(child);
  child.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[dev] ${label} saiu com código ${code}`);
    }
  });
  return child;
}

spawnChild("npx", ["vite"], "vite");

if (autosyncEnabled) {
  spawnChild("node", [join(__dirname, "proto-autosync.mjs")], "proto-autosync");
} else {
  console.log("[dev] PROTO_AUTOSYNC=0 — autosync de protótipos desligado.");
}

function shutdown() {
  for (const child of children) child.kill();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
