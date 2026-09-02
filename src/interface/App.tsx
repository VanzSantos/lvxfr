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

export function App() {
  const [selectedId, setSelectedId] = useState<string>(STORIES[0].id);
  const [mode, setMode] = useState<AppMode>("playground");
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
    <div className={styles.root}>
      {/* Alterna entre o DS Playground (vitrine de componentes) e o ProtoTable
          (índice de protótipos/produtos reais) — os dois são deliberadamente
          telas distintas, sem Sidebar/dados compartilhados entre si (pedido
          explícito do usuário: "não devem ser confundidos nem misturados"). */}
      <div className={styles.modeBar} role="tablist" aria-label="Modo de visualização">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "playground"}
          className={`${styles.modeButton} ${mode === "playground" ? styles.modeButtonActive : ""}`}
          onClick={() => setMode("playground")}
        >
          DS Playground
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "prototable"}
          className={`${styles.modeButton} ${mode === "prototable" ? styles.modeButtonActive : ""}`}
          onClick={() => setMode("prototable")}
        >
          ProtoTable
        </button>
      </div>

      {mode === "prototable" ? (
        <ProtoTablePage />
      ) : (
        <div className={styles.shell}>
          <Sidebar selectedId={selectedId} onSelect={setSelectedId} theme={theme} onToggleTheme={toggleTheme} />
          <main className={styles.main}>
            {selectedId === ICON_LIBRARY_ID ? (
              <IconLibrary />
            ) : story ? (
              <StoryDetail key={story.id} story={story} theme={theme} />
            ) : null}
          </main>
        </div>
      )}
    </div>
  );
}
