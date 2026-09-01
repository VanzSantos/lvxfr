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
import { Calendar } from "../Calendar/Calendar";
import { maskDateTimeDigits, parseMaskedDateTime } from "../shared/dateTimeMask";
import styles from "./DateTimePicker.module.css";

export type DateTimePickerState = "default" | "error" | "disabled";

interface DateTimePickerBaseProps {
  label?: string;
  required?: boolean;
  withInfo?: boolean;
  infoText?: string;
  state?: DateTimePickerState;
  helperText?: string;
  name?: string;
  step?: number;
  minDateTime?: string;
  maxDateTime?: string;
  disabledDate?: (value: string) => boolean;
  placeholder?: string;
  showPicker?: boolean;
  /** true (padrão) = mostra o ícone de calendário fixo à esquerda do campo. false = campo sem ícone. */
  showIcon?: boolean;
}

export interface DateTimePickerSingleProps extends DateTimePickerBaseProps {
  range?: false;
  value: string | null;
  onChange: (value: string) => void;
}

export interface DateTimePickerRangeValue {
  start: string | null;
  end: string | null;
}

export interface DateTimePickerRangeProps extends DateTimePickerBaseProps {
  range: true;
  value: DateTimePickerRangeValue;
  onChange: (value: DateTimePickerRangeValue) => void;
  startLabel?: string;
  endLabel?: string;
}

export type DateTimePickerProps = DateTimePickerSingleProps | DateTimePickerRangeProps;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

function splitValue(value: string | null): { datePart: string | null; timePart: string | null } {
  if (!value) return { datePart: null, timePart: null };
  const [datePart, timePart] = value.split("T");
  return { datePart: datePart ?? null, timePart: timePart ?? null };
}

function formatDisplay(value: string | null): string {
  if (!value) return "";
  const { datePart, timePart } = splitValue(value);
  if (!datePart) return "";
  const [year, month, day] = datePart.split("-");
  return `${day}/${month}/${year}${timePart ? ` ${timePart}` : ""}`;
}

interface FieldProps {
  fieldId: string;
  label?: string;
  required?: boolean;
  withInfo?: boolean;
  infoText?: string;
  state: DateTimePickerState;
  helperText?: string;
  placeholder: string;
  step: number;
  value: string | null;
  onChange: (value: string) => void;
  minDateTime?: string;
  maxDateTime?: string;
  disabledDate?: (value: string) => boolean;
  showPicker: boolean;
  showIcon: boolean;
}

