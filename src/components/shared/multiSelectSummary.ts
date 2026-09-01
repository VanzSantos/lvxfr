/**
 * Reaproveitado por Select e ComboBox pra resumir uma lista de labels
 * selecionados dentro de um campo de largura fixa: mostra a lista inteira
 * em português natural quando cabe, ou trunca com contador "+N" medindo a
 * largura real via canvas — CSS text-overflow:ellipsis sozinho cortaria no
 * meio de um label, não no limite entre itens.
 */

const measureCanvas = typeof document !== "undefined" ? document.createElement("canvas") : null;

function measureTextWidth(text: string, font: string): number {
  const ctx = measureCanvas?.getContext("2d");
  if (!ctx) return 0;
  ctx.font = font;
  return ctx.measureText(text).width;
}

/** "Brasil, Portugal e Argentina" — só usada quando a lista inteira cabe. */
function joinNatural(labels: string[]): string {
  if (labels.length <= 1) return labels.join("");
  return `${labels.slice(0, -1).join(", ")} e ${labels[labels.length - 1]}`;
}

export function summarizeSelection(labels: string[], element: HTMLElement): string {
  if (labels.length === 0) return "";

  const style = getComputedStyle(element);
  const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const availableWidth = element.clientWidth;

  const full = joinNatural(labels);
  if (measureTextWidth(full, font) <= availableWidth) {
    return full;
  }

  for (let shownCount = labels.length - 1; shownCount >= 1; shownCount--) {
    const remaining = labels.length - shownCount;
    const candidate = `${labels.slice(0, shownCount).join(", ")} +${remaining}`;
    if (measureTextWidth(candidate, font) <= availableWidth) {
      return candidate;
    }
  }

  return `${labels[0]} +${labels.length - 1}`;
}
