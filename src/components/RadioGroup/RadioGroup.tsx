import { useId } from "react";
import { Radio } from "../Radio/Radio";
import { HelperText } from "../HelperText/HelperText";
import styles from "./RadioGroup.module.css";

export interface RadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type RadioGroupState = "default" | "error";
export type RadioGroupOrientation = "vertical" | "horizontal";

export interface RadioGroupProps {
  label: string;
  options: RadioGroupOption[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  required?: boolean;
  state?: RadioGroupState;
  helperText?: string;
  orientation?: RadioGroupOrientation;
}

export function RadioGroup({
  label,
  options,
  value,
  onChange,
  name,
  required = false,
  state = "default",
  helperText,
  orientation = "vertical",
}: RadioGroupProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const helperId = useId();
  const error = state === "error";

  return (
    <fieldset
      className={styles.fieldset}
      aria-describedby={helperText ? `${helperId}-message` : undefined}
    >
      <legend className={styles.legend}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </legend>
      <div className={`${styles.options} ${orientation === "horizontal" ? styles.optionsHorizontal : ""}`}>
        {options.map((option) => (
          <Radio
            key={option.value}
            label={option.label}
            value={option.value}
            name={groupName}
            checked={value === option.value}
            onChange={onChange}
            state={option.disabled ? "disabled" : error ? "error" : "default"}
          />
        ))}
      </div>
      {helperText && (
        <div className={styles.helperTextWrapper}>
          <HelperText text={helperText} intent={error ? "error" : "default"} fieldId={helperId} />
        </div>
      )}
    </fieldset>
  );
}
