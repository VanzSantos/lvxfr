import type { ReactNode } from "react";
import { Card } from "../../components/Card/Card";
import styles from "./SectionCard.module.css";

interface SectionCardProps {
  /** âncora da seção (menu "Nesta página") */
  id: string;
  title: string;
  /** controles alinhados à direita do título (ex.: copiar, alternar visualização) */
  actions?: ReactNode;
  children: ReactNode;
}

/** Seção da tela de componente: Card do SDK com título e ações. O <section> existe só
    pra carregar o id/âncora (Card não aceita id) e nomear a região pelo título. */
export function SectionCard({ id, title, actions, children }: SectionCardProps) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-titulo`}>
      <Card padding="medium">
        <div className={styles.header}>
          <h2 id={`${id}-titulo`} className={styles.title}>
            {title}
          </h2>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
        <div className={styles.body}>{children}</div>
      </Card>
    </section>
  );
}
