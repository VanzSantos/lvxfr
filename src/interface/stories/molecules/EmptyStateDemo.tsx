import { useState } from "react";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import styles from "../Demo.module.css";

export function EmptyStateDemo() {
  const [temFiltro, setTemFiltro] = useState(true);

  return (
    <div className={styles.column} style={{ maxWidth: 480 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Só título</span>
        <EmptyState title="Nenhum item ainda" />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com ícone e descrição</span>
        <EmptyState
          icon="info"
          title="Nenhum resultado encontrado"
          description="Tente ajustar os termos da busca ou remover alguns filtros."
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com ação (interativo)</span>
        {temFiltro ? (
          <EmptyState
            icon="info"
            title="Nenhum resultado com esses filtros"
            description="Remova os filtros pra ver todos os itens."
            actionLabel="Limpar filtros"
            onAction={() => setTemFiltro(false)}
          />
        ) : (
          <p style={{ margin: 0 }}>3 itens encontrados (filtros limpos).</p>
        )}
      </div>
    </div>
  );
}
