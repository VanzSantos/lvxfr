import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  useFloating,
  useInteractions,
  useDismiss,
  useRole,
  useListNavigation,
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
import { summarizeSelection } from "../shared/multiSelectSummary";
import { normalizeForSearch } from "../shared/normalizeForSearch";
import styles from "./ComboBox.module.css";

export interface ComboBoxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type ComboBoxState = "default" | "error" | "disabled";

interface ComboBoxBaseProps {
  label?: string;
  required?: boolean;
  withInfo?: boolean;
  infoText?: string;
  options: ComboBoxOption[];
  placeholder?: string;
  state?: ComboBoxState;
  helperText?: string;
  name?: string;
}

export interface ComboBoxSingleProps extends ComboBoxBaseProps {
  multiple?: false;
  value: string;
  onChange?: (value: string) => void;
}

export interface ComboBoxMultipleProps extends ComboBoxBaseProps {
  multiple: true;
  value: string[];
  onChange?: (value: string[]) => void;
}

export type ComboBoxProps = ComboBoxSingleProps | ComboBoxMultipleProps;

export function ComboBox(props: ComboBoxProps) {
  const {
    label,
    required = false,
    withInfo = false,
    infoText,
    options,
    placeholder,
    state = "default",
    helperText,
    name,
  } = props;
  const multiple = props.multiple === true;

  const fieldId = useId();
  const disabled = state === "disabled";
  const error = state === "error";

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const selectedValues: string[] = multiple ? props.value : props.value ? [props.value] : [];
  const selectedLabels = selectedValues
    .map((value) => options.find((option) => option.value === value)?.label)
    .filter((currentLabel): currentLabel is string => Boolean(currentLabel));

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeForSearch(query.trim());
    if (!normalizedQuery) return options;
    return options.filter((option) => normalizeForSearch(option.label).includes(normalizedQuery));
  }, [options, query]);

  const disabledIndices = filteredOptions
    .map((option, index) => (option.disabled ? index : -1))
    .filter((index) => index >= 0);

  // Só sincroniza o texto exibido de volta pro value já confirmado quando
  // FECHADO (Esc, clique fora, Tab pra fora, seleção única confirmada) — uma
  // busca nunca digitada até o fim vira seleção sozinha. Bug real corrigido
  // aqui: esse efeito também rodava quando `open` virava true, o que apagava
  // o caractere que acabou de ser digitado (foi digitar QUE abriu o popup).
  // "Abrir = nova busca" (limpar a busca) só acontece explicitamente no
  // onFocus, nunca genericamente atrelado a `open` mudar de valor.
  useLayoutEffect(() => {
    if (open) return;
    const el = inputRef.current;
    if (!el) return;

    function sync() {
      if (!el) return;
      setQuery(multiple ? summarizeSelection(selectedLabels, el) : (selectedLabels[0] ?? ""));
    }

    sync();
    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, multiple, selectedLabels.join("|")]);

  const { refs, floatingStyles, context } = useFloating({
    open: open && !disabled,
    onOpenChange: (nextOpen) => {
      if (!disabled) setOpen(nextOpen);
    },
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
  });
  const mergedInputRef = useMergeRefs([refs.setReference, inputRef]);

  // Sem useClick: diferente do gatilho-botão do Select, aqui é um <input> de
  // texto — clicar nele já foca nativamente (dispara onFocus, que abre e
  // limpa a busca). Um useClick adicional tentaria alternar aberto/fechado a
  // cada clique, o que fecharia o popup ao clicar no campo já focado.
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: false,
    disabledIndices,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    dismiss,
    role,
    listNav,
  ]);

  function commitSelection(index: number) {
    const option = filteredOptions[index];
    if (!option || option.disabled) return;
    if (multiple) {
      const current = props.value;
      const next = current.includes(option.value)
        ? current.filter((value) => value !== option.value)
        : [...current, option.value];
      props.onChange?.(next);
      setQuery("");
      setActiveIndex(null);
    } else {
      props.onChange?.(option.value);
      setOpen(false);
    }
    // Mesmo cuidado de foco já resolvido no Select: garante que o <input>
    // continua com o foco real, independente de qualquer desvio que o
    // clique do mouse na opção possa tentar causar.
    inputRef.current?.focus();
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    if (!open) setOpen(true);
    const normalized = normalizeForSearch(nextQuery.trim());
    const nextFiltered = normalized
      ? options.filter((option) => normalizeForSearch(option.label).includes(normalized))
      : options;
    const firstEnabledIndex = nextFiltered.findIndex((option) => !option.disabled);
    setActiveIndex(firstEnabledIndex >= 0 ? firstEnabledIndex : null);
  }

  function handleClear() {
    if (multiple) {
      props.onChange?.([]);
    } else {
      props.onChange?.("");
    }
    setQuery("");
    setActiveIndex(null);
    inputRef.current?.focus();
  }

  const showClear = query.length > 0;

  return (
    <div className={styles.field}>
      {label && (
        <FieldLabel
          text={label}
          required={required}
          withInfo={withInfo}
          infoText={infoText}
          fieldId={fieldId}
        />
      )}

      <div className={`${styles.container} ${styles[state]}`}>
        <input
          ref={mergedInputRef}
          id={fieldId}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          className={styles.input}
          placeholder={placeholder}
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          disabled={disabled}
          required={required}
          aria-required={required || undefined}
          aria-invalid={error || undefined}
          aria-describedby={helperText ? `${fieldId}-message` : undefined}
          {...getReferenceProps({
            onFocus: () => {
              if (!disabled) {
                setQuery("");
                setOpen(true);
              }
            },
            onKeyDown: (event) => {
              if (event.key === "Enter" && open && activeIndex != null) {
                event.preventDefault();
                commitSelection(activeIndex);
              }
            },
            onBlur: () => setOpen(false),
          })}
        />
        {showClear && !disabled && (
          <button
            type="button"
            className={styles.clearButton}
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleClear}
            aria-label="Limpar"
          >
            <Icon name="x" size="small" color="var(--icone-secundario)" />
          </button>
        )}
        <Icon
          name="caret-down"
          size="small"
          color={disabled ? "var(--icone-inativo)" : "var(--icone-secundario)"}
        />
      </div>

      {open && !disabled && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={styles.listbox}
            aria-multiselectable={multiple || undefined}
            {...getFloatingProps()}
          >
            {filteredOptions.length === 0 ? (
              <div className={styles.empty}>Nenhum resultado encontrado.</div>
            ) : (
              filteredOptions.map((option, index) => {
                const selected = selectedValues.includes(option.value);
                return (
                  <div
                    key={option.value}
                    id={`${fieldId}-option-${index}`}
                    ref={(node) => {
                      listRef.current[index] = node;
                    }}
                    role="option"
                    aria-selected={selected}
                    aria-disabled={option.disabled || undefined}
                    className={`${styles.option} ${index === activeIndex ? styles.optionActive : ""} ${
                      option.disabled ? styles.optionDisabled : ""
                    }`}
                    tabIndex={-1}
                    {...getItemProps({
                      onMouseDown: (event) => event.preventDefault(),
                      onClick: () => commitSelection(index),
                    })}
                  >
                    <span className={styles.optionLabel}>{option.label}</span>
                    {selected && <Icon name="check" size="small" color="var(--acao-primaria)" />}
                  </div>
                );
              })
            )}
          </div>
        </FloatingPortal>
      )}

      {/* input visível carrega o texto exibido (label/resumo), nunca o value real —
          o value de verdade viaja em form submit via este espelho oculto, igual ao Select. */}
      {name &&
        selectedValues.map((value) => <input key={value} type="hidden" name={name} value={value} />)}

      {helperText && (
        <HelperText text={helperText} intent={error ? "error" : "default"} fieldId={fieldId} />
      )}
    </div>
  );
}
