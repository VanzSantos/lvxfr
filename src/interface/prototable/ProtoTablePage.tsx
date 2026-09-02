import { useEffect, useState } from "react";
import { Datatable, type DatatableColumn } from "../../components/Datatable/Datatable";
import { Button } from "../../components/Button/Button";
import { Badge } from "../../components/Badge/Badge";
import { Drawer } from "../../components/Drawer/Drawer";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { Breadcrumb, type BreadcrumbItem } from "../../components/Breadcrumb/Breadcrumb";
import { useProtoTablePath } from "./useProtoTablePath";
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

interface Aggregated {
  uncommitted: boolean;
  createdBy: string | null;
  createdAt: string | null;
  lastUpdatedBy: string | null;
  lastUpdatedAt: string | null;
  commitCount: number;
  history: CommitEntry[];
}

interface ScreenNode extends Aggregated, Record<string, unknown> {
  key: string;
  flowKey: string;
  title: string;
  screenPath: string;
  standaloneStoryId: string;
  description?: string;
}

interface FlowNode extends Aggregated, Record<string, unknown> {
  key: string;
  moduleKey: string;
  title: string;
  description?: string;
  screens: ScreenNode[];
}

interface ModuleNode extends Aggregated, Record<string, unknown> {
  key: string;
  projectKey: string;
  title: string;
  description?: string;
  flows: FlowNode[];
}

interface ProjectNode extends Aggregated, Record<string, unknown> {
  key: string;
  title: string;
  description?: string;
  modules: ModuleNode[];
}

interface Manifest {
  generatedAt: string;
  projects: ProjectNode[];
}

type HistoryTarget = { title: string; history: CommitEntry[] } | null;

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function aggregatedColumns<T extends Record<string, unknown>>(
  onNameClick: (row: T) => void,
  nameOf: (row: T) => string,
  descriptionOf: (row: T) => string | undefined,
  onHistory: (row: T) => void,
  extraActions?: (row: T) => React.ReactNode
): DatatableColumn<T>[] {
  return [
    {
      key: "title",
      header: "Nome",
      sortable: true,
      render: (_value, row) => (
        <button type="button" className={styles.rowLink} onClick={() => onNameClick(row)}>
          <strong>{nameOf(row)}</strong>
          {descriptionOf(row) && <div className={styles.rowDescription}>{descriptionOf(row)}</div>}
        </button>
      ),
    },
    {
      key: "createdBy",
      header: "Criado por",
      sortable: true,
      render: (_value, row) => {
        const agg = row as unknown as Aggregated;
        return agg.uncommitted ? (
          <Badge variant="neutral" label="Não commitado" />
        ) : (
          <div>
            {agg.createdBy}
            <div className={styles.rowDescription}>{formatDate(agg.createdAt)}</div>
          </div>
        );
      },
    },
    {
      key: "lastUpdatedBy",
      header: "Atualizado por",
      sortable: true,
      render: (_value, row) => {
        const agg = row as unknown as Aggregated;
        return agg.uncommitted ? (
          "—"
        ) : (
          <div>
            {agg.lastUpdatedBy}
            <div className={styles.rowDescription}>{formatDate(agg.lastUpdatedAt)}</div>
          </div>
        );
      },
    },
    { key: "commitCount", header: "Commits", align: "center", sortable: true },
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
            onPress={() => onHistory(row)}
            state={(row as unknown as Aggregated).commitCount === 0 ? "disabled" : "default"}
          />
          {extraActions?.(row)}
        </div>
      ),
    },
  ];
}

interface ProtoTablePageProps {
  /** Navega de volta pro módulo DS Playground — módulo irmão deste, mesma
      estrutura visual, dados totalmente separados (ver App.tsx). */
  onNavigateToPlayground: () => void;
}

