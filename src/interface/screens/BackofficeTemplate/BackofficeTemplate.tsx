import { AppShell } from "../shared/AppShell";
import styles from "./BackofficeTemplate.module.css";

interface BackofficeTemplateProps {
  embedded?: boolean;
}

/** Página de backoffice vazia — casca compartilhada (AppShell: SideNav +
    header responsivo com Breadcrumb/NotificationCenter, ver
    interface/screens/shared/AppShell.tsx) + card de conteúdo vazio, num tom
    mais claro que o fundo da página. Pensada como ponto de partida
    reaproveitável pra qualquer tela nova de backoffice — o consumidor
    substitui só o conteúdo do card vazio. */
export function BackofficeTemplate({ embedded = false }: BackofficeTemplateProps) {
  return (
    <AppShell
      embedded={embedded}
      activeNavKey="inicio"
      breadcrumbItems={[{ label: "Início", href: "/" }, { label: "Visão geral" }]}
    >
      <div className={styles.emptyCard} />
    </AppShell>
  );
}
