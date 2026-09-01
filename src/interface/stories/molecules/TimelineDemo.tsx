import { Timeline } from "../../../components/Timeline/Timeline";
import styles from "../Demo.module.css";

export function TimelineDemo() {
  return (
    <div className={styles.column} style={{ maxWidth: 420 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Histórico de um pedido</span>
        <Timeline
          accessibleLabel="Histórico do pedido #4521"
          items={[
            { title: "Pedido criado", description: "Recebido e aguardando pagamento", timestamp: "18/08 09:12", tone: "neutral" },
            { title: "Pagamento aprovado", description: "Via cartão de crédito", timestamp: "18/08 09:14", icon: "check-circle", tone: "success" },
            { title: "Falha no envio", description: "Endereço incompleto, aguardando correção", timestamp: "18/08 14:30", icon: "x-circle", tone: "error" },
            { title: "Endereço corrigido", timestamp: "18/08 15:02", icon: "info", tone: "info" },
            { title: "Em transporte", timestamp: "19/08 08:00" },
          ]}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com caixa de valor destacada + anexos (ex.: histórico clínico)</span>
        <Timeline
          accessibleLabel="Histórico do caso"
          items={[
            {
              title: "Registro de alta",
              description: "Paciente recebeu alta médica após avaliação da equipe.",
              timestamp: "02/08/2024 10:40",
              tone: "success",
              value: "Registro alta: 02/08/2024",
              attachments: [
                { label: "Ver arquivo em anexo", href: "#" },
                { label: "Ver formulário de alta", href: "#" },
              ],
            },
            {
              title: "Solicitação recusada",
              description: "Documentação incompleta para prosseguir.",
              timestamp: "28/07/2024 16:05",
              tone: "error",
              value: "Motivo: Documentação incompleta",
            },
            { title: "Internação registrada", timestamp: "25/07/2024 08:15", tone: "info" },
          ]}
        />
      </div>
    </div>
  );
}
