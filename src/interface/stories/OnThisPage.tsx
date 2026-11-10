import { useEffect, useState, type MouseEvent } from "react";
import { Link } from "../../components/Link/Link";
import styles from "./OnThisPage.module.css";

export interface TocItem {
  id: string;
  label: string;
  /** 1 = seção da página; 2 = subseção (recuada) */
  level?: 1 | 2;
}

/** Rola até a seção `id` (âncora dentro da tela do componente). Sem biblioteca de rotas:
    a hash da URL já é a rota ("#/<componente>"), então o link do menu leva
    "#/<componente>/<secao>" e o clique é tratado aqui. */
export function scrollToSection(id: string, behavior?: ScrollBehavior) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: behavior ?? (reduce ? "auto" : "smooth"), block: "start" });
  // foco na seção pra quem navega por teclado/leitor de tela continuar dali
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

export function sectionHref(storyId: string, sectionId: string) {
  return `#/${encodeURIComponent(storyId)}/${sectionId}`;
}

/** Menu fixo à direita, "Nesta página" — links de âncora pras seções da tela. */
export function OnThisPage({ storyId, items }: { storyId: string; items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  // Seção atual = a última cujo topo já passou da faixa superior da área rolável (<main>).
  useEffect(() => {
    const scroller = document.querySelector("main");
    if (!scroller) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const limit = scroller.getBoundingClientRect().top + 96;
      let current = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= limit) current = item.id;
      }
      // no fim da página, a última seção ganha mesmo que seja curta
      if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4) current = items[items.length - 1]?.id;
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  function handleClick(event: MouseEvent<HTMLElement>) {
    // Cmd/Ctrl/Shift/clique do meio seguem o comportamento do navegador (abrir em nova aba etc.)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as HTMLElement).closest("a");
    if (!anchor) return;
    const id = new URL(anchor.href).hash.split("/")[2];
    if (!id) return;
    event.preventDefault();
    scrollToSection(id);
    // atualiza a URL sem disparar hashchange (a tela já está no lugar) — vira link direto pra seção
    window.history.replaceState(null, "", sectionHref(storyId, id));
  }

  return (
    <nav className={styles.toc} aria-label="Nesta página" onClick={handleClick}>
      <h2 className={styles.title}>Nesta página</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={item.level === 2 ? styles.sub : undefined}>
            <Link href={sectionHref(storyId, item.id)} label={item.label} current={item.id === activeId} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
