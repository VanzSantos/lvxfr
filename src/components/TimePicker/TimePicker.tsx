import { useEffect, useId, useRef, useState } from "react";
import {
  useFloating,
  useInteractions,
  useClick,
  useFocus,
  useDismiss,
  useRole,
  useMergeRefs,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";
import { FieldLabel } from "../FieldLabel/FieldLabel";
import { HelperText } from "../HelperText/HelperText";
import { Icon } from "../Icon/Icon";
import { maskTimeDigits, parseMaskedTime } from "../shared/dateTimeMask";
import styles from "./TimePicker.module.css";

export type TimePickerState = "default" | "error" | "disabled";

interface TimePickerBaseProps {
  label?: string;
  required?: boolean;
  withInfo?: boolean;
  infoText?: string;
  state?: TimePickerState;
  helperText?: string;
  name?: string;
  step?: number;
  minTime?: string;
  maxTime?: string;
  placeholder?: string;
  showPicker?: boolean;
  /** true (padrão) = mostra o ícone de relógio fixo à esquerda do campo. false = campo sem ícone. */
  showIcon?: boolean;
}

export interface TimePickerSingleProps extends TimePickerBaseProps {
  range?: false;
  value: string | null;
  onChange: (value: string) => void;
}

export interface TimePickerRangeValue {
  start: string | null;
  end: string | null;
}

export interface TimePickerRangeProps extends TimePickerBaseProps {
  range: true;
  value: TimePickerRangeValue;
  onChange: (value: TimePickerRangeValue) => void;
  startLabel?: string;
  endLabel?: string;
}

export type TimePickerProps = TimePickerSingleProps | TimePickerRangeProps;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function combine(hour: number, minute: number): string {
  return `${pad2(hour)}:${pad2(minute)}`;
}

interface FieldProps {
  fieldId: string;
  label?: string;
  required?: boolean;
  withInfo?: boolean;
  infoText?: string;
  state: TimePickerState;
  helperText?: string;
  placeholder: string;
  step: number;
  value: string | null;
  onChange: (value: string) => void;
  minTime?: string;
  maxTime?: string;
  showPicker: boolean;
  showIcon: boolean;
}

function TimePickerField({
  fieldId,
  label,
  required,
  withInfo,
  infoText,
  state,
  helperText,
  placeholder,
  step,
  value,
  onChange,
  minTime,
  maxTime,
  showPicker,
  showIcon,
}: FieldProps) {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState(() => value ?? "");
  const disabled = state === "disabled";
  const error = state === "error";
  const triggerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setInputText(value ?? "");
  }, [value]);

  const [selectedHour, selectedMinute] = value ? value.split(":").map(Number) : [null, null];

  const { refs, floatingStyles, context } = useFloating({
    open: open && !disabled,
    onOpenChange: (nextOpen) => {
      if (!disabled) setOpen(nextOpen);
    },
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
  });

  const click = useClick(context, { enabled: showPicker });
  const focus = useFocus(context, { enabled: showPicker });
  const dismiss = useDismiss(context, { enabled: showPicker });
  const role = useRole(context, { role: "dialog" });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, focus, dismiss, role]);
  const mergedTriggerRef = useMergeRefs([refs.setReference, triggerRef]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);

  function isCombinationDisabled(hour: number, minute: number): boolean {
    const candidate = combine(hour, minute);
    if (minTime && candidate < minTime) return true;
    if (maxTime && candidate > maxTime) return true;
    return false;
  }

  // Hora fica desabilitada só se NENHUM minuto dela cair dentro de [minTime, maxTime] —
  // testar contra um minuto fixo (ex.: minuto 0) desabilitaria horas válidas inteiras
  // quando minTime cai no meio da hora (ex.: minTime='08:30' não pode desabilitar a
  // hora 8 inteira, só os minutos 00–25 dela).
  function isHourDisabled(hour: number): boolean {
    if (minTime && combine(hour, 59) < minTime) return true;
    if (maxTime && combine(hour, 0) > maxTime) return true;
    return false;
  }

  function pickHour(hour: number) {
    if (isHourDisabled(hour)) return;
    const currentMinute = selectedMinute ?? 0;
    const minute = !isCombinationDisabled(hour, currentMinute)
      ? currentMinute
      : (minutes.find((m) => !isCombinationDisabled(hour, m)) ?? currentMinute);
    onChange(combine(hour, minute));
  }

  function pickMinute(minute: number) {
    const hour = selectedHour ?? 0;
    if (isCombinationDisabled(hour, minute)) return;
    onChange(combine(hour, minute));
  }

  function isTimeOutOfRange(time: string): boolean {
    if (minTime && time < minTime) return true;
    if (maxTime && time > maxTime) return true;
    return false;
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const masked = maskTimeDigits(event.target.value);
    setInputText(masked);
    const time = parseMaskedTime(masked);
    if (time && !isTimeOutOfRange(time)) {
      onChange(time);
    }
  }

  function handleBlur() {
    const time = parseMaskedTime(inputText);
    if (!time || isTimeOutOfRange(time)) {
      setInputText(value ?? "");
    }
  }

  return (
    <div className={styles.field}>
      {label && <FieldLabel text={label} required={required} withInfo={withInfo} infoText={infoText} fieldId={fieldId} />}

      <div className={`${styles.trigger} ${styles[state]}`}>
        {showIcon && (
          <Icon name="clock" size="small" color={disabled ? "var(--icone-inativo)" : "var(--icone-secundario)"} decorative />
        )}
        <input
          ref={mergedTriggerRef}
          id={fieldId}
          type="text"
          inputMode="numeric"
          className={styles.triggerInput}
          disabled={disabled}
          placeholder={placeholder}
          value={inputText}
          aria-haspopup={showPicker ? "dialog" : undefined}
          aria-expanded={showPicker ? open : undefined}
          aria-invalid={error || undefined}
          aria-describedby={helperText ? `${fieldId}-message` : undefined}
          {...getReferenceProps({
            onChange: handleInputChange,
            onBlur: handleBlur,
          })}
        />
        {showPicker && (
          <Icon name="caret-down" size="small" color={disabled ? "var(--icone-inativo)" : "var(--icone-secundario)"} decorative />
        )}
      </div>

      {showPicker && open && !disabled && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={styles.popover}
            aria-label={label ?? placeholder}
            {...getFloatingProps()}
          >
            <div className={styles.columns}>
              <div className={styles.column} aria-label="Hora">
                <div className={styles.columnHeader} aria-hidden="true">Hora</div>
                <div className={styles.columnList}>
                  {hours.map((hour) => {
                    const selected = selectedHour === hour;
                    return (
                      <button
                        key={hour}
                        type="button"
                        className={`${styles.option} ${selected ? styles.optionSelected : ""}`}
                        aria-pressed={selected}
                        disabled={isHourDisabled(hour)}
                        onClick={() => pickHour(hour)}
                      >
                        {pad2(hour)}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className={styles.column} aria-label="Minuto">
                <div className={styles.columnHeader} aria-hidden="true">Min</div>
                <div className={styles.columnList}>
                  {minutes.map((minute) => {
                    const selected = selectedMinute === minute;
                    const hour = selectedHour ?? 0;
                    const columnDisabled = isCombinationDisabled(hour, minute);
                    return (
                      <button
                        key={minute}
                        type="button"
                        className={`${styles.option} ${selected ? styles.optionSelected : ""}`}
                        aria-pressed={selected}
                        disabled={columnDisabled}
                        onClick={() => pickMinute(minute)}
                      >
                        {pad2(minute)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </FloatingPortal>
      )}

      {helperText && <HelperText text={helperText} intent={error ? "error" : "default"} fieldId={fieldId} />}
    </div>
  );
}

export function TimePicker(props: TimePickerProps) {
  const baseId = useId();
  const state = props.state ?? "default";
  const placeholder = props.placeholder ?? "HH:MM";
  const step = props.step ?? 5;
  const showPicker = props.showPicker ?? true;
  const showIcon = props.showIcon ?? true;

  if (props.range) {
    const { value, onChange, startLabel = "Início", endLabel = "Fim" } = props;

    return (
      <div className={styles.rangeWrapper}>
        <TimePickerField
          fieldId={`${baseId}-start`}
          label={props.label ? `${props.label} — ${startLabel}` : startLabel}
          required={props.required}
          withInfo={props.withInfo}
          infoText={props.infoText}
          state={state}
          helperText={props.helperText}
          placeholder={placeholder}
          step={step}
          value={value.start}
          onChange={(time) => onChange({ start: time, end: value.end && value.end < time ? null : value.end })}
          minTime={props.minTime}
          maxTime={props.maxTime}
          showPicker={showPicker}
          showIcon={showIcon}
        />
        <TimePickerField
          fieldId={`${baseId}-end`}
          label={props.label ? `${props.label} — ${endLabel}` : endLabel}
          required={props.required}
          withInfo={props.withInfo}
          infoText={props.infoText}
          state={state}
          helperText={undefined}
          placeholder={placeholder}
          step={step}
          value={value.end}
          onChange={(time) => onChange({ start: value.start, end: time })}
          minTime={value.start ?? props.minTime}
          maxTime={props.maxTime}
          showPicker={showPicker}
          showIcon={showIcon}
        />
      </div>
    );
  }

  return (
    <TimePickerField
      fieldId={baseId}
      label={props.label}
      required={props.required}
      withInfo={props.withInfo}
      infoText={props.infoText}
      state={state}
      helperText={props.helperText}
      placeholder={placeholder}
      step={step}
      value={props.value}
      onChange={props.onChange}
      minTime={props.minTime}
      maxTime={props.maxTime}
      showPicker={showPicker}
      showIcon={showIcon}
    />
  );
}
