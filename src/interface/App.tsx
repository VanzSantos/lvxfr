import { useEffect, useState } from "react";
import { Sidebar, ICON_LIBRARY_ID } from "./nav/Sidebar";
import { STORIES } from "./stories/registry";
import { StoryDetail } from "./stories/StoryDetail";
import { TokensPage } from "./stories/tokens/TokensPage";
import { IconLibrary } from "./stories/IconLibrary";
import { ProtoTablePage } from "./prototable/ProtoTablePage";
import { SCREENS } from "./prototable/registry";
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

/** Rota vem da hash da URL: "#/<id>" ou "#/<id>/<secao>" — é o que o SideNav (que só
    navega por href) e o menu "Nesta página" alteram ao clicar; sem hash, abre o
    primeiro story. A seção opcional é âncora dentro da tela do componente. */
function readRoute(): { id: string; section?: string } {
  if (typeof window === "undefined") return { id: STORIES[0].id };
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (!hash) return { id: STORIES[0].id };
  const [rawId, rawSection] = hash.split("/");
  try {
    return { id: decodeURIComponent(rawId), section: rawSection ? decodeURIComponent(rawSection) : undefined };
  } catch {
    return { id: STORIES[0].id };
  }
}

export function App() {
  const [route, setRoute] = useState(readRoute);
  const selectedId = route.id;
  const [mode, setMode] = useState<AppMode>(readInitialMode);
  const { theme, preference, setPreference } = useTheme();
  const [standaloneId] = useState<string | null>(readStandaloneId);

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const standaloneStory = standaloneId ? STORIES.find((item) => item.id === standaloneId) : undefined;
  const story = STORIES.find((item) => item.id === selectedId);

  // Título da aba por tela (WCAG 2.4.2) — antes era "SeleneSDK" fixo em todas.
  useEffect(() => {
    if (standaloneId) return;
    const screen =
      mode === "prototable" ? "ProtoTable" : selectedId === ICON_LIBRARY_ID ? "Ícones (Phosphor)" : story?.title;
    document.title = screen ? `${screen} · SeleneSDK` : "SeleneSDK";
  }, [standaloneId, mode, selectedId, story?.title]);
  /* Protótipos ProtoTable-only (sem entrada em stories/registry.ts — pedido
     explícito do usuário: US de produto real não deve aparecer no Playground
     nem ganhar contrato) resolvem o standalone pelo próprio ScreenEntry.Demo
     em vez de um STORY, ver prototable/registry.ts (campo Demo). */
  const standaloneScreen = standaloneId && !standaloneStory ? SCREENS.find((item) => item.standaloneStoryId === standaloneId && item.Demo) : undefined;
  const StandaloneDemo = standaloneStory?.Demo ?? standaloneScreen?.Demo;

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
        {StandaloneDemo ? <StandaloneDemo /> : <p>Story "{standaloneId}" não encontrado.</p>}
      </div>
    );
  }

  /* "Pular para o conteúdo" (WCAG 2.4.1) — o menu tem ~90 itens focáveis antes do
     <main>. Não dá pra usar href="#conteudo": a hash da URL é a rota do Playground
     ("#/radio"), então o clique move o foco por JS e deixa a URL como está. */
  function skipToContent(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const main = document.querySelector("main");
    if (!main) return;
    main.setAttribute("tabindex", "-1");
    main.focus();
  }

  return (
    <div className={styles.shell}>
      <a href={window.location.hash || "#"} className={styles.skipLink} onClick={skipToContent}>
        Pular para o conteúdo
      </a>
      {/* Alterna entre o DS Playground (vitrine de componentes) e o ProtoTable
          (índice de protótipos/produtos reais) — telas deliberadamente
          distintas, sem Sidebar/dados compartilhados entre si (pedido
          explícito do usuário), mas com a MESMA estrutura visual (painel
          lateral + conteúdo, mesmos tokens de cor/fonte) pra lerem como dois
          módulos do mesmo sistema — cada uma expõe um botão pra ir pra outra,
          em vez de um seletor externo por cima das duas. */}
      {mode === "prototable" ? (
        <ProtoTablePage
          themePreference={preference}
          onThemePreferenceChange={setPreference}
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
            themePreference={preference}
            onThemePreferenceChange={setPreference}
            onNavigateToPrototable={() => setMode("prototable")}
          />
          <main className={styles.main}>
            {selectedId === ICON_LIBRARY_ID ? (
              <IconLibrary />
            ) : story?.tokenPage ? (
              <TokensPage key={story.id} story={story} initialSection={route.section} />
            ) : story ? (
              <StoryDetail key={story.id} story={story} theme={theme} initialSection={route.section} />
            ) : null}
          </main>
        </>
      )}
    </div>
  );
}