function DateTimePickerField({
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
  minDateTime,
  maxDateTime,
  disabledDate,
  showPicker,
  showIcon,
}: FieldProps) {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState(() => formatDisplay(value));
  const disabled = state === "disabled";
  const error = state === "error";
  const triggerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setInputText(formatDisplay(value));
  }, [value]);

  const { datePart, timePart } = splitValue(value);
  const [selectedHour, selectedMinute] = timePart ? timePart.split(":").map(Number) : [null, null];

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

  const minDatePart = minDateTime ? minDateTime.split("T")[0] : undefined;
  const maxDatePart = maxDateTime ? maxDateTime.split("T")[0] : undefined;

  function combine(date: string, hour: number, minute: number): string {
    return `${date}T${pad2(hour)}:${pad2(minute)}`;
  }

  function isCombinationDisabled(date: string, hour: number, minute: number): boolean {
    const candidate = combine(date, hour, minute);
    if (minDateTime && candidate < minDateTime) return true;
    if (maxDateTime && candidate > maxDateTime) return true;
    return false;
  }

  function isHourDisabled(date: string, hour: number): boolean {
    if (minDateTime && combine(date, hour, 59) < minDateTime) return true;
    if (maxDateTime && combine(date, hour, 0) > maxDateTime) return true;
    return false;
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);

  function pickDate(newDate: string) {
    const hour = selectedHour ?? 0;
    const minute = selectedMinute ?? 0;
    onChange(combine(newDate, hour, minute));
  }

  function pickHour(hour: number) {
    const date = datePart ?? todayISO();
    if (isHourDisabled(date, hour)) return;
    const currentMinute = selectedMinute ?? 0;
    const minute = !isCombinationDisabled(date, hour, currentMinute)
      ? currentMinute
      : (minutes.find((m) => !isCombinationDisabled(date, hour, m)) ?? currentMinute);
    onChange(combine(date, hour, minute));
  }

  function pickMinute(minute: number) {
    const date = datePart ?? todayISO();
    const hour = selectedHour ?? 0;
    if (isCombinationDisabled(date, hour, minute)) return;
    onChange(combine(date, hour, minute));
  }

  function isDateTimeOutOfRange(dateTime: string): boolean {
    if (minDateTime && dateTime < minDateTime) return true;
    if (maxDateTime && dateTime > maxDateTime) return true;
    const datePartOfCandidate = dateTime.split("T")[0];
    if (disabledDate?.(datePartOfCandidate)) return true;
    return false;
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const masked = maskDateTimeDigits(event.target.value);
    setInputText(masked);
    const dateTime = parseMaskedDateTime(masked);
    if (dateTime && !isDateTimeOutOfRange(dateTime)) {
      onChange(dateTime);
    }
  }

  function handleBlur() {
    const dateTime = parseMaskedDateTime(inputText);
    if (!dateTime || isDateTimeOutOfRange(dateTime)) {
      setInputText(formatDisplay(value));
    }
  }

  return (
    <div className={styles.field}>
      {label && <FieldLabel text={label} required={required} withInfo={withInfo} infoText={infoText} fieldId={fieldId} />}

      <div className={`${styles.trigger} ${styles[state]}`}>
        {showIcon && (
          <Icon name="calendar" size="small" color={disabled ? "var(--icone-inativo)" : "var(--icone-secundario)"} decorative />
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
            <Calendar
              value={datePart}
              onChange={pickDate}
              minDate={minDatePart}
              maxDate={maxDatePart}
              disabledDate={disabledDate}
              accessibleLabel={label ?? placeholder}
            />
            <div className={styles.timeColumns}>
              <div className={styles.column} aria-label="Hora">
                <div className={styles.columnHeader} aria-hidden="true">Hora</div>
                <div className={styles.columnList}>
                  {hours.map((hour) => {
                    const selected = selectedHour === hour;
                    const date = datePart ?? todayISO();
                    return (
                      <button
                        key={hour}
                        type="button"
                        className={`${styles.option} ${selected ? styles.optionSelected : ""}`}
                        aria-pressed={selected}
                        disabled={isHourDisabled(date, hour)}
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
                    const date = datePart ?? todayISO();
                    const hour = selectedHour ?? 0;
                    return (
                      <button
                        key={minute}
                        type="button"
                        className={`${styles.option} ${selected ? styles.optionSelected : ""}`}
                        aria-pressed={selected}
                        disabled={isCombinationDisabled(date, hour, minute)}
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

export function DateTimePicker(props: DateTimePickerProps) {
  const baseId = useId();
  const state = props.state ?? "default";
  const placeholder = props.placeholder ?? "DD/MM/AAAA HH:MM";
  const step = props.step ?? 5;
  const showPicker = props.showPicker ?? true;
  const showIcon = props.showIcon ?? true;

  if (props.range) {
    const { value, onChange, startLabel = "Início", endLabel = "Fim" } = props;

    return (
      <div className={styles.rangeWrapper}>
        <DateTimePickerField
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
          onChange={(dt) => onChange({ start: dt, end: value.end && value.end < dt ? null : value.end })}
          minDateTime={props.minDateTime}
          maxDateTime={props.maxDateTime}
          disabledDate={props.disabledDate}
          showPicker={showPicker}
          showIcon={showIcon}
        />
        <DateTimePickerField
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
          onChange={(dt) => onChange({ start: value.start, end: dt })}
          minDateTime={value.start ?? props.minDateTime}
          maxDateTime={props.maxDateTime}
          disabledDate={props.disabledDate}
          showPicker={showPicker}
          showIcon={showIcon}
        />
      </div>
    );
  }

  return (
    <DateTimePickerField
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
      minDateTime={props.minDateTime}
      maxDateTime={props.maxDateTime}
      disabledDate={props.disabledDate}
      showPicker={showPicker}
      showIcon={showIcon}
    />
  );
}
