import { useEffect, useState } from "react";
import { Sidebar, ICON_LIBRARY_ID } from "./nav/Sidebar";
import { STORIES } from "./stories/registry";
import { StoryDetail } from "./stories/StoryDetail";
import { IconLibrary } from "./stories/IconLibrary";
import { ProtoTablePage } from "./prototable/ProtoTablePage";
import { useTheme } from "./theme/useTheme";
import styles from "./App.module.css";

type AppMode = "playground" | "prototable";

/** ID do story pedido via "?standalone=<id>" — usado pelo botão "abrir em nova
    página" do StoryDetail (Templates/Páginas) pra testar a página isolada,
    numa aba própria, sem o resto do shell da Playground. Lido uma única vez:
    essa página nunca navega pra outro story dentro da mesma aba. */
function readStandaloneId(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("standalone");
}

/* Reload de página (F5, link colado, ou o próprio Breadcrumb do ProtoTable
   quando o clique não é interceptado — ex.: Cmd/Ctrl-clique abrindo em nova
   aba) precisa continuar no módulo certo — sem isso, qualquer pt_* na URL
   ficaria "preso" atrás de um mode local que sempre reinicia em
   "playground". */
function readInitialMode(): AppMode {
  if (typeof window === "undefined") return "playground";
  const params = new URLSearchParams(window.location.search);
  return params.has("pt_project") || params.has("pt_module") || params.has("pt_flow") ? "prototable" : "playground";
}

export function App() {
  const [selectedId, setSelectedId] = useState<string>(STORIES[0].id);
  const [mode, setMode] = useState<AppMode>(readInitialMode);
  const { theme, toggleTheme } = useTheme();
  const [standaloneId] = useState<string | null>(readStandaloneId);

  const standaloneStory = standaloneId ? STORIES.find((item) => item.id === standaloneId) : undefined;

  /* Sinaliza o modo standalone no <html> — usado por LoginScreenDemo.module.css
     pra fazer o `.frame` (que nos outros Demos de Templates/Páginas leva uma
     altura fixa em pixels, só pra caber no canvas de preview da Playground)
     preencher 100% da altura real da página/iframe em vez da altura fixa —
     sem isso a altura fixa não bate com a viewport do device-frame simulado
     no StoryDetail e sobra um scroll vertical externo desnecessário. */
  useEffect(() => {
    document.documentElement.toggleAttribute("data-standalone", Boolean(standaloneId));
  }, [standaloneId]);

  if (standaloneId) {
    return (
      <div className={styles.standalone}>
        {standaloneStory ? <standaloneStory.Demo /> : <p>Story "{standaloneId}" não encontrado.</p>}
      </div>
    );
  }

  const story = STORIES.find((item) => item.id === selectedId);

  return (
    <div className={styles.shell}>
      {/* Alterna entre o DS Playground (vitrine de componentes) e o ProtoTable
          (índice de protótipos/produtos reais) — telas deliberadamente
          distintas, sem Sidebar/dados compartilhados entre si (pedido
          explícito do usuário), mas com a MESMA estrutura visual (painel
          lateral + conteúdo, mesmos tokens de cor/fonte) pra lerem como dois
          módulos do mesmo sistema — cada uma expõe um botão pra ir pra outra,
          em vez de um seletor externo por cima das duas. */}
      {mode === "prototable" ? (
        <ProtoTablePage
          onNavigateToPlayground={() => {
            // Limpa o caminho do ProtoTable da URL — sem isso, um reload
            // futuro (readInitialMode) voltaria pro ProtoTable mesmo depois
            // da pessoa escolher voltar explicitamente pro Playground.
            const params = new URLSearchParams(window.location.search);
            params.delete("pt_project");
            params.delete("pt_module");
            params.delete("pt_flow");
            const query = params.toString();
            window.history.pushState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
            setMode("playground");
          }}
        />
      ) : (
        <>
          <Sidebar
            selectedId={selectedId}
            onSelect={setSelectedId}
            theme={theme}
            onToggleTheme={toggleTheme}
            onNavigateToPrototable={() => setMode("prototable")}
          />
          <main className={styles.main}>
            {selectedId === ICON_LIBRARY_ID ? (
              <IconLibrary />
            ) : story ? (
              <StoryDetail key={story.id} story={story} theme={theme} />
            ) : null}
          </main>
        </>
      )}
    </div>
  );
}
