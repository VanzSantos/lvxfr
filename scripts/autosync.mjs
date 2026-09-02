// Observa TODA a área de trabalho do design system — contratos/, tokens/ e
// src/ (componentes, telas/protótipos, Playground, ProtoTable) — e, depois
// de um período sem mudanças (debounce), commita e envia (push)
// automaticamente. Escopo amplo por pedido explícito do usuário: qualquer
// Product Designer usando este repo (contrato novo/ajustado, token
// novo/ajustado, componente novo/ajustado, protótipo novo/ajustado) deve
// ter o trabalho registrado e enviado sem precisar lembrar de dar push —
// quem decide o que entra no projeto principal é o dono do repositório, na
// revisão do PR (ver CONTRIBUTING.md), não este script. Uso interno de uma
// única empresa, sem preocupação de privacidade entre produtos (decisão
// explícita do usuário) — por isso está ligado por padrão em `npm run dev`.
//
// NUNCA força push. Se o push normal falhar (histórico divergente), só avisa
// no terminal — resolver isso é manual, sempre.
//
// Opt-out: AUTOSYNC=0 npm run dev

import { execFileSync } from "node:child_process";
import { watch } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const DEBOUNCE_MS = Number(process.env.AUTOSYNC_DEBOUNCE_MS) || 20_000;

// Pastas observadas — cobrem tudo que um Product Designer mexe usando IA
// neste repo: contratos de componente, tokens, implementação (componentes),
// Playground e ProtoTable (ambos dentro de src/interface), e telas/protótipos
// (src/interface/screens). Deliberadamente NÃO inclui a raiz do repo inteira
// (evita disparar em node_modules/dist/.git — já fora do watch, não só do
// .gitignore — e em edições soltas de arquivo que não sejam do design
// system, ex.: scratch files).
const WATCHED_DIRS = ["contratos", "tokens", "src"];

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
  console.log(`[autosync] ${message}`);
}

/** Resume os arquivos staged num rótulo curto pro commit — ex.: "contratos,
    src/components" — em vez de listar cada arquivo (podem ser dezenas numa
    sessão de edição real). Vira a primeira linha (assunto) do commit. */
function summarizeStagedPaths(names) {
  const groups = new Set(
    names.map((name) => {
      const parts = name.split("/");
      return parts.length > 1 ? parts.slice(0, 2).join("/") : parts[0];
    })
  );
  return [...groups].sort().join(", ") || "alterações";
}

function readJsonAtRef(ref, path) {
  try {
    return JSON.parse(git(["show", `${ref}:${path}`]));
  } catch {
    return null;
  }
}

/** Conteúdo STAGED (índice) de um arquivo — sintaxe própria do git, não é
    "ref:path" com ref="" (isso gera "::path", inválido). BUG REAL pego
    testando de verdade: a primeira versão deste script usava readJsonAtRef
    genérico pros dois lados da comparação, e o lado "staged" sempre
    resultava em null (decisões novas nunca apareciam na mensagem de
    commit, mesmo havendo uma de verdade). */
function readStagedJson(path) {
  try {
    return JSON.parse(git(["show", `:${path}`]));
  } catch {
    return null;
  }
}

/** Monta o CORPO do commit (além do assunto curto) — lista os arquivos
    alterados e, pra cada contrato tocado, as entradas NOVAS de `decisions`
    (comparando o HEAD anterior com o que está staged agora) — mesma lógica
    já usada em scripts/pr-decisions-diff.mjs pro comentário automático de
    PR, só que rodando localmente a cada commit em vez de uma vez por PR.
    É o que faz o histórico do autosync dar pra entender sem precisar abrir
    cada arquivo depois — pedido explícito do usuário. */
function buildCommitBody(names) {
  const lines = [];

  const MAX_FILES_LISTED = 30;
  lines.push("Arquivos alterados:");
  for (const name of names.slice(0, MAX_FILES_LISTED)) lines.push(`- ${name}`);
  if (names.length > MAX_FILES_LISTED) lines.push(`- (+${names.length - MAX_FILES_LISTED} arquivo(s) a mais)`);

  const changedContracts = names.filter((name) => name.startsWith("contratos/") && name.endsWith(".contract.json"));
  if (changedContracts.length > 0) {
    lines.push("");
    lines.push("Decisões novas:");
    for (const path of changedContracts) {
      const before = readJsonAtRef("HEAD", path);
      const after = readStagedJson(path);
      if (!before) {
        lines.push(`${path}: contrato novo.`);
        continue;
      }
      if (!after) continue; // removido — nada a resumir
      const beforeDecisions = new Set(Array.isArray(before.decisions) ? before.decisions : []);
      const afterDecisions = Array.isArray(after.decisions) ? after.decisions : [];
      const newDecisions = afterDecisions.filter((d) => !beforeDecisions.has(d));
      if (newDecisions.length === 0) continue;
      lines.push(`${path}:`);
      for (const decision of newDecisions) lines.push(`- ${decision}`);
    }
  }

  return lines.join("\n");
}

function sync() {
  try {
    git(["add", "--", ...WATCHED_DIRS]);
  } catch (err) {
    log(`falha ao "git add": ${err.message}`);
    return;
  }

  if (!hasStagedChanges()) return;

  const names = git(["diff", "--cached", "--name-only"]).split("\n").filter(Boolean);
  const summary = summarizeStagedPaths(names);
  const timestamp = new Date().toISOString();
  const subject = `auto: sync (${summary}) — ${timestamp}`;
  const body = buildCommitBody(names);
  try {
    git(["commit", "-m", subject, "-m", body]);
  } catch (err) {
    log(`falha ao commitar: ${err.message}`);
    return;
  }
  log(`commit criado (${summary}).`);

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
      `⚠️  push falhou (branch ${branch}) — provavelmente histórico divergente. ` +
        `Resolva manualmente com "git pull" antes do próximo autosync. Detalhe: ${err.message.split("\n")[0]}`
    );
  }
}

function main() {
  log(`observando ${WATCHED_DIRS.join(", ")} (debounce ${DEBOUNCE_MS}ms). Ctrl+C pra parar.`);

  let timer = null;

  for (const dir of WATCHED_DIRS) {
    const absolute = join(repoRoot, dir);
    try {
      watch(absolute, { recursive: true }, () => {
        clearTimeout(timer);
        timer = setTimeout(sync, DEBOUNCE_MS);
      });
    } catch (err) {
      log(`não foi possível observar ${dir}: ${err.message}`);
    }
  }
}

main();
