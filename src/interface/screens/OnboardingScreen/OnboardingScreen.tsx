import { useState } from "react";
import { Wizard } from "../../../components/Wizard/Wizard";
import { Icon } from "../../../components/Icon/Icon";
import styles from "./OnboardingScreen.module.css";

interface OnboardingScreenProps {
  /** true quando a página é renderizada dentro de um contêiner de tamanho próprio (ex.: preview da DS Playground), em vez de ocupar a viewport inteira. */
  embedded?: boolean;
  onFinish?: () => void;
}

function OnboardingStep({ icon, title, description }: { icon: "star" | "upload-simple" | "check-circle"; title: string; description: string }) {
  return (
    <div className={styles.step}>
      <span className={styles.iconWrapper}>
        <Icon name={icon} size="extraLarge" color="var(--acao-primaria)" decorative />
      </span>
      <h2 className={styles.stepTitle}>{title}</h2>
      <p className={styles.stepDescription}>{description}</p>
    </div>
  );
}

export function OnboardingScreen({ embedded = false, onFinish }: OnboardingScreenProps) {
  const [passo, setPasso] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const etapas = [
    {
      label: "Boas-vindas",
      content: <OnboardingStep icon="star" title="Bem-vindo!" description="Vamos te mostrar rapidamente como aproveitar melhor a plataforma." />,
    },
    {
      label: "Envie arquivos",
      content: <OnboardingStep icon="upload-simple" title="Envie seus arquivos" description="Arraste e solte documentos direto na área de trabalho, a qualquer momento." />,
    },
    {
      label: "Pronto",
      content: <OnboardingStep icon="check-circle" title="Tudo pronto!" description="Você já pode começar a usar a plataforma normalmente." />,
    },
  ];

  function handleComplete() {
    setFinalizado(true);
    onFinish?.();
  }

  return (
    <div className={embedded ? styles.pageEmbedded : styles.page}>
      <div className={styles.imagePanel} aria-hidden="true" />

      <div className={styles.formPanel}>
        <div className={styles.content}>
          {finalizado ? (
            <p className={styles.done}>Onboarding concluído.</p>
          ) : (
            <Wizard
              steps={etapas}
              currentStep={passo}
              onStepChange={setPasso}
              onComplete={handleComplete}
              accessibleLabel="Etapas de introdução"
              completeLabel="Começar a usar"
            />
          )}
        </div>
      </div>
    </div>
  );
}
