import { useEffect, useMemo, useState } from "react";
import { Badge } from "../../../components/Badge/Badge";
import { Button } from "../../../components/Button/Button";
import { Link } from "../../../components/Link/Link";
import { OnThisPage, scrollToSection, type TocItem } from "../OnThisPage";
import { SectionCard } from "../SectionCard";
import { TokenVisual } from "../specs/ContractSpecs";
import { resolveCssVar, resolveToken } from "../specs/tokenResolver";
import type { StoryMeta } from "../types";
import { colorNames, contrastRatio, formatRatio, isColor, tokenGroups, usersOf } from "./tokenData";
import layout from "../StoryDetail.module.css";
import styles from "./TokensPage.module.css";

type Namespace = "semantic" | "structural" | "type-style";

interface RowDef {
  name: string;
  ns: Namespace;
  /** mostra o contraste do texto sobre a superfície (só tokens de texto) */
  contrast?: boolean;
}

interface SectionDef {
  id: string;
  title: string;
  rows: RowDef[];
}

function slug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const COLOR_HEADING = /^(Ações|Fundos|Bordas|Textos|Ícones)/;

/** Monta as seções de cada página a partir dos grupos do tokens.css. */
function sectionsFor(page: NonNullable<StoryMeta["tokenPage"]>): SectionDef[] {
  const groups = tokenGroups();
  const structural = groups.find((g) => g.heading === "Estrutural")?.names ?? [];

  if (page === "cores") {
    return groups
      .filter((g) => COLOR_HEADING.test(g.heading))
      .map((g) => ({
        id: slug(g.heading),
        title: g.heading,
        rows: colorNames(g).map((name) => ({ name, ns: "semantic" as const, contrast: /^Textos/.test(g.heading) })),
      }))
      .filter((section) => section.rows.length > 0);
  }

  if (page === "tipografia") {
    const bases: string[] = [];
    for (const group of groups.filter((g) => g.heading.startsWith("Tipografia"))) {
      for (const name of group.names) {
        const base = name.replace(/-(family|size|weight|line-height)$/, "");
        if (!bases.includes(base)) bases.push(base);
      }
    }
    return [{ id: "estilos-de-texto", title: "Estilos de texto", rows: bases.map((name) => ({ name, ns: "type-style" as const })) }];
  }

  const rowsOf = (prefix: string, names: string[]) =>
    names.filter((n) => n.startsWith(prefix)).map((name) => ({ name, ns: "structural" as const }));

  if (page === "espacamento") {
    return [
      { id: "espacamento", title: "Espaçamento", rows: rowsOf("espaco-", structural) },
      { id: "raios", title: "Raios de borda", rows: rowsOf("raio-", structural) },
      { id: "tamanhos-de-icone", title: "Tamanhos de ícone", rows: rowsOf("icone-", structural) },
    ];
  }

  const allNames = groups.flatMap((g) => g.names);
  return [
    { id: "sombras", title: "Sombras de elevação", rows: rowsOf("sombra-", allNames) },
    {
      id: "foco",
      title: "Foco do teclado",
      rows: [
        { name: "foco-espessura", ns: "structural" as const },
        { name: "borda-foco", ns: "semantic" as const },
      ],
    },
  ];
}

/** Componentes que declaram o token: os 4 primeiros em links, o resto atrás de "+N". */
function UsedBy({ name }: { name: string }) {
  const [expanded, setExpanded] = useState(false);
  const users = usersOf(name);
  if (users.length === 0) return <span className={styles.muted}>nenhum contrato</span>;
  const visible = expanded ? users : users.slice(0, 4);
  return (
    <span className={styles.users}>
      {visible.map((user) => (
        <Link key={user.label} href={user.href} label={user.label} />
      ))}
      {users.length > 4 && !expanded && (
        <Button variant="link" label={`+${users.length - 4}`} accessibleLabel={`Mostrar mais ${users.length - 4} componentes`} onPress={() => setExpanded(true)} />
      )}
    </span>
  );
}

/** Textos feitos pra cor de fundo fixa (não pra superfície): não têm contraste útil contra ela. */
const NO_SURFACE_CONTRAST = new Set(["texto-invertido", "texto-escuro-fixo"]);

