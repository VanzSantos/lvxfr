// Gera o manifesto de metadados do ProtoTable a partir do histórico git real de
// cada pasta registrada em src/interface/prototable/registry.ts — mesma
// filosofia de scripts/changelog.mjs: nunca duplicar um estado que o próprio
// git já sabe (autoria, data, histórico de versão).
//
// A árvore Projeto > Módulo > Fluxo > Tela é agregada de baixo pra cima: só
// as Telas (folha) rodam `git log`; Fluxo/Módulo/Projeto herdam a UNIÃO
// deduplicada (por hash) do histórico dos filhos — um commit que tocou 2
// telas do mesmo fluxo não conta 2x.
//
// Uso via CLI:
//   node scripts/prototable-manifest.mjs               -> imprime JSON no stdout
//   node scripts/prototable-manifest.mjs --out <path>   -> grava em <path>
//
// Também exporta buildManifest() pra ser reaproveitado pelo plugin de dev do
// Vite (ver vite.config.ts) — mesma lógica, sem duplicar.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const repoRoot = join(__dirname, "..");
const REGISTRY_PATH = join(repoRoot, "src/interface/prototable/registry.ts");

// Import dinâmico do registro TS não é direto em Node puro — o registro é
// simples o bastante pra extrair via regex, evitando puxar um transpilador só
// pra este script utilitário (mesmo racional de manter scripts/ sem
// dependência nova).
function extractSection(source, constName) {
  const startRe = new RegExp(`export const ${constName}:[^=]*=\\s*\\[`);
  const startMatch = startRe.exec(source);
  if (!startMatch) return "";
  const start = startMatch.index + startMatch[0].length;
  const endIdx = source.indexOf("\n];", start);
  return source.slice(start, endIdx === -1 ? undefined : endIdx);
}

function extractObjects(section, requiredFields, optionalFields = []) {
  const objRe = /\{([^}]*)\}/g;
  const results = [];
  let match;
  while ((match = objRe.exec(section))) {
    const body = match[1];
    const obj = {};
    for (const field of [...requiredFields, ...optionalFields]) {
      const fieldMatch = new RegExp(`${field}:\\s*"([^"]*)"`).exec(body);
      if (fieldMatch) obj[field] = fieldMatch[1];
    }
    if (requiredFields.every((field) => obj[field] !== undefined)) results.push(obj);
  }
  return results;
}

function loadRegistry() {
  const source = readFileSync(REGISTRY_PATH, "utf8");
  return {
    projects: extractObjects(extractSection(source, "PROJECTS"), ["key", "title"], ["description"]),
    modules: extractObjects(extractSection(source, "MODULES"), ["key", "projectKey", "title"], ["description"]),
    flows: extractObjects(extractSection(source, "FLOWS"), ["key", "moduleKey", "title"], ["description"]),
    screens: extractObjects(
      extractSection(source, "SCREENS"),
      ["key", "flowKey", "title", "screenPath", "standaloneStoryId"],
      ["description"]
    ),
  };
}

function gitLog(screenPath) {
  try {
    const raw = execFileSync(
      "git",
      ["log", "--follow", "--format=%H|%an|%aI|%s", "--", screenPath],
      { cwd: repoRoot, encoding: "utf8" }
    ).trim();
    if (!raw) return [];
    return raw.split("\n").map((line) => {
      const [hash, author, date, ...rest] = line.split("|");
      return { hash, shortHash: hash.slice(0, 7), author, date, message: rest.join("|") };
    });
  } catch {
    return [];
  }
}

/** Une o histórico de uma lista de nós-filho (cada um já com `.history`),
    deduplicando por hash de commit, e deriva os campos agregados a partir
    dessa união — mesma forma pros 4 níveis da árvore. */
function aggregateFromChildren(children) {
  const byHash = new Map();
  for (const child of children) {
    for (const commit of child.history) byHash.set(commit.hash, commit);
  }
  const history = [...byHash.values()].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (history.length === 0) {
    return { uncommitted: true, createdBy: null, createdAt: null, lastUpdatedBy: null, lastUpdatedAt: null, commitCount: 0, history: [] };
  }
  const newest = history[0];
  const oldest = history[history.length - 1];
  return {
    uncommitted: false,
    createdBy: oldest.author,
    createdAt: oldest.date,
    lastUpdatedBy: newest.author,
    lastUpdatedAt: newest.date,
    commitCount: history.length,
    history,
  };
}

export function buildManifest() {
  const { projects, modules, flows, screens } = loadRegistry();

  const screenNodes = screens.map((screen) => {
    const history = gitLog(screen.screenPath);
    if (history.length === 0) {
      return { ...screen, uncommitted: true, createdBy: null, createdAt: null, lastUpdatedBy: null, lastUpdatedAt: null, commitCount: 0, history: [] };
    }
    const newest = history[0]; // git log lista do mais recente pro mais antigo
    const oldest = history[history.length - 1];
    return {
      ...screen,
      uncommitted: false,
      createdBy: oldest.author,
      createdAt: oldest.date,
      lastUpdatedBy: newest.author,
      lastUpdatedAt: newest.date,
      commitCount: history.length,
      history,
    };
  });

  const flowNodes = flows.map((flow) => {
    const childScreens = screenNodes.filter((screen) => screen.flowKey === flow.key);
    return { ...flow, ...aggregateFromChildren(childScreens), screens: childScreens };
  });

  const moduleNodes = modules.map((module_) => {
    const childFlows = flowNodes.filter((flow) => flow.moduleKey === module_.key);
    return { ...module_, ...aggregateFromChildren(childFlows), flows: childFlows };
  });

  const projectNodes = projects.map((project) => {
    const childModules = moduleNodes.filter((module_) => module_.projectKey === project.key);
    return { ...project, ...aggregateFromChildren(childModules), modules: childModules };
  });

  return { generatedAt: new Date().toISOString(), projects: projectNodes };
}

function isMainModule() {
  return process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
}

if (isMainModule()) {
  const outIndex = process.argv.indexOf("--out");
  const outPath = outIndex !== -1 ? process.argv[outIndex + 1] : null;
  const json = JSON.stringify(buildManifest(), null, 2);
  if (outPath) {
    writeFileSync(join(repoRoot, outPath), json);
  } else {
    process.stdout.write(json + "\n");
  }
}
