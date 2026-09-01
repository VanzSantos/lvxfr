import { useState } from "react";
import { Drawer } from "../../../components/Drawer/Drawer";
import { Button } from "../../../components/Button/Button";
import styles from "../Demo.module.css";

export function DrawerDemo() {
  const [bloqueante, setBloqueante] = useState(false);
  const [persistente, setPersistente] = useState(false);
  const [pequeno, setPequeno] = useState(false);
  const [grande, setGrande] = useState(false);
  const [naoDismissible, setNaoDismissible] = useState(false);
  const [contador, setContador] = useState(0);
  const [empurrando, setEmpurrando] = useState(false);

  return (
    <div className={styles.column} style={{ maxWidth: "none" }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>modal=true (padrão) — bloqueia, igual Modal</span>
        <button type="button" className={styles.trigger} onClick={() => setBloqueante(true)}>
          Abrir Drawer bloqueante
        </button>
        <Drawer open={bloqueante} onClose={() => setBloqueante(false)} title="Detalhes do item">
          <p style={{ margin: 0 }}>
            Com backdrop, focus trap e Esc nativos — tente clicar fora ou apertar Esc.
          </p>
        </Drawer>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          modal=false — persistente, resto da página continua interativo
        </span>
        <div className={styles.row}>
          <button type="button" className={styles.trigger} onClick={() => setPersistente(true)}>
            Abrir Drawer persistente
          </button>
          <button
            type="button"
            className={styles.trigger}
            onClick={() => setContador((c) => c + 1)}
          >
            Contador: {contador}
          </button>
        </div>
        <Drawer
          open={persistente}
          onClose={() => setPersistente(false)}
          title="Filtros"
          modal={false}
        >
          <p style={{ margin: 0 }}>
            Sem backdrop, sem focus trap — clique no botão &quot;Contador&quot; ao lado enquanto
            isto está aberto. Esc ainda fecha (via listener próprio, não nativo).
          </p>
        </Drawer>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          layout=&quot;push&quot; (só com modal=false) — fica AO LADO do conteúdo, empurrando
          em vez de sobrepor. O consumidor precisa colocar o Drawer no mesmo container flex
          do conteúdo (Datatable não sabe disso sozinho).
        </span>
        <button type="button" className={styles.trigger} onClick={() => setEmpurrando((v) => !v)}>
          {empurrando ? "Fechar" : "Abrir"} painel lateral (push)
        </button>
        <div
          style={{
            display: "flex",
            marginTop: 8,
            width: "100%",
            height: 320,
            border: "1px solid var(--borda-base)",
            borderRadius: "var(--raio-pp)",
            overflow: "hidden",
          }}
        >
          <div style={{ flex: 1, minWidth: 0, padding: 24, overflow: "auto" }}>
            <h3 style={{ marginTop: 0 }}>Conteúdo principal da página</h3>
            <p>
              Este bloco representa o conteúdo real de uma tela — reduz de largura quando o
              painel ao lado abre, sem nada sobrepor. Repare que o texto continua totalmente
              legível e clicável, diferente do que aconteceria com layout=&quot;overlay&quot;.
            </p>
            <p>
              Continue rolando ou redimensionando a janela: o painel lateral se comporta como
              uma coluna normal do layout, não como uma camada flutuante por cima.
            </p>
          </div>
          <Drawer
            open={empurrando}
            onClose={() => setEmpurrando(false)}
            title="Anotações"
            modal={false}
            layout="push"
            size="small"
          >
            <p style={{ margin: 0 }}>Este painel ocupa espaço de verdade, não flutua por cima.</p>
          </Drawer>
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Tamanhos (largura)</span>
        <div className={styles.row}>
          <button type="button" className={styles.trigger} onClick={() => setPequeno(true)}>
            small (320px)
          </button>
          <button type="button" className={styles.trigger} onClick={() => setGrande(true)}>
            large (560px)
          </button>
        </div>
        <Drawer open={pequeno} onClose={() => setPequeno(false)} title="Pequeno" size="small">
          <p style={{ margin: 0 }}>320px de largura.</p>
        </Drawer>
        <Drawer open={grande} onClose={() => setGrande(false)} title="Grande" size="large">
          <p style={{ margin: 0 }}>560px de largura.</p>
        </Drawer>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>dismissible=false</span>
        <button type="button" className={styles.trigger} onClick={() => setNaoDismissible(true)}>
          Abrir Drawer não-dismissible
        </button>
        <Drawer
          open={naoDismissible}
          onClose={() => setNaoDismissible(false)}
          title="Confirme para continuar"
          dismissible={false}
        >
          <div className={styles.column} style={{ maxWidth: "none" }}>
            <p style={{ margin: 0 }}>Sem X, sem backdrop, sem Esc — só o botão fecha.</p>
            <Button variant="primary" label="Entendi" onPress={() => setNaoDismissible(false)} />
          </div>
        </Drawer>
      </div>
    </div>
  );
}
