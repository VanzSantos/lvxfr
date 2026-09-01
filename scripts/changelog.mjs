#!/usr/bin/env node
// Varre contratos/*.contract.json e monta um changelog consolidado a partir do
// array `decisions` de cada contrato — a fonte da verdade de decisões já
// existe nos próprios contratos (convenção do harness, ver SKILL.md), este
// script só junta e ordena o que já está lá. Uso: node scripts/changelog.mjs > CHANGELOG.md

import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contratosDir = join(__dirname, "..", "contratos");

const files = readdirSync(contratosDir)
  .filter((f) => f.endsWith(".contract.json"))
  .sort();

const DATE_RE = /\((\d{4}-\d{2}-\d{2})\)/;

/** @type {{ contract: string, date: string | null, text: string }[]} */
const entries = [];

for (const file of files) {
  const raw = readFileSync(join(contratosDir, file), "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`Ignorando ${file}: JSON inválido (${err.message})`);
    continue;
  }
  const decisions = Array.isArray(data.decisions) ? data.decisions : [];
  for (const text of decisions) {
    const match = typeof text === "string" ? text.match(DATE_RE) : null;
    entries.push({ contract: data.name ?? file, date: match ? match[1] : null, text });
  }
}

const dated = entries.filter((e) => e.date).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
const byContract = new Map();
for (const entry of entries) {
  if (!byContract.has(entry.contract)) byContract.set(entry.contract, []);
  byContract.get(entry.contract).push(entry.text);
}

const lines = [];
lines.push("# Changelog");
lines.push("");
lines.push(`Gerado automaticamente por \`npm run changelog\` a partir do array \`decisions\` de cada`);
lines.push(`arquivo em \`contratos/*.contract.json\` — não editar este arquivo à mão, ele é sobrescrito`);
lines.push(`a cada execução. Editar as decisões na fonte (o contrato do componente).`);
lines.push("");
lines.push(`Gerado em: ${new Date().toISOString().slice(0, 10)}`);
lines.push("");

if (dated.length > 0) {
  lines.push("## Decisões com data explícita, mais recentes primeiro");
  lines.push("");
  for (const entry of dated) {
    lines.push(`- **${entry.date}** — _${entry.contract}_: ${entry.text}`);
    lines.push("");
  }
}

lines.push("## Todas as decisões, por componente");
lines.push("");
for (const [contract, texts] of [...byContract.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  lines.push(`### ${contract}`);
  lines.push("");
  for (const text of texts) {
    lines.push(`- ${text}`);
  }
  lines.push("");
}

process.stdout.write(lines.join("\n"));
