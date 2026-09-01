import { Breadcrumb } from "../../../components/Breadcrumb/Breadcrumb";
import styles from "../Demo.module.css";

export function BreadcrumbDemo() {
  return (
    <div className={styles.column} style={{ maxWidth: 480 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>3 níveis</span>
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Configurações", href: "/config" },
            { label: "Perfil" },
          ]}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>2 níveis (mínimo)</span>
        <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Sobre" }]} />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Último item com href (ignorado)</span>
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Produtos", href: "/produtos" },
            { label: "Fone X", href: "/produtos/fone-x" },
          ]}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com ícone no primeiro item (firstItemIcon)</span>
        <Breadcrumb
          firstItemIcon="house"
          items={[
            { label: "Início", href: "/" },
            { label: "Configurações", href: "/config" },
            { label: "Perfil" },
          ]}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          Colapsado (6 níveis, mais que o collapseThreshold padrão de 3) — clique nas reticências
        </span>
        <Breadcrumb
          firstItemIcon="house"
          items={[
            { label: "Início", href: "/" },
            { label: "Loja", href: "/loja" },
            { label: "Eletrônicos", href: "/loja/eletronicos" },
            { label: "Fones", href: "/loja/eletronicos/fones" },
            { label: "LVXFR", href: "/loja/eletronicos/fones/lvxfr" },
            { label: "Fone Olhosvaldo" },
          ]}
        />
      </div>
    </div>
  );
}
