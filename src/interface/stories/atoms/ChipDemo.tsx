import { useState } from "react";
import { Chip } from "../../../components/Chip/Chip";
import styles from "../Demo.module.css";

export function ChipDemo() {
  const [filtros, setFiltros] = useState<Record<string, boolean>>({
    ativos: true,
    pendentes: false,
    arquivados: false,
  });
  const [tags, setTags] = useState(["React", "TypeScript", "Vite"]);

  return (
    <div className={styles.column} style={{ maxWidth: 440 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Selecionável (filtro)</span>
        <div className={styles.row}>
          <Chip
            label="Ativos"
            selected={filtros.ativos}
            onToggle={(v) => setFiltros((f) => ({ ...f, ativos: v }))}
          />
          <Chip
            label="Pendentes"
            selected={filtros.pendentes}
            onToggle={(v) => setFiltros((f) => ({ ...f, pendentes: v }))}
          />
          <Chip
            label="Arquivados"
            selected={filtros.arquivados}
            onToggle={(v) => setFiltros((f) => ({ ...f, arquivados: v }))}
          />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Removível (tag)</span>
        <div className={styles.row}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              removable
              onRemove={() => setTags((t) => t.filter((x) => x !== tag))}
            />
          ))}
          {tags.length === 0 && <span className={styles.itemLabel}>Nenhuma tag restante.</span>}
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Variantes de cor (estático)</span>
        <div className={styles.row}>
          <Chip label="Neutral" variant="neutral" />
          <Chip label="Info" variant="info" />
          <Chip label="Sucesso" variant="success" />
          <Chip label="Aviso" variant="warning" />
          <Chip label="Erro" variant="error" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Selecionável + removível ao mesmo tempo</span>
        <div className={styles.row}>
          <Chip
            label="Combinado"
            selected={filtros.ativos}
            onToggle={(v) => setFiltros((f) => ({ ...f, ativos: v }))}
            removable
            onRemove={() => alert("Removido")}
          />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Desabilitado</span>
        <div className={styles.row}>
          <Chip label="Desabilitado" disabled removable onRemove={() => {}} />
        </div>
      </div>
    </div>
  );
}
