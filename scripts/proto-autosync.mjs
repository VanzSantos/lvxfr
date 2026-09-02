// Observa as pastas de protótipo registradas em
// src/interface/prototable/registry.ts e, depois de um período sem mudanças
// (debounce), commita e envia (push) automaticamente — pra que o dono do
// repositório veja o trabalho de qualquer testador sem depender de lembrete
// manual. Uso interno de uma única empresa, sem preocupação de privacidade
// entre produtos (decisão explícita do usuário) — por isso está ligado por
// padrão em `npm run dev`.
//
// NUNCA força push. Se o push normal falhar (histórico divergente), só avisa
// no terminal — resolver isso é manual, sempre.
//
// Opt-out: PROTO_AUTOSYNC=0 npm run dev

import { execFileSync } from "node:child_process";
import { readFileSync, watch } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const DEBOUNCE_MS = Number(process.env.PROTO_AUTOSYNC_DEBOUNCE_MS) || 20_000;

function loadPrototypePaths() {
  const source = readFileSync(join(repoRoot, "src/interface/prototable/registry.ts"), "utf8");
  const paths = [];
  const re = /screenPath:\s*"([^"]+)"/g;
  let match;
  while ((match = re.exec(source))) paths.push(match[1]);
  return paths;
}

function git(args) {
  return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" }).trim();
}

function currentBranch() {
  return git(["rev-parse", "--abbrev-ref", "HEAD"]);
}

function hasStagedChanges() {
  try {
    git(["diff", "--cached", "--quiet"]);
    return false;
  } catch {
    return true;
  }
}

function hasUpstream(branch) {
  try {
    git(["rev-parse", "--abbrev-ref", `${branch}@{upstream}`]);
    return true;
  } catch {
    return false;
  }
}

function log(message) {
  console.log(`[proto-autosync] ${message}`);
}

function syncPath(path) {
  try {
    git(["add", "--", path]);
  } catch (err) {
    log(`falha ao "git add" em ${path}: ${err.message}`);
    return;
  }

  if (!hasStagedChanges()) return;

  const timestamp = new Date().toISOString();
  try {
    git(["commit", "-m", `auto: sync protótipo ${path} (${timestamp})`]);
  } catch (err) {
    log(`falha ao commitar ${path}: ${err.message}`);
    return;
  }
  log(`commit criado para ${path}.`);

  const branch = currentBranch();
  try {
    if (hasUpstream(branch)) {
      git(["push"]);
    } else {
      git(["push", "-u", "origin", branch]);
    }
    log(`push enviado (branch ${branch}).`);
  } catch (err) {
    log(
      `⚠️  push falhou pra ${path} (branch ${branch}) — provavelmente histórico divergente. ` +
        `Resolva manualmente com "git pull" antes do próximo autosync. Detalhe: ${err.message.split("\n")[0]}`
    );
  }
}

function main() {
  const paths = loadPrototypePaths();
  if (paths.length === 0) {
    log("nenhum protótipo registrado em src/interface/prototable/registry.ts — nada a observar.");
    return;
  }

  log(`observando ${paths.length} pasta(s) de protótipo (debounce ${DEBOUNCE_MS}ms). Ctrl+C pra parar.`);

  const timers = new Map();

  for (const path of paths) {
    const absolute = join(repoRoot, path);
    try {
      watch(absolute, { recursive: true }, () => {
        clearTimeout(timers.get(path));
        timers.set(
          path,
          setTimeout(() => syncPath(path), DEBOUNCE_MS)
        );
      });
    } catch (err) {
      log(`não foi possível observar ${path}: ${err.message}`);
    }
  }
}

main();
