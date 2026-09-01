import { useId } from "react";
import styles from "./Slider.module.css";

export type SliderState = "default" | "disabled";

interface SliderBaseProps {
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  helperText?: string;
  state?: SliderState;
  showValue?: boolean;
  accessibleLabel?: string;
}

export interface SliderSingleProps extends SliderBaseProps {
  range?: false;
  value: number;
  onChange: (value: number) => void;
}

export interface SliderRangeProps extends SliderBaseProps {
  range: true;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export type SliderProps = SliderSingleProps | SliderRangeProps;

function percentage(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
}

export function Slider(props: SliderProps) {
  const fieldId = useId();
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const step = props.step ?? 1;
  const state = props.state ?? "default";
  const disabled = state === "disabled";
  const showValue = props.showValue ?? true;

  if (props.range) {
    const [lo, hi] = props.value;
    const loPercent = percentage(lo, min, max);
    const hiPercent = percentage(hi, min, max);

    const onChange = props.onChange;
    const handleLoChange = (next: number) => {
      onChange([Math.min(next, hi), hi]);
    };
    const handleHiChange = (next: number) => {
      onChange([lo, Math.max(next, lo)]);
    };

    return (
      <div className={styles.field}>
        {props.label && (
          <label className={styles.label} htmlFor={`${fieldId}-lo`}>
            {props.label}
          </label>
        )}
        <div className={styles.trackWrapper}>
          <div className={styles.track} />
          <div className={styles.trackFill} style={{ left: `${loPercent}%`, right: `${100 - hiPercent}%` }} />
          <input
            id={`${fieldId}-lo`}
            type="range"
            className={styles.rangeInput}
            min={min}
            max={max}
            step={step}
            value={lo}
            disabled={disabled}
            aria-label={props.accessibleLabel ? `${props.accessibleLabel} (mínimo)` : undefined}
            onChange={(event) => handleLoChange(Number(event.target.value))}
          />
          <input
            type="range"
            className={styles.rangeInput}
            min={min}
            max={max}
            step={step}
            value={hi}
            disabled={disabled}
            aria-label={props.accessibleLabel ? `${props.accessibleLabel} (máximo)` : undefined}
            onChange={(event) => handleHiChange(Number(event.target.value))}
          />
        </div>
        {showValue && (
          <span className={styles.value}>
            {lo} – {hi}
          </span>
        )}
        {props.helperText && (
          <span id={`${fieldId}-message`} className={styles.helperText}>
            {props.helperText}
          </span>
        )}
      </div>
    );
  }

  const valuePercent = percentage(props.value, min, max);

  return (
    <div className={styles.field}>
      {props.label && (
        <label className={styles.label} htmlFor={fieldId}>
          {props.label}
        </label>
      )}
      <div className={styles.trackWrapper}>
        <div className={styles.track} />
        <div className={styles.trackFill} style={{ left: "0%", right: `${100 - valuePercent}%` }} />
        <input
          id={fieldId}
          type="range"
          className={styles.rangeInput}
          min={min}
          max={max}
          step={step}
          value={props.value}
          disabled={disabled}
          aria-label={!props.label ? props.accessibleLabel : undefined}
          aria-describedby={props.helperText ? `${fieldId}-message` : undefined}
          onChange={(event) => props.onChange(Number(event.target.value))}
        />
      </div>
      {showValue && <span className={styles.value}>{props.value}</span>}
      {props.helperText && (
        <span id={`${fieldId}-message`} className={styles.helperText}>
          {props.helperText}
        </span>
      )}
    </div>
  );
}