/** Textos de sinalização têm fundo próprio (texto-erro sobre fundo-erro). Os demais ("secundário",
    "obrigatório"…) são texto sobre a superfície — o nome não é um par de fundo. */
const SIGNAL_TEXT = /^texto-(erro|sucesso|aviso|info|apoio-\d)$/;

function backgroundFor(name: string): string {
  const pair = `fundo-${name.replace(/^texto-/, "")}`;
  return SIGNAL_TEXT.test(name) && isColor(resolveCssVar(pair).light) ? pair : "fundo-superficie";
}

function Contrast({ name, light, dark }: { name: string; light: string | null; dark: string | null }) {
  if (NO_SURFACE_CONTRAST.has(name)) {
    return <span className={styles.muted}>cor fixa pra fundos sólidos — o contraste depende do fundo escolhido</span>;
  }
  const bgName = backgroundFor(name);
  const bg = resolveCssVar(bgName);
  const rl = contrastRatio(light, bg.light);
  const rd = contrastRatio(dark, bg.dark);
  if (rl === null || rd === null) return null;
  const ok = rl >= 4.5 && rd >= 4.5;
  // texto-inativo é só pra elementos desabilitados, que a WCAG isenta de contraste mínimo
  const disabledOnly = name === "texto-inativo";
  return (
    <span className={styles.contrast}>
      <Badge variant={ok ? "success" : disabledOnly ? "neutral" : "warning"} label={ok ? "AA" : disabledOnly ? "só desabilitado" : "abaixo de AA"} />
      <span className={styles.muted}>
        sobre {bgName}: claro {formatRatio(rl)} · escuro {formatRatio(rd)}
      </span>
    </span>
  );
}

function TokenRow({ row }: { row: RowDef }) {
  const path = `${row.ns}.${row.name}`;
  const token = resolveToken(path);
  return (
    <div className={styles.row} role="row">
      <div className={styles.cellName} role="cell">
        <code>--{row.name}</code>
        <code className={styles.muted}>{path}</code>
      </div>
      <div className={styles.cellValue} role="cell">
        <TokenVisual token={token} />
        {row.contrast && <Contrast name={row.name} light={token.light} dark={token.dark} />}
      </div>
      <div className={styles.cellUsers} role="cell">
        <UsedBy name={row.name} />
      </div>
    </div>
  );
}

function TokenTable({ rows, label }: { rows: RowDef[]; label: string }) {
  return (
    <div className={styles.table} role="table" aria-label={label}>
      <div className={`${styles.row} ${styles.head}`} role="row">
        <div role="columnheader">Token</div>
        <div role="columnheader">Valor</div>
        <div role="columnheader">Usado por</div>
      </div>
      {rows.map((row) => (
        <TokenRow key={row.name} row={row} />
      ))}
    </div>
  );
}

/** Página do grupo "Tokens": gerada de tokens/tokens.css + contratos (nada digitado à mão). */
export function TokensPage({ story, initialSection }: { story: StoryMeta; initialSection?: string }) {
  const sections = useMemo(() => sectionsFor(story.tokenPage ?? "cores"), [story.tokenPage]);
  const tocItems = useMemo<TocItem[]>(
    () => [{ id: "inicio", label: "Início" }, ...sections.map((s) => ({ id: s.id, label: s.title }))],
    [sections]
  );

  useEffect(() => {
    if (initialSection) scrollToSection(initialSection, "auto");
  }, [story.id, initialSection]);

  return (
    <div className={layout.layout}>
      <div className={layout.content}>
        <div id="inicio" className={layout.pageHeader}>
          <header className={layout.header}>
            <h1 className={layout.title}>{story.title}</h1>
            <Badge variant="neutral" label="Rascunho" />
          </header>
          {story.description && <p className={layout.description}>{story.description}</p>}
          <p className={styles.source}>
            Lido de <code>tokens/tokens.css</code>, a fonte real dos valores. O <code>tokens.json</code> (export do Figma) não é
            atualizado por esta página e pode estar defasado em relação a ele.
          </p>
        </div>

        {sections.map((section) => (
          <SectionCard key={section.id} id={section.id} title={section.title}>
            <TokenTable rows={section.rows} label={section.title} />
          </SectionCard>
        ))}
      </div>
      <aside className={layout.toc}>
        <OnThisPage storyId={story.id} items={tocItems} />
      </aside>
    </div>
  );
}
