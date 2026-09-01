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
import { maskDateDigits, parseMaskedDate } from "../shared/dateTimeMask";
import styles from "./DatePicker.module.css";

export type DatePickerState = "default" | "error" | "disabled";

interface DatePickerBaseProps {
  label?: string;
  /** true = não renderiza o FieldLabel visível, mas o texto de label ainda vira aria-label do input (nome acessível preservado). Útil quando o rótulo já está óbvio pelo contexto (ex.: uma FilterBar). */
  hideLabel?: boolean;
  required?: boolean;
  withInfo?: boolean;
  infoText?: string;
  state?: DatePickerState;
  helperText?: string;
  name?: string;
  minDate?: string;
  maxDate?: string;
  disabledDate?: (value: string) => boolean;
  placeholder?: string;
  showPicker?: boolean;
  /** true (padrão) = mostra o ícone de calendário fixo à esquerda do campo. false = campo sem ícone. */
  showIcon?: boolean;
}

export interface DatePickerSingleProps extends DatePickerBaseProps {
  range?: false;
  value: string | null;
  onChange: (value: string) => void;
}

export interface DatePickerRangeValue {
  start: string | null;
  end: string | null;
}

export interface DatePickerRangeProps extends DatePickerBaseProps {
  range: true;
  value: DatePickerRangeValue;
  onChange: (value: DatePickerRangeValue) => void;
  startLabel?: string;
  endLabel?: string;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

function formatDisplay(iso: string | null): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

interface FieldProps {
  fieldId: string;
  label?: string;
  hideLabel?: boolean;
  required?: boolean;
  withInfo?: boolean;
  infoText?: string;
  state: DatePickerState;
  helperText?: string;
  placeholder: string;
  value: string | null;
  onChange: (value: string) => void;
  minDate?: string;
  maxDate?: string;
  disabledDate?: (value: string) => boolean;
  showPicker: boolean;
  showIcon: boolean;
}

function DatePickerField({
  fieldId,
  label,
  hideLabel,
  required,
  withInfo,
  infoText,
  state,
  helperText,
  placeholder,
  value,
  onChange,
  minDate,
  maxDate,
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

  function isOutOfRange(iso: string): boolean {
    if (minDate && iso < minDate) return true;
    if (maxDate && iso > maxDate) return true;
    if (disabledDate?.(iso)) return true;
    return false;
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const masked = maskDateDigits(event.target.value);
    setInputText(masked);
    const iso = parseMaskedDate(masked);
    if (iso && !isOutOfRange(iso)) {
      onChange(iso);
    }
  }

  function handleBlur() {
    const iso = parseMaskedDate(inputText);
    if (!iso || isOutOfRange(iso)) {
      setInputText(formatDisplay(value));
    }
  }

  return (
    <div className={styles.field}>
      {label && !hideLabel && <FieldLabel text={label} required={required} withInfo={withInfo} infoText={infoText} fieldId={fieldId} />}

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
          aria-label={hideLabel ? label : undefined}
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
              value={value}
              onChange={(iso) => {
                onChange(iso);
                setOpen(false);
                triggerRef.current?.focus();
              }}
              minDate={minDate}
              maxDate={maxDate}
              disabledDate={disabledDate}
              accessibleLabel={label ?? placeholder}
            />
          </div>
        </FloatingPortal>
      )}

      {helperText && <HelperText text={helperText} intent={error ? "error" : "default"} fieldId={fieldId} />}
    </div>
  );
}

export function DatePicker(props: DatePickerProps) {
  const baseId = useId();
  const state = props.state ?? "default";
  const placeholder = props.placeholder ?? "DD/MM/AAAA";
  const showPicker = props.showPicker ?? true;
  const showIcon = props.showIcon ?? true;

  if (props.range) {
    const { value, onChange, startLabel = "Início", endLabel = "Fim" } = props;

    return (
      <div className={styles.rangeWrapper}>
        <DatePickerField
          fieldId={`${baseId}-start`}
          label={props.label ? `${props.label} — ${startLabel}` : startLabel}
          hideLabel={props.hideLabel}
          required={props.required}
          withInfo={props.withInfo}
          infoText={props.infoText}
          state={state}
          helperText={props.helperText}
          placeholder={placeholder}
          value={value.start}
          onChange={(iso) => onChange({ start: iso, end: value.end && value.end < iso ? null : value.end })}
          minDate={props.minDate}
          maxDate={props.maxDate}
          disabledDate={props.disabledDate}
          showPicker={showPicker}
          showIcon={showIcon}
        />
        <DatePickerField
          fieldId={`${baseId}-end`}
          label={props.label ? `${props.label} — ${endLabel}` : endLabel}
          hideLabel={props.hideLabel}
          required={props.required}
          withInfo={props.withInfo}
          infoText={props.infoText}
          state={state}
          helperText={undefined}
          placeholder={placeholder}
          value={value.end}
          onChange={(iso) => onChange({ start: value.start, end: iso })}
          minDate={value.start ?? props.minDate}
          maxDate={props.maxDate}
          disabledDate={props.disabledDate}
          showPicker={showPicker}
          showIcon={showIcon}
        />
      </div>
    );
  }

  return (
    <DatePickerField
      fieldId={baseId}
      label={props.label}
      hideLabel={props.hideLabel}
      required={props.required}
      withInfo={props.withInfo}
      infoText={props.infoText}
      state={state}
      helperText={props.helperText}
      placeholder={placeholder}
      value={props.value}
      onChange={props.onChange}
      minDate={props.minDate}
      maxDate={props.maxDate}
      disabledDate={props.disabledDate}
      showPicker={showPicker}
      showIcon={showIcon}
    />
  );
}
