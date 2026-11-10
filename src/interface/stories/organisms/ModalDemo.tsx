import { useState } from "react";
import { Modal } from "../../../components/Modal/Modal";
import { Button } from "../../../components/Button/Button";
import styles from "../Demo.module.css";

export function ModalDemo() {
  const [tituloEX, setTituloEX] = useState(false);
  const [soTitulo, setSoTitulo] = useState(false);
  const [soX, setSoX] = useState(false);
  const [semCabecalho, setSemCabecalho] = useState(false);
  const [pequeno, setPequeno] = useState(false);
  const [grande, setGrande] = useState(false);
  const [paddingSmall, setPaddingSmall] = useState(false);
  const [paddingMedium, setPaddingMedium] = useState(false);
  const [naoDismissible, setNaoDismissible] = useState(false);
  const [alerta, setAlerta] = useState(false);

  return (
    <div className={styles.column} style={{ maxWidth: 480 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Cabeçalho — 4 variações</span>
        <div className={styles.row}>
          <button type="button" className={styles.trigger} onClick={() => setTituloEX(true)}>
            Título + X
          </button>
          <button type="button" className={styles.trigger} onClick={() => setSoTitulo(true)}>
            Só título
          </button>
          <button type="button" className={styles.trigger} onClick={() => setSoX(true)}>
            Só X
          </button>
          <button type="button" className={styles.trigger} onClick={() => setSemCabecalho(true)}>
            Nenhum
          </button>
        </div>
        <Modal open={tituloEX} onClose={() => setTituloEX(false)} title="Editar perfil">
          <p style={{ margin: 0 }}>title definido + dismissible=true (padrão).</p>
        </Modal>
        <Modal
          open={soTitulo}
          onClose={() => setSoTitulo(false)}
          title="Processando"
          dismissible={false}
        >
          <div className={styles.column} style={{ maxWidth: "none" }}>
            <p style={{ margin: 0 }}>title definido + dismissible=false — sem X, sem backdrop, sem Esc.</p>
            <Button variant="primary" label="Ok" onPress={() => setSoTitulo(false)} />
          </div>
        </Modal>
        <Modal open={soX} onClose={() => setSoX(false)} accessibleLabel="Modal sem título visível">
          <p style={{ margin: 0 }}>title omitido (accessibleLabel cobre o nome acessível) + dismissible=true.</p>
        </Modal>
        <Modal
          open={semCabecalho}
          onClose={() => setSemCabecalho(false)}
          accessibleLabel="Modal sem cabeçalho"
          dismissible={false}
        >
          <div className={styles.column} style={{ maxWidth: "none" }}>
            <p style={{ margin: 0 }}>
              title omitido + dismissible=false — sem cabeçalho nenhum, corpo começa direto no
              topo.
            </p>
            <Button variant="primary" label="Fechar" onPress={() => setSemCabecalho(false)} />
          </div>
        </Modal>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Tamanhos (size)</span>
        <div className={styles.row}>
          <button type="button" className={styles.trigger} onClick={() => setPequeno(true)}>
            small
          </button>
          <button type="button" className={styles.trigger} onClick={() => setGrande(true)}>
            large
          </button>
        </div>
        <Modal open={pequeno} onClose={() => setPequeno(false)} title="Modal pequeno" size="small">
          <p style={{ margin: 0 }}>400px de largura máxima.</p>
        </Modal>
        <Modal open={grande} onClose={() => setGrande(false)} title="Modal grande" size="large">
          <p style={{ margin: 0 }}>720px de largura máxima.</p>
        </Modal>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Padding (mesma escala do Card)</span>
        <div className={styles.row}>
          <button type="button" className={styles.trigger} onClick={() => setPaddingSmall(true)}>
            padding=&quot;small&quot;
          </button>
          <button type="button" className={styles.trigger} onClick={() => setPaddingMedium(true)}>
            padding=&quot;medium&quot;
          </button>
        </div>
        <Modal
          open={paddingSmall}
          onClose={() => setPaddingSmall(false)}
          title="Padding compacto"
          padding="small"
        >
          <p style={{ margin: 0 }}>espaco-p (12px) — mesmo valor de Card padding=&quot;small&quot;.</p>
        </Modal>
        <Modal
          open={paddingMedium}
          onClose={() => setPaddingMedium(false)}
          title="Padding médio"
          padding="medium"
        >
          <p style={{ margin: 0 }}>espaco-g (24px) — mesmo valor de Card padding=&quot;medium&quot;.</p>
        </Modal>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>dismissible=false (só fecha pelo botão dentro)</span>
        <button type="button" className={styles.trigger} onClick={() => setNaoDismissible(true)}>
          Abrir modal não-dismissible
        </button>
        <Modal
          open={naoDismissible}
          onClose={() => setNaoDismissible(false)}
          title="Confirme para continuar"
          dismissible={false}
        >
          <div className={styles.column} style={{ maxWidth: "none" }}>
            <p style={{ margin: 0 }}>
              Clique no fundo, no X ou aperte Esc — nenhum funciona aqui. Só o botão abaixo fecha.
            </p>
            <Button variant="primary" label="Entendi" onPress={() => setNaoDismissible(false)} />
          </div>
        </Modal>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>role=alertdialog (confirmação crítica)</span>
        <button type="button" className={styles.trigger} onClick={() => setAlerta(true)}>
          Excluir item
        </button>
        <Modal
          open={alerta}
          onClose={() => setAlerta(false)}
          title="Excluir permanentemente?"
          role="alertdialog"
          size="small"
        >
          <div className={styles.column} style={{ maxWidth: "none" }}>
            <p style={{ margin: 0 }}>Esta ação não pode ser desfeita.</p>
            <div className={styles.row}>
              <Button variant="neutral" label="Cancelar" onPress={() => setAlerta(false)} />
              <Button variant="destructive" label="Excluir" onPress={() => setAlerta(false)} />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
