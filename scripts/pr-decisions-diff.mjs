#!/usr/bin/env node
// Roda em CI (ver .github/workflows/ci.yml) num Pull Request: compara os
// contratos alterados entre a base e o head do PR, e lista as entradas NOVAS
// do array `decisions` de cada um — vira o comentário automático que ajuda a
// revisão manual sem precisar abrir os 67 arquivos de contrato.
//
// Uso: node scripts/pr-decisions-diff.mjs <base-ref> <head-ref> > summary.md
// Requer um clone com histórico suficiente (actions/checkout fetch-depth: 0).

import { execSync } from "node:child_process";

const [, , baseRef, headRef] = process.argv;

if (!baseRef || !headRef) {
  console.error("Uso: node scripts/pr-decisions-diff.mjs <base-ref> <head-ref>");
  process.exit(1);
}

function sh(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

function readJsonAtRef(ref, path) {
  try {
    const raw = sh(`git show ${ref}:${path}`);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

let changedFiles = [];
try {
  changedFiles = sh(`git diff --name-only ${baseRef}...${headRef} -- contratos/`)
    .split("\n")
    .filter((f) => f.endsWith(".contract.json"));
} catch (err) {
  console.error(`Não foi possível diffar ${baseRef}...${headRef}: ${err.message}`);
  process.exit(0); // não falha o job por isso, só não posta o resumo
}

if (changedFiles.length === 0) {
  console.log("Nenhum contrato (`contratos/*.contract.json`) foi alterado neste PR.");
  process.exit(0);
}

const lines = [];
lines.push(`### Contratos alterados neste PR (${changedFiles.length})`);
lines.push("");

for (const file of changedFiles) {
  const before = readJsonAtRef(baseRef, file);
  const after = readJsonAtRef(headRef, file);

  lines.push(`#### \`${file}\``);

  if (!before) {
    lines.push("- Arquivo novo.");
  } else if (!after) {
    lines.push("- Arquivo removido.");
  } else {
    const beforeDecisions = new Set(Array.isArray(before.decisions) ? before.decisions : []);
    const afterDecisions = Array.isArray(after.decisions) ? after.decisions : [];
    const newDecisions = afterDecisions.filter((d) => !beforeDecisions.has(d));

    if (newDecisions.length === 0) {
      lines.push("- ⚠️ Contrato mudou, mas nenhuma entrada nova em `decisions` — confirme se isso é esperado (ver CONTRIBUTING.md).");
    } else {
      for (const decision of newDecisions) {
        lines.push(`- ${decision}`);
      }
    }
  }
  lines.push("");
}

console.log(lines.join("\n"));
