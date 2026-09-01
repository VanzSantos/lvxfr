import { useState } from "react";
import { CommentComposer } from "../../../components/CommentComposer/CommentComposer";
import styles from "../Demo.module.css";

interface Note {
  id: number;
  text: string;
}

export function CommentComposerDemo() {
  const [texto, setTexto] = useState("");
  const [notas, setNotas] = useState<Note[]>([
    { id: 1, text: "Solicitação de serviço: Em andamento. Protocolo: 3356142024130995509." },
  ]);
  const [textoBloqueado, setTextoBloqueado] = useState("");
  const [textoAlerta, setTextoAlerta] = useState(
    "Este texto já passou do limite de 40 caracteres definido no exemplo abaixo."
  );

  function publicar(value: string) {
    setNotas((current) => [...current, { id: current.length + 1, text: value }]);
    setTexto("");
  }

  return (
    <div className={styles.column} style={{ maxWidth: 480 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Completo — com utilitários (anexar imagem, marcar importante)</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notas.map((nota) => (
            <div key={nota.id} style={{ padding: 8, background: "var(--fundo-secundario)", borderRadius: 8, fontSize: 14 }}>
              {nota.text}
            </div>
          ))}
        </div>
        <CommentComposer
          value={texto}
          onChange={setTexto}
          onSubmit={publicar}
          onAttachImage={() => {}}
          onMarkImportant={() => {}}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Sem utilitários (só texto + publicar)</span>
        <CommentComposer value="" onChange={() => {}} onSubmit={() => {}} placeholder="Escreva um comentário..." submitLabel="Comentar" />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Desabilitado (ex.: enviando)</span>
        <CommentComposer value="Salvando esta nota..." onChange={() => {}} onSubmit={() => {}} disabled />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          Limite bloqueando a digitação (limitMode="block", maxLength=40) — impossível digitar além do limite
        </span>
        <CommentComposer
          value={textoBloqueado}
          onChange={setTextoBloqueado}
          onSubmit={() => {}}
          maxLength={40}
          showCharacterCount
          limitMode="block"
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          Limite avisando e bloqueando o botão (limitMode="warn", maxLength=40) — digitação livre, alerta + Publicar desabilitado ao ultrapassar
        </span>
        <CommentComposer
          value={textoAlerta}
          onChange={setTextoAlerta}
          onSubmit={() => {}}
          maxLength={40}
          showCharacterCount
          limitMode="warn"
        />
      </div>
    </div>
  );
}
