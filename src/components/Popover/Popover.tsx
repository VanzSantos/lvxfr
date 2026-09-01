import { cloneElement, useId, useState, type ReactElement, type ReactNode } from "react";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
  type Placement,
} from "@floating-ui/react";
import styles from "./Popover.module.css";

export type PopoverRole = "dialog" | "menu" | "listbox";
export type PopoverTone = "light" | "dark";

export interface PopoverProps {
  children: ReactElement;
  content: ReactNode;
  placement?: Placement;
  role?: PopoverRole;
  accessibleLabel?: string;
  /** Estado controlado (opcional) — só necessário quando o consumidor precisa fechar o painel programaticamente (ex.: após selecionar um item de menu). Sem isso, o estado é interno (padrão). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 'light' (padrão) = painel claro de sempre. 'dark' = fundo-invertido, pra gatilhos que já vivem numa superfície escura (ex.: CallControlBar) — o conteúdo (content) continua responsável por usar cores de texto claras, o Popover só resolve o fundo/borda do painel. */
  tone?: PopoverTone;
}

export function Popover({
  children,
  content,
  placement = "bottom-start",
  role = "dialog",
  accessibleLabel,
  open: controlledOpen,
  onOpenChange,
  tone = "light",
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = (next: boolean) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };
  const panelId = useId();

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const floatingRole = useRole(context, { role });

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, floatingRole]);

  const props = children.props as Record<string, unknown>;

  const trigger = cloneElement(children, {
    ref: refs.setReference,
    "aria-expanded": open,
    "aria-haspopup": role,
    ...getReferenceProps(props),
  } as Record<string, unknown>);

  return (
    <>
      {trigger}
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              id={panelId}
              className={`${styles.popover} ${tone === "dark" ? styles.dark : ""}`}
              style={floatingStyles}
              aria-label={accessibleLabel}
              {...getFloatingProps()}
            >
              {content}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