/** Índice de PROTÓTIPOS organizados em hierarquia Projeto > Módulo > Fluxo >
    Tela (pedido explícito do usuário). Um nível com exatamente 1 filho pula
    direto pro filho (sem renderizar uma tabela de "1 item só") — o caminho
    atual mora na URL (useProtoTablePath), não em estado solto, pra permitir
    reaproveitar o átomo Breadcrumb de verdade (só aceita href, sem onClick).
    Reaproveita DELIBERADAMENTE as classes de Sidebar.module.css (painel
    lateral) e StoryDetail.module.css (título/descrição) — mesmos tokens de
    cor/fonte do Playground, mesma estrutura visual, pra ler como dois
    módulos do mesmo sistema, mesmo com dados 100% separados. Metadados de
    autoria/data/histórico vêm 100% do git real de cada Tela, agregados pra
    cima (ver scripts/prototable-manifest.mjs) — nunca digitados à mão. */
export function ProtoTablePage({ onNavigateToPlayground }: ProtoTablePageProps) {
  const [manifest, setManifest] = useState<Manifest>(staticManifest as unknown as Manifest);
  const [historyTarget, setHistoryTarget] = useState<HistoryTarget>(null);
  const { path, navigate, hrefFor } = useProtoTablePath();

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

  const currentProject = manifest.projects.find((project) => project.key === path.project) ?? null;
  const currentModule = currentProject?.modules.find((module_) => module_.key === path.module) ?? null;
  const currentFlow = currentModule?.flows.find((flow) => flow.key === path.flow) ?? null;

  // Auto-colapso: quando o nível atual tem exatamente 1 filho, pula direto
  // pra ele em vez de mostrar uma tabela de 1 linha só.
  useEffect(() => {
    if (!path.project && manifest.projects.length === 1) {
      navigate({ project: manifest.projects[0].key });
    }
  }, [path.project, manifest.projects, navigate]);

  useEffect(() => {
    if (currentProject && !path.module && currentProject.modules.length === 1) {
      navigate({ module: currentProject.modules[0].key });
    }
  }, [currentProject, path.module, navigate]);

  useEffect(() => {
    if (currentModule && !path.flow && currentModule.flows.length === 1) {
      navigate({ flow: currentModule.flows[0].key });
    }
  }, [currentModule, path.flow, navigate]);

  /* Breadcrumb (átomo do DS) só sabe renderizar <a href> reais — necessário
     pra reaproveitá-lo sem reimplementar (ver useProtoTablePath.ts). Mas um
     <a> real dispara reload de página, o que reseta o `mode` do App.tsx
     (estado local, não vem da URL) de volta pro Playground — intercepta o
     clique aqui e navega via pushState (mesmo destino, sem reload), preciso
     não interceptar Cmd/Ctrl/clique-do-meio (abrir em nova aba deve
     continuar funcionando de verdade, mesmo padrão que SPA routers usam). */
  function handleBreadcrumbClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as HTMLElement).closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href) return;
    event.preventDefault();
    const url = new URL(href, window.location.origin);
    navigate({
      project: url.searchParams.get("pt_project"),
      module: url.searchParams.get("pt_module"),
      flow: url.searchParams.get("pt_flow"),
    });
  }

  const breadcrumbItems: BreadcrumbItem[] = [{ label: "ProtoTable", href: hrefFor({ project: null, module: null, flow: null }) }];
  if (currentProject) breadcrumbItems.push({ label: currentProject.title, href: hrefFor({ project: currentProject.key, module: null, flow: null }) });
  if (currentModule) breadcrumbItems.push({ label: currentModule.title, href: hrefFor({ module: currentModule.key, flow: null }) });
  if (currentFlow) breadcrumbItems.push({ label: currentFlow.title, href: hrefFor({ flow: currentFlow.key }) });

  function renderContent() {
    if (!currentProject) {
      return <EmptyState title="Selecione um projeto" description="Escolha um projeto na lista ao lado pra ver seus módulos." />;
    }
    if (!currentModule) {
      return (
        <Datatable
          columns={aggregatedColumns<ModuleNode>(
            (row) => navigate({ project: currentProject.key, module: row.key, flow: null }),
            (row) => row.title,
            (row) => row.description,
            (row) => setHistoryTarget({ title: row.title, history: row.history })
          )}
          data={currentProject.modules}
          rowKey="key"
          accessibleLabel="Lista de módulos"
        />
      );
    }
    if (!currentFlow) {
      return (
        <Datatable
          columns={aggregatedColumns<FlowNode>(
            (row) => navigate({ flow: row.key }),
            (row) => row.title,
            (row) => row.description,
            (row) => setHistoryTarget({ title: row.title, history: row.history })
          )}
          data={currentModule.flows}
          rowKey="key"
          accessibleLabel="Lista de fluxos"
        />
      );
    }
    if (currentFlow.screens.length === 1) {
      const screen = currentFlow.screens[0];
      return (
        <div className={styles.leafCard}>
          <div>
            <strong>{screen.title}</strong>
            {screen.description && <p className={styles.rowDescription}>{screen.description}</p>}
            <p className={styles.rowDescription}>
              {screen.uncommitted ? (
                <Badge variant="neutral" label="Não commitado" />
              ) : (
                <>
                  Criado por {screen.createdBy} em {formatDate(screen.createdAt)} — atualizado por {screen.lastUpdatedBy} em{" "}
                  {formatDate(screen.lastUpdatedAt)}
                </>
              )}
            </p>
          </div>
          <div className={styles.rowActions}>
            <Button variant="link" label="Ver histórico" onPress={() => setHistoryTarget({ title: screen.title, history: screen.history })} state={screen.commitCount === 0 ? "disabled" : "default"} />
            <a className={styles.openButton} href={`/?standalone=${screen.standaloneStoryId}`} target="_blank" rel="noopener noreferrer">
              Abrir
            </a>
          </div>
        </div>
      );
    }
    return (
      <Datatable
        columns={aggregatedColumns<ScreenNode>(
          () => {},
          (row) => row.title,
          (row) => row.description,
          (row) => setHistoryTarget({ title: row.title, history: row.history }),
          (row) => (
            <a className={styles.openButton} href={`/?standalone=${row.standaloneStoryId}`} target="_blank" rel="noopener noreferrer">
              Abrir
            </a>
          )
        )}
        data={currentFlow.screens}
        rowKey="key"
        accessibleLabel="Lista de telas"
      />
    );
  }

  return (
    <>
      <nav className={sidebarStyles.sidebar} aria-label="Navegação de protótipos">
        <div className={sidebarStyles.brand}>ProtoTable</div>
        <button type="button" className={sidebarStyles.moduleSwitch} onClick={onNavigateToPlayground}>
          ← Voltar pro DS Playground
        </button>
        <div className={sidebarStyles.group}>
          <span className={sidebarStyles.groupTitle}>Projetos</span>
          {manifest.projects.length === 0 ? (
            <span className={sidebarStyles.empty}>Nenhum projeto ainda</span>
          ) : (
            <ul className={sidebarStyles.list}>
              {manifest.projects.map((project) => (
                <li key={project.key}>
                  <button
                    type="button"
                    className={`${sidebarStyles.item} ${currentProject?.key === project.key ? sidebarStyles.itemActive : ""}`}
                    onClick={() => navigate({ project: project.key, module: null, flow: null })}
                    aria-current={currentProject?.key === project.key ? "page" : undefined}
                  >
                    {project.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      <main className={styles.main}>
        <div className={storyStyles.wrapper}>
          {breadcrumbItems.length >= 2 && (
            <div className={styles.breadcrumbRow} onClick={handleBreadcrumbClick}>
              <Breadcrumb items={breadcrumbItems} />
            </div>
          )}
          <div className={storyStyles.header}>
            <h1 className={storyStyles.title}>{currentFlow?.title ?? currentModule?.title ?? currentProject?.title ?? "Protótipos"}</h1>
          </div>
          <p className={storyStyles.description}>
            Só reflete o que foi commitado e enviado (push) pro repositório que você está vendo —
            trabalho só local, em qualquer fork, é invisível aqui.
          </p>

          {renderContent()}
        </div>
      </main>

      <Drawer
        open={historyTarget !== null}
        onClose={() => setHistoryTarget(null)}
        title={historyTarget ? `Histórico — ${historyTarget.title}` : undefined}
        accessibleLabel="Histórico de versões"
      >
        <div className={styles.commitList}>
          {historyTarget?.history.map((commit) => (
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
