import { useState } from "react";
import type { StoryMeta } from "./types";
import type { Theme } from "../theme/useTheme";
import { ContractDialog } from "./ContractDialog";
import { getContractSource } from "./contractSource";
import { Icon } from "../../components/Icon/Icon";
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

type DeviceView = "desktop" | "mobile";

export function StoryDetail({ story, theme }: { story: StoryMeta; theme: Theme }) {
  const Demo = story.Demo;
  const [contractOpen, setContractOpen] = useState(false);
  const [deviceView, setDeviceView] = useState<DeviceView>("desktop");
  const contractSource = getContractSource(story.contractFile);
  const isResponsive = RESPONSIVE_GROUPS.includes(story.group);
  const standaloneUrl = `${window.location.pathname}?standalone=${story.id}`;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>{story.title}</h1>
        <span className={`${styles.status} ${styles[story.status]}`}>
          {STATUS_LABEL[story.status]}
        </span>
      </header>
      {story.description && <p className={styles.description}>{story.description}</p>}

      {isResponsive && (
        <div className={styles.canvasToolbar}>
          {/* <a target="_blank"> em vez de window.open: é o jeito nativo/garantido
              do navegador abrir uma aba nova de verdade — window.open com uma
              windowFeatures string (ex.: "noopener,noreferrer") pode ser tratado
              como popup/navegação no lugar em vez de aba pelo navegador,
              dependendo do contexto. BUG REAL relatado pelo usuário. */}
          <a
            href={standaloneUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.toolbarButton}
          >
            <Icon name="arrow-square-out" size="small" color="var(--texto-secundario)" decorative />
            Abrir em nova página
          </a>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={() => setDeviceView((current) => (current === "desktop" ? "mobile" : "desktop"))}
          >
            <Icon
              name={deviceView === "desktop" ? "device-mobile" : "desktop"}
              size="small"
              color="var(--texto-secundario)"
              decorative
            />
            {deviceView === "desktop" ? "Ver como smartphone" : "Ver como desktop"}
          </button>
        </div>
      )}

      <section
        className={isResponsive ? `${styles.canvas} ${styles.canvasFlush}` : styles.canvas}
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
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Código</h2>
        <pre className={styles.code}>
          <code>{story.code}</code>
        </pre>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Detalhes do contrato</h2>
        <dl className={styles.meta}>
          <dt>Categoria</dt>
          <dd>{story.category ?? "—"}</dd>

          <dt>Dependências</dt>
          <dd>{story.dependencies && story.dependencies.length > 0 ? story.dependencies.join(", ") : "nenhuma"}</dd>

          <dt>Tokens principais</dt>
          <dd>{story.tokensSummary && story.tokensSummary.length > 0 ? story.tokensSummary.join(", ") : "—"}</dd>

          <dt>Arquivo do contrato</dt>
          <dd className={styles.contractFileRow}>
            <code>{story.contractFile ?? "—"}</code>
            {contractSource && (
              <button
                type="button"
                className={styles.viewContractButton}
                onClick={() => setContractOpen(true)}
              >
                Ver contrato
              </button>
            )}
          </dd>
        </dl>
      </section>

      {contractSource && (
        <ContractDialog
          open={contractOpen}
          onClose={() => setContractOpen(false)}
          fileName={story.contractFile ?? ""}
          content={contractSource}
        />
      )}
    </div>
  );
}
