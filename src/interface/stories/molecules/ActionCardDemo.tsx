import { ActionCard } from "../../../components/ActionCard/ActionCard";
import styles from "../Demo.module.css";

export function ActionCardDemo() {
  return (
    <div className={styles.column} style={{ maxWidth: 720 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Grade de ações administrativas</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          <ActionCard
            icon="user"
            title="Contatos de suporte"
            description="Realize as parametrizações de responsáveis regionais e contatos que o corretor poderá visualizar."
            primaryLabel="Gerenciar contatos"
            onPrimaryAction={() => {}}
          />
          <ActionCard
            icon="check-circle"
            title="Verificar todas as assinaturas"
            description="Realize uma busca e verifique todas as assinaturas em propostas realizadas e/ou disponíveis na plataforma."
            status={{ label: "Situação atual", active: true }}
            primaryLabel="Verificar assinaturas"
            onPrimaryAction={() => {}}
            onInfo={() => {}}
            onSettings={() => {}}
          />
          <ActionCard
            icon="trash"
            iconTone="destructive"
            title="Cancelar contratos em lote"
            description="Realize o cancelamento em lote dos contratos em situação 'Aguardando assinatura na CLICKSIGN'."
            primaryLabel="Cancelar contratos"
            primaryVariant="neutral"
            onPrimaryAction={() => {}}
            onInfo={() => {}}
            onSettings={() => {}}
          />
          <ActionCard
            icon="x-circle"
            iconTone="destructive"
            title="Suspender vendas"
            description="Ao suspender as vendas nenhuma nova proposta poderá ser realizada por corretores através da plataforma."
            status={{ label: "Vendas ativas", active: true }}
            primaryLabel="Suspender temporariamente"
            primaryVariant="neutral"
            onPrimaryAction={() => {}}
          />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com ação secundária em texto (link, padrão)</span>
        <div style={{ maxWidth: 340 }}>
          <ActionCard
            icon="star"
            title="Título"
            description="Descritivo rápido sobre a ação disponível neste cartão."
            status={{ label: "Situação atual", active: true }}
            primaryLabel="Ação principal"
            onPrimaryAction={() => {}}
            secondaryLabel="Ação secundária"
            onSecondaryAction={() => {}}
          />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com dois botões no rodapé (secondaryVariant + secondaryOutlined)</span>
        <div style={{ maxWidth: 340 }}>
          <ActionCard
            icon="trash"
            iconTone="destructive"
            title="Excluir conta"
            description="Esta ação remove permanentemente todos os dados associados a esta conta."
            primaryLabel="Excluir"
            primaryVariant="destructive"
            onPrimaryAction={() => {}}
            secondaryLabel="Cancelar"
            onSecondaryAction={() => {}}
            secondaryVariant="neutral"
            secondaryOutlined
          />
        </div>
      </div>
    </div>
  );
}
