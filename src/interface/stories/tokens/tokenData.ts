import { ROOT_BLOCK_WITH_COMMENTS, resolveCssVar } from "../specs/tokenResolver";
import { getAllContractSources } from "../contractSource";
import { STORIES } from "../registry";

/* Dados da página de Tokens — tudo derivado de tokens/tokens.css e dos contratos, nada digitado à mão. */

export interface TokenGroup {
  heading: string;
  names: string[];
}

const HEADING_START = /^(Ações|Fundos|Bordas|Textos|Ícones|Estrutural|Tipografia)/;

/** Cabeçalho de grupo a partir de um comentário do tokens.css; null se for só explicação. */
function headingOf(comment: string): string | null {
  const first = comment.trim().split("\n")[0].trim();
  if (!HEADING_START.test(first)) return null;
  const heading = first.split(" — ")[0].trim();
  // "…/ Sinalização" aparece duas vezes: o de fundos claros e o "forte" (sólido)
  return comment.includes('"forte"') ? `${heading} (forte)` : heading;
}

let groupsCache: TokenGroup[] | null = null;

/** Grupos de tokens do :root, na ordem do arquivo, com o nome de cada variável (sem "--"). */
export function tokenGroups(): TokenGroup[] {
  if (groupsCache) return groupsCache;
  const groups: TokenGroup[] = [];
  let current: TokenGroup | undefined;
  for (const match of ROOT_BLOCK_WITH_COMMENTS.matchAll(/\/\*([\s\S]*?)\*\/|(--[\w-]+)\s*:/g)) {
    if (match[1] !== undefined) {
      const heading = headingOf(match[1]);
      if (heading) {
        current = groups.find((g) => g.heading === heading) ?? { heading, names: [] };
        if (!groups.includes(current)) groups.push(current);
      }
    } else if (match[2]) {
      if (!current) {
        current = { heading: "Outros", names: [] };
        groups.push(current);
      }
      current.names.push(match[2].slice(2));
    }
  }
  groupsCache = groups;
  return groups;
}

export function isColor(value: string | null): boolean {
  return Boolean(value && (/^(#|rgb|hsl)/i.test(value) || value === "transparent"));
}

/** Nomes das variáveis de COR de um grupo (ignora o que não é cor). */
export function colorNames(group: TokenGroup): string[] {
  return group.names.filter((name) => isColor(resolveCssVar(name).light));
}

/* ---------- "usado por": quais contratos declaram cada token em tokensAllowed ---------- */

export interface TokenUser {
  label: string;
  href: string;
}

let usageCache: Map<string, TokenUser[]> | null = null;

function stringsOf(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(stringsOf);
  return [];
}

function buildUsage(): Map<string, TokenUser[]> {
  const usage = new Map<string, TokenUser[]>();
  for (const { filename, source } of getAllContractSources()) {
    let contract: { name?: string; tokensAllowed?: Record<string, unknown> };
    try {
      contract = JSON.parse(source);
    } catch {
      continue;
    }
    const story = STORIES.find((item) => item.contractFile?.endsWith(`/${filename}`) || item.contractFile === filename);
    if (!contract.name || !story) continue;
    const user: TokenUser = { label: contract.name, href: `#/${encodeURIComponent(story.id)}` };
    for (const path of stringsOf(Object.values(contract.tokensAllowed ?? {}))) {
      const [, ...rest] = path.split(".");
      const name = rest.join(".");
      if (!name) continue; // palavra-chave CSS (currentColor etc.), não é token
      const list = usage.get(name) ?? [];
      if (!list.some((item) => item.label === user.label)) list.push(user);
      usage.set(name, list);
    }
  }
  for (const list of usage.values()) list.sort((a, b) => a.label.localeCompare(b.label));
  return usage;
}

/** Componentes que declaram o token (nome sem namespace: "espaco-p", "texto-p", "acao-primaria"). */
export function usersOf(name: string): TokenUser[] {
  usageCache ??= buildUsage();
  return usageCache.get(name) ?? [];
}

/* ---------- contraste (só pra tokens de texto) ---------- */

function hexToRgb(hex: string | null): [number, number, number] | null {
  if (!hex) return null;
  // 6 dígitos ANTES de 3: senão "#111827" casava como "#111"
  const m = /^#([0-9a-f]{6}|[0-9a-f]{3})/i.exec(hex.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function luminance([r, g, b]: [number, number, number]): number {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** Razão de contraste WCAG entre dois valores hex; null se algum não for hex opaco. */
export function contrastRatio(foreground: string | null, background: string | null): number | null {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  if (!fg || !bg) return null;
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2).replace(".", ",")}:1`;
}
