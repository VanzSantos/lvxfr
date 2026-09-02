import { useEffect, useState } from "react";
import { Datatable, type DatatableColumn } from "../../components/Datatable/Datatable";
import { Button } from "../../components/Button/Button";
import { Badge } from "../../components/Badge/Badge";
import { Drawer } from "../../components/Drawer/Drawer";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import staticManifest from "./manifest.json";
import sidebarStyles from "../nav/Sidebar.module.css";
import storyStyles from "../stories/StoryDetail.module.css";
import styles from "./ProtoTablePage.module.css";

interface CommitEntry {
  hash: string;
  shortHash: string;
  author: string;
  date: string;
  message: string;
}

interface PrototypeRow extends Record<string, unknown> {
  key: string;
  title: string;
  screenPath: string;
  standaloneStoryId: string;
  description?: string;
  uncommitted: boolean;
  createdBy: string | null;
  createdAt: string | null;
  lastUpdatedBy: string | null;
  lastUpdatedAt: string | null;
  commitCount: number;
  history: CommitEntry[];
}

interface Manifest {
  generatedAt: string;
  prototypes: PrototypeRow[];
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

interface ProtoTablePageProps {
  /** Navega de volta pro módulo DS Playground — módulo irmão deste, mesma
      estrutura visual, dados totalmente separados (ver App.tsx). */
  onNavigateToPlayground: () => void;
}

/** Índice de PROTÓTIPOS (telas/produtos reais, não componentes) — separado de
    propósito do DS Playground, tanto na navegação (ver App.tsx) quanto na
    fonte de dados (registry.ts próprio, ver decisions ali). Reaproveita
    DELIBERADAMENTE as classes de Sidebar.module.css (painel lateral) e
    StoryDetail.module.css (título/descrição do conteúdo) em vez de recriar
    esses estilos — mesmos tokens de cor/fonte, mesma estrutura visual do
    Playground, pra ler como dois módulos do mesmo sistema (pedido explícito
    do usuário), mesmo sendo telas/dados 100% separados. Metadados de
    autoria/data/histórico vêm 100% do git real de cada pasta (nunca digitados
    à mão) — em dev, buscados ao vivo via /__prototable-manifest (plugin em
    vite.config.ts); fora de dev, cai pro manifest.json estático gerado pelo
    script "prebuild". */
export function ProtoTablePage({ onNavigateToPlayground }: ProtoTablePageProps) {
  const [manifest, setManifest] = useState<Manifest>(staticManifest as Manifest);
  const [historyFor, setHistoryFor] = useState<PrototypeRow | null>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    let cancelled = false;
    fetch("/__prototable-manifest")
      .then((res) => res.json())
      .then((data: Manifest) => {
        if (!cancelled) setManifest(data);
      })
      .catch(() => {
        // sem servidor de dev disponível (ex.: preview) — mantém o manifest.json estático já carregado
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const columns: DatatableColumn<PrototypeRow>[] = [
    {
      key: "title",
      header: "Protótipo",
      sortable: true,
      render: (_value, row) => (
        <div>
          <strong>{row.title}</strong>
          {row.description && <div style={{ fontSize: 13, color: "var(--texto-secundario)" }}>{row.description}</div>}
        </div>
      ),
    },
    {
      key: "createdBy",
      header: "Criado por",
      sortable: true,
      render: (_value, row) =>
        row.uncommitted ? (
          <Badge variant="neutral" label="Não commitado" />
        ) : (
          <div>
            {row.createdBy}
            <div style={{ fontSize: 13, color: "var(--texto-secundario)" }}>{formatDate(row.createdAt)}</div>
          </div>
        ),
    },
    {
      key: "lastUpdatedBy",
      header: "Atualizado por",
      sortable: true,
      render: (_value, row) =>
        row.uncommitted ? (
          "—"
        ) : (
          <div>
            {row.lastUpdatedBy}
            <div style={{ fontSize: 13, color: "var(--texto-secundario)" }}>{formatDate(row.lastUpdatedAt)}</div>
          </div>
        ),
    },
    {
      key: "commitCount",
      header: "Commits",
      align: "center",
      sortable: true,
    },
    {
      key: "actions",
      header: "Ações",
      align: "right",
      hideable: false,
      render: (_value, row) => (
        <div className={styles.rowActions}>
          <Button
            variant="link"
            label="Ver histórico"
            onPress={() => setHistoryFor(row)}
            state={row.commitCount === 0 ? "disabled" : "default"}
          />
          <Button
            variant="neutral"
            outlined
            label="Abrir"
            onPress={() => window.open(`/?standalone=${row.standaloneStoryId}`, "_blank")}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <nav className={sidebarStyles.sidebar} aria-label="Navegação de protótipos">
        <div className={sidebarStyles.brand}>ProtoTable</div>
        <button type="button" className={sidebarStyles.moduleSwitch} onClick={onNavigateToPlayground}>
          ← Voltar pro DS Playground
        </button>
        <div className={sidebarStyles.group}>
          <span className={sidebarStyles.groupTitle}>Sobre este módulo</span>
          <p className={styles.railDescription}>
            Índice dos protótipos reais construídos sobre o LVXFR — autoria, data e histórico de
            versão vêm direto do git de cada pasta, sem registro manual paralelo.
          </p>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={storyStyles.wrapper}>
          <div className={storyStyles.header}>
            <h1 className={storyStyles.title}>Protótipos</h1>
          </div>
          <p className={storyStyles.description}>
            Só reflete o que foi commitado e enviado (push) pro repositório que você está vendo —
            trabalho só local, em qualquer fork, é invisível aqui.
          </p>

          {manifest.prototypes.length === 0 ? (
            <EmptyState title="Nenhum protótipo registrado ainda" description="Registre um em src/interface/prototable/registry.ts." />
          ) : (
            <Datatable
              columns={columns}
              data={manifest.prototypes}
              rowKey="key"
              accessibleLabel="Lista de protótipos"
              allowDensityToggle
            />
          )}
        </div>
      </main>

      <Drawer
        open={historyFor !== null}
        onClose={() => setHistoryFor(null)}
        title={historyFor ? `Histórico — ${historyFor.title}` : undefined}
        accessibleLabel="Histórico de versões do protótipo"
      >
        <div className={styles.commitList}>
          {historyFor?.history.map((commit) => (
            <div key={commit.hash} className={styles.commitItem}>
              <span className={styles.commitMessage}>{commit.message}</span>
              <span className={styles.commitMeta}>
                {commit.shortHash} — {commit.author} — {formatDate(commit.date)}
              </span>
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
}
