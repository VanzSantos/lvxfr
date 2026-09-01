import { useState } from "react";
import { Stepper } from "../../../components/Stepper/Stepper";
import { Button } from "../../../components/Button/Button";
import styles from "../Demo.module.css";

export function StepperDemo() {
  const [passo, setPasso] = useState(1);

  const etapas = [
    { label: "Dados pessoais", description: "Nome e e-mail" },
    { label: "Endereço", description: "Entrega" },
    { label: "Pagamento", description: "Cartão ou Pix", icon: "check-circle" as const },
    { label: "Revisão" },
  ];

  return (
    <div className={styles.column} style={{ maxWidth: "none" }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>variant="stacked" (padrão) — conector ligando os marcadores, texto abaixo</span>
        <Stepper items={etapas} currentStep={1} accessibleLabel="Etapas do cadastro" variant="stacked" />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>variant="inline" — texto ao lado do marcador, sem conector</span>
        <Stepper items={etapas} currentStep={1} accessibleLabel="Etapas do cadastro (inline)" variant="inline" />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          Interativo (onStepClick — só etapas concluídas/atual são clicáveis)
        </span>
        <Stepper
          items={etapas}
          currentStep={passo}
          accessibleLabel="Etapas do cadastro interativo"
          onStepClick={setPasso}
        />
        <div className={styles.row} style={{ marginTop: 16 }}>
          <Button
            variant="neutral"
            outlined
            label="Anterior"
            onPress={() => setPasso((p) => Math.max(0, p - 1))}
            state={passo === 0 ? "disabled" : "default"}
          />
          <Button
            variant="primary"
            label="Próxima etapa"
            onPress={() => setPasso((p) => Math.min(etapas.length - 1, p + 1))}
            state={passo === etapas.length - 1 ? "disabled" : "default"}
          />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Última etapa (todas concluídas exceto a atual)</span>
        <Stepper items={etapas} currentStep={etapas.length - 1} accessibleLabel="Etapas quase completas" />
      </div>
    </div>
  );
}
