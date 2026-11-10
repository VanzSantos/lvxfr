import { useEffect, useMemo, useState } from "react";
import type { StoryMeta } from "./types";
import type { Theme } from "../theme/useTheme";
import { ContractPanel, contractNavItems } from "./specs/ContractPanel";
import { OnThisPage, scrollToSection, type TocItem } from "./OnThisPage";
import { SectionCard } from "./SectionCard";
import { getContractSource } from "./contractSource";
import { Badge, type BadgeVariant } from "../../components/Badge/Badge";
import { Link } from "../../components/Link/Link";
import { SegmentedControl } from "../../components/SegmentedControl/SegmentedControl";
import styles from "./StoryDetail.module.css";

const STATUS_LABEL: Record<StoryMeta["status"], string> = {
  draft: "Rascunho",
  stable: "Estável",
  deprecated: "Descontinuado",
};

/** Templates e Páginas têm layout responsivo baseado em @media, que só reage à
    largura real de uma viewport — dentro do canvas embutido na Playground o
    "container" não é a viewport, então simular smartphone exige um iframe (que
    tem sua própria viewport própria) apontando pra "?standalone=<id>", não só
    encolher uma div. Ver ROADMAP.md (LoginScreen) pro raciocínio completo. */
const RESPONSIVE_GROUPS: StoryMeta["group"][] = ["Templates", "Páginas"];

const STATUS_VARIANT: Record<StoryMeta["status"], BadgeVariant> = {
  draft: "neutral",
  stable: "success",
  deprecated: "error",
};

type DeviceView = "desktop" | "mobile";

export function StoryDetail({ story, theme, initialSection }: { story: StoryMeta; theme: Theme; initialSection?: string }) {
  const Demo = story.Demo;
  const [deviceView, setDeviceView] = useState<DeviceView>("desktop");
  const contractSource = getContractSource(story.contractFile);
  const isResponsive = RESPONSIVE_GROUPS.includes(story.group);
  const standaloneUrl = `${window.location.pathname}?standalone=${story.id}`;

  // Menu "Nesta página": seções fixas + as de Especificações (do contrato) + "Contrato" por último.
  const tocItems = useMemo<TocItem[]>(() => {
    const items: TocItem[] = [
      { id: "inicio", label: "Início" },
      { id: "preview", label: "Pré-visualização" },
      { id: "codigo", label: "Código" },
    ];
    if (contractSource) {
      const { specs, contractId } = contractNavItems(contractSource);
      items.push(...specs.map((section): TocItem => ({ ...section, level: 2 })));
      items.push({ id: contractId, label: "Contrato" });
    } else {
      items.push({ id: "detalhes", label: "Detalhes" });
    }
    return items;
  }, [contractSource]);

  // Link direto pra seção ("#/radio/props"): rola até ela ao abrir a tela.
  useEffect(() => {
    if (initialSection) scrollToSection(initialSection, "auto");
  }, [story.id, initialSection]);

  const deviceControls = isResponsive ? (
    <>
      {/* Link external (<a target="_blank"> de verdade) em vez de window.open: é o
          jeito nativo/garantido do navegador abrir uma aba nova — window.open
          pode ser tratado como popup/navegação no lugar. BUG REAL relatado
          pelo usuário. */}
      <Link href={standaloneUrl} label="Abrir em nova página" external leftIcon="arrow-square-out" />
      <SegmentedControl
        accessibleLabel="Visualização"
        value={deviceView}
        onChange={(value) => setDeviceView(value as DeviceView)}
        items={[
          { value: "desktop", label: "Desktop", icon: "desktop" },
          { value: "mobile", label: "Smartphone", icon: "device-mobile" },
        ]}
      />
    </>
  ) : undefined;

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <div id="inicio" className={styles.pageHeader}>
          <header className={styles.header}>
            <h1 className={styles.title}>{story.title}</h1>
            <Badge variant={STATUS_VARIANT[story.status]} label={STATUS_LABEL[story.status]} />
          </header>
          {story.description && <p className={styles.description}>{story.description}</p>}
        </div>

        <SectionCard id="preview" title="Pré-visualização" actions={deviceControls}>
          <div
            className={isResponsive ? `${styles.canvas} ${styles.canvasFlush}` : styles.canvas}
            role="region"
            aria-label="Pré-visualização do componente"
          >
            {isResponsive && deviceView === "mobile" ? (
              // key inclui o tema: o iframe é um documento à parte (própria
              // localStorage/useTheme), então trocar de claro/escuro no shell da
              // Playground não reflete nele sozinho — forçar o remount recarrega
              // a página com o tema já atualizado (mesma leitura de localStorage
              // que o resto da Playground usa). BUG REAL visto testando o
              // KanbanTemplate em "ver como smartphone" (ver ROADMAP.md).
              <iframe
                key={`${standaloneUrl}::${theme}`}
                className={styles.deviceFrame}
                src={standaloneUrl}
                title={`${story.title} — simulação de smartphone`}
              />
            ) : (
              <Demo />
            )}
          </div>
        </SectionCard>

        <SectionCard id="codigo" title="Código">
          <pre className={styles.code}>
            <code>{story.code}</code>
          </pre>
        </SectionCard>

        {contractSource ? (
          <ContractPanel fileName={story.contractFile ?? ""} source={contractSource} />
        ) : (
          // Sem contrato (ex.: Templates/Páginas): só os metadados do registro.
          <SectionCard id="detalhes" title="Detalhes">
            <dl className={styles.meta}>
              <dt>Categoria</dt>
              <dd>{story.category ?? "—"}</dd>

              <dt>Dependências</dt>
              <dd>{story.dependencies && story.dependencies.length > 0 ? story.dependencies.join(", ") : "nenhuma"}</dd>

              <dt>Tokens principais</dt>
              <dd>{story.tokensSummary && story.tokensSummary.length > 0 ? story.tokensSummary.join(", ") : "—"}</dd>
            </dl>
          </SectionCard>
        )}
      </div>
      <aside className={styles.toc}>
        <OnThisPage storyId={story.id} items={tocItems} />
      </aside>
    </div>
  );
}
