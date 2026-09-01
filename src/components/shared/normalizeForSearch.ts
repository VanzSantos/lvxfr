/**
 * Remove acentos antes de comparar ("méxico" -> "mexico") — sem isso, digitar
 * "mex" sem acento nunca bate com "México". Bug real encontrado testando
 * ComboBox no navegador: toLowerCase() sozinho não normaliza diacríticos,
 * crítico pra conteúdo em português (São Paulo, Índia, França...). Extraído
 * pra shared/ quando Select ganhou a mesma correção (dívida técnica
 * registrada em ROADMAP.md) — mesmo padrão de shared/multiSelectSummary.ts.
 */
const DIACRITICS_PATTERN = new RegExp("[\\u0300-\\u036f]", "g");

export function normalizeForSearch(text: string): string {
  return text.normalize("NFD").replace(DIACRITICS_PATTERN, "").toLowerCase();
}
