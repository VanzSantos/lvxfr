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
// TRABALHO EM EQUIPE: este script NUNCA commita nem dá push na `main` (nem na
// `master`). A `main` é protegida e só recebe mudança por Pull Request. Ao
// iniciar, se você estiver nela, o script troca sozinho pra uma branch
// pessoal `wip/<seu-nome>` (nome do `git config user.name`, ou AUTOSYNC_BRANCH
// pra escolher outro) e é nela que commita e envia. Quando o trabalho estiver
// pronto, abra um PR dessa branch pra `main` (ver CONTRIBUTING.md). Se você
// trocar manualmente pra `main` com o autosync rodando, ele só avisa e pausa.
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
  // stderr capturado (não vaza "fatal: ..." de sondagens esperadas, como "essa branch existe?");
  // quando um comando falha de verdade, errLine() mostra a mensagem do git.
  return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function errLine(err) {
  return (err.stderr?.toString().trim() || err.message).split("\n")[0];
}

function currentBranch() {
  return git(["rev-parse", "--abbrev-ref", "HEAD"]);
}

// Branches onde o autosync nunca escreve: a main é compartilhada e protegida (só PR).
const PROTECTED_BRANCHES = ["main", "master"];

function slugify(text) {
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "dev"
  );
}

/** Nome da branch pessoal: AUTOSYNC_BRANCH, senão wip/<user.name do git ou $USER>. */
function personalBranchName() {
  if (process.env.AUTOSYNC_BRANCH) return process.env.AUTOSYNC_BRANCH;
  let who = "";
  try {
    who = git(["config", "user.name"]);
  } catch {
    // sem user.name configurado — cai no usuário do sistema
  }
  return `wip/${slugify(who || process.env.USER || process.env.USERNAME || "dev")}`;
}

/** Se estiver numa branch protegida, troca pra branch pessoal (alterações não commitadas vão junto). */
function ensureNotOnProtectedBranch() {
  const branch = currentBranch();
  if (!PROTECTED_BRANCHES.includes(branch)) return;
  const target = personalBranchName();
  try {
    try {
      git(["switch", target]); // já existe (local ou no origin)
    } catch {
      git(["switch", "-c", target]);
    }
    log(`você estava na ${branch} (protegida, só recebe PR) — troquei pra a branch pessoal "${target}".`);
  } catch (err) {
    log(`⚠️  não consegui sair da ${branch}: ${errLine(err)} — autosync pausado até você trocar de branch.`);
  }
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
  const branch = currentBranch();
  if (branch === "HEAD" || PROTECTED_BRANCHES.includes(branch)) {
    log(
      branch === "HEAD"
        ? "HEAD solto (detached) — autosync pausado, nada commitado."
        : `você está na ${branch} (protegida, só recebe PR) — autosync pausado, nada commitado. Troque pra uma branch (ex.: git switch -c minha-tarefa).`
    );
    return;
  }

  try {
    git(["add", "--", ...WATCHED_DIRS]);
  } catch (err) {
    log(`falha ao "git add": ${errLine(err)}`);
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
    log(`falha ao commitar: ${errLine(err)}`);
    return;
  }
  log(`commit criado (${summary}).`);

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
        `Resolva manualmente com "git pull" antes do próximo autosync. Detalhe: ${errLine(err)}`
    );
  }
}

function main() {
  ensureNotOnProtectedBranch();
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
