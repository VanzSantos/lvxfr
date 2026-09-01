import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Stepper, type StepperItem } from "../Stepper/Stepper";
import { Button } from "../Button/Button";
import styles from "./Wizard.module.css";

export interface WizardStep extends StepperItem {
  content: ReactNode;
}

export interface WizardProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (index: number) => void;
  onComplete: () => void;
  validateStep?: (index: number) => boolean | Promise<boolean>;
  accessibleLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  completeLabel?: string;
}

export function Wizard({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  validateStep,
  accessibleLabel = "Etapas do formulário",
  previousLabel = "Anterior",
  nextLabel = "Próxima etapa",
  completeLabel = "Concluir",
}: WizardProps) {
  const [validating, setValidating] = useState(false);
  const isLastStep = currentStep === steps.length - 1;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.focus();
  }, [currentStep]);

  async function advance() {
    if (validateStep) {
      setValidating(true);
      const valid = await validateStep(currentStep);
      setValidating(false);
      if (!valid) return;
    }
    if (isLastStep) {
      onComplete();
    } else {
      onStepChange(currentStep + 1);
    }
  }

  function goBack() {
    if (currentStep > 0) onStepChange(currentStep - 1);
  }

  return (
    <div className={styles.wizard}>
      <Stepper
        items={steps}
        currentStep={currentStep}
        accessibleLabel={accessibleLabel}
        onStepClick={onStepChange}
      />

      <div className={styles.content} ref={contentRef} tabIndex={-1}>
        {steps[currentStep].content}
      </div>

      <div className={styles.footer}>
        <Button
          variant="neutral"
          outlined
          label={previousLabel}
          onPress={goBack}
          state={currentStep === 0 || validating ? "disabled" : "default"}
        />
        <Button
          variant="primary"
          label={isLastStep ? completeLabel : nextLabel}
          onPress={advance}
          state={validating ? "loading" : "default"}
        />
      </div>
    </div>
  );
}
