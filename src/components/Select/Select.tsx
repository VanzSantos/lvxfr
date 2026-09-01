import { useId, useLayoutEffect, useRef, useState } from "react";
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  useListNavigation,
  useTypeahead,
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
import styles from "./Select.module.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectState = "default" | "error" | "disabled";

interface SelectBaseProps {
  label?: string;
  required?: boolean;
  withInfo?: boolean;
  infoText?: string;
  options: SelectOption[];
  placeholder?: string;
  state?: SelectState;
  helperText?: string;
  name?: string;
}

export interface SelectSingleProps extends SelectBaseProps {
  multiple?: false;
  value: string;
  onChange?: (value: string) => void;
}

export interface SelectMultipleProps extends SelectBaseProps {
  multiple: true;
  value: string[];
  onChange?: (value: string[]) => void;
}

export type SelectProps = SelectSingleProps | SelectMultipleProps;

export function Select(props: SelectProps) {
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

  const selectedValues: string[] = multiple ? props.value : props.value ? [props.value] : [];

  const listRef = useRef<Array<HTMLElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>(options.map((option) => option.label));
  labelsRef.current = options.map((option) => option.label);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const triggerTextRef = useRef<HTMLSpanElement | null>(null);
  const [multiDisplay, setMultiDisplay] = useState("");

  const disabledIndices = options
    .map((option, index) => (option.disabled ? index : -1))
    .filter((index) => index >= 0);

  const { refs, floatingStyles, context } = useFloating({
    open: open && !disabled,
    onOpenChange: (nextOpen) => {
      if (!disabled) setOpen(nextOpen);
    },
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
  });
  const mergedTriggerRef = useMergeRefs([refs.setReference, triggerRef]);

  const click = useClick(context);
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
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    // findMatch customizado pra normalizar acento antes de comparar — sem
    // isso, digitar "mex" não pula pra "México" (o findMatch padrão do
    // floating-ui só faz toLowerCase, não remove diacríticos). Mesma
    // correção que o ComboBox já tinha via normalizeForSearch, agora
    // compartilhada (dívida técnica registrada em ROADMAP.md, resolvida).
    findMatch: (list, typedString) => {
      const normalizedTyped = normalizeForSearch(typedString);
      return list.find(
        (item) => item != null && normalizeForSearch(item).startsWith(normalizedTyped)
      );
    },
    onMatch: (index) => {
      setActiveIndex(index);
      // com o popup fechado, mudar só o activeIndex não tem efeito visível
      // nenhum (nada renderiza o destaque) — precisa abrir pra typeahead
      // fechado realmente "realçar" a opção, como o contrato promete.
      if (!disabled) setOpen(true);
    },
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    listNav,
    typeahead,
  ]);

  function commitSelection(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    if (multiple) {
      const current = props.value;
      const next = current.includes(option.value)
        ? current.filter((value) => value !== option.value)
        : [...current, option.value];
      props.onChange?.(next);
    } else {
      props.onChange?.(option.value);
      setOpen(false);
    }
    // Reforça o foco de volta pro gatilho: o onMouseDown com preventDefault
    // nas opções não bastou sozinho — algum handler interno ainda movia o
    // foco pro <div> da opção clicada (confirmado testando no navegador).
    // Sem isso, ao fechar o popup o foco se perdia e voltava pro topo da
    // página, quebrando a navegação por teclado pra quem usa leitor de tela.
    triggerRef.current?.focus();
  }

  const selectedLabels = selectedValues
    .map((value) => options.find((option) => option.value === value)?.label)
    .filter((currentLabel): currentLabel is string => Boolean(currentLabel));

  // Contador "+N" pro select múltiplo: mede com canvas quantos labels cabem
  // de verdade na largura do gatilho, em vez de deixar o CSS cortar o texto
  // no meio com reticências. Recalcula quando a seleção muda ou o gatilho é
  // redimensionado (ex.: layout responsivo). Lógica compartilhada com
  // ComboBox (src/components/shared/multiSelectSummary.ts).
  useLayoutEffect(() => {
    if (!multiple) return;
    const el = triggerTextRef.current;
    if (!el) return;

    function recompute() {
      if (!el) return;
      setMultiDisplay(summarizeSelection(selectedLabels, el));
    }

    recompute();
    const resizeObserver = new ResizeObserver(recompute);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiple, selectedLabels.join("|")]);

  const triggerLabel = selectedLabels.length === 0 ? placeholder : multiple ? multiDisplay : selectedLabels[0];

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

      <button
        ref={mergedTriggerRef}
        id={fieldId}
        type="button"
        className={`${styles.trigger} ${styles[state]}`}
        disabled={disabled}
        aria-required={required || undefined}
        aria-invalid={error || undefined}
        aria-describedby={helperText ? `${fieldId}-message` : undefined}
        {...getReferenceProps({
          // navegação "virtual": o foco nunca sai do botão, então é aqui —
          // não no onKeyDown da opção — que Enter/Espaço precisam ser
          // tratados. Bug real encontrado testando no navegador: Enter não
          // confirmava nada, porque o keydown nunca chegava até a opção.
          onKeyDown: (event) => {
            if ((event.key === "Enter" || event.key === " ") && open && activeIndex != null) {
              event.preventDefault();
              commitSelection(activeIndex);
            }
          },
        })}
      >
        <span
          ref={triggerTextRef}
          className={`${styles.triggerText} ${selectedValues.length === 0 ? styles.placeholder : ""}`}
        >
          {triggerLabel}
        </span>
        <Icon
          name="caret-down"
          size="small"
          color={disabled ? "var(--icone-inativo)" : "var(--icone-secundario)"}
        />
      </button>

      {open && !disabled && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={styles.listbox}
            aria-multiselectable={multiple || undefined}
            {...getFloatingProps()}
          >
            {options.map((option, index) => {
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
                    // navegação "virtual": o foco real de teclado nunca sai do
                    // botão-gatilho, então onKeyDown aqui nunca dispararia —
                    // Enter/Espaço são tratados no onKeyDown do próprio botão
                    // (ver getReferenceProps acima). onMouseDown com
                    // preventDefault + o triggerRef.focus() em
                    // commitSelection garantem que o clique do mouse também
                    // não desvie o foco pro <div> da opção.
                    onMouseDown: (event) => event.preventDefault(),
                    onClick: () => commitSelection(index),
                  })}
                >
                  <span className={styles.optionLabel}>{option.label}</span>
                  {selected && <Icon name="check" size="small" color="var(--acao-primaria)" />}
                </div>
              );
            })}
          </div>
        </FloatingPortal>
      )}

      {name &&
        selectedValues.map((value) => <input key={value} type="hidden" name={name} value={value} />)}

      {helperText && (
        <HelperText text={helperText} intent={error ? "error" : "default"} fieldId={fieldId} />
      )}
    </div>
  );
}
