import tokensCss from "../../../../tokens/tokens.css?raw";

/**
 * Resolve os caminhos de token dos contratos ("semantic.fundo-superficie",
 * "structural.espaco-p", "type-style.texto-p") nos valores reais de
 * tokens/tokens.css — a fonte única de verdade, lida em build pelo Vite (?raw),
 * nunca copiada à mão. Mapeamento (ver token-notation.md):
 *   semantic.X / structural.X  ->  --X
 *   type-style.X               ->  --X-family / -size / -weight / -line-height
 */
type VarMap = Map<string, string>;

function parseBlock(block: string): VarMap {
  const map: VarMap = new Map();
  for (const match of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    map.set(match[1], match[2].trim().replace(/\s+/g, " "));
  }
  return map;
}

function extractBlock(css: string, selector: string): string {
  const start = css.indexOf(selector);
  if (start === -1) return "";
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  return "";
}

const css = tokensCss.replace(/\/\*[\s\S]*?\*\//g, "");
const LIGHT = parseBlock(extractBlock(css, ":root {"));
const DARK_ONLY = parseBlock(extractBlock(css, ':root[data-theme="dark"]'));
// O tema escuro só sobrescreve o que muda — o resto herda do claro.
const DARK: VarMap = new Map([...LIGHT, ...DARK_ONLY]);

function resolveVar(name: string, map: VarMap, depth = 0): string | null {
  const raw = map.get(name);
  if (raw === undefined) return null;
  if (depth > 5) return raw;
  return raw.replace(/var\((--[\w-]+)\)/g, (_m, inner: string) => resolveVar(inner, map, depth + 1) ?? `var(${inner})`);
}

export type TokenKind = "color" | "shadow" | "length" | "type" | "other";

export interface ResolvedToken {
  path: string;
  /** nome do token sem o namespace (ex.: "espaco-p") */
  name: string;
  kind: TokenKind;
  light: string | null;
  dark: string | null;
  type?: { family: string; size: string; weight: string; lineHeight: string };
}

function kindOf(value: string | null): TokenKind {
  if (!value) return "other";
  if (/^(#|rgb|hsl)/i.test(value) || value === "transparent") return "color";
  if (/rgba?\(/.test(value) && /px/.test(value)) return "shadow";
  if (/^-?\d+(\.\d+)?(px|rem)$/.test(value)) return "length";
  return "other";
}

export function resolveToken(path: string): ResolvedToken {
  const [namespace, ...rest] = path.split(".");
  const name = rest.join(".");
  if (!name) return { path, name: path, kind: "other", light: null, dark: null };

  if (namespace === "type-style") {
    const get = (suffix: string) => resolveVar(`--${name}-${suffix}`, LIGHT) ?? "—";
    return {
      path,
      name,
      kind: "type",
      light: null,
      dark: null,
      type: { family: get("family"), size: get("size"), weight: get("weight"), lineHeight: get("line-height") },
    };
  }

  const light = resolveVar(`--${name}`, LIGHT);
  const dark = resolveVar(`--${name}`, DARK);
  return { path, name, kind: kindOf(light), light, dark };
}
