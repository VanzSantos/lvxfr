// Gera o manifesto de metadados do ProtoTable a partir do histórico git real de
// cada pasta registrada em src/interface/prototable/registry.ts — mesma
// filosofia de scripts/changelog.mjs: nunca duplicar um estado que o próprio
// git já sabe (autoria, data, histórico de versão).
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

// Import dinâmico do registro TS não é direto em Node puro — o registro é
// simples o bastante pra extrair via regex, evitando puxar um transpilador só
// pra este script utilitário (mesmo racional de manter scripts/ sem
// dependência nova).
function loadPrototypes() {
  const source = readFileSync(join(repoRoot, "src/interface/prototable/registry.ts"), "utf8");
  const entries = [];
  const objectRe = /\{\s*key:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?screenPath:\s*"([^"]+)"[\s\S]*?standaloneStoryId:\s*"([^"]+)"[\s\S]*?\}/g;
  let match;
  while ((match = objectRe.exec(source))) {
    entries.push({ key: match[1], title: match[2], screenPath: match[3], standaloneStoryId: match[4] });
  }
  return entries;
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

export function buildManifest() {
  const entries = loadPrototypes();

  const prototypes = entries.map((entry) => {
    const history = gitLog(entry.screenPath);
    if (history.length === 0) {
      return { ...entry, uncommitted: true, createdBy: null, createdAt: null, lastUpdatedBy: null, lastUpdatedAt: null, commitCount: 0, history: [] };
    }
    // git log lista do mais recente pro mais antigo
    const newest = history[0];
    const oldest = history[history.length - 1];
    return {
      ...entry,
      uncommitted: false,
      createdBy: oldest.author,
      createdAt: oldest.date,
      lastUpdatedBy: newest.author,
      lastUpdatedAt: newest.date,
      commitCount: history.length,
      history,
    };
  });

  return { generatedAt: new Date().toISOString(), prototypes };
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
