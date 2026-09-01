import { cloneElement, useId, useState, type ReactElement } from "react";
import {
  autoUpdate,
  flip,
  FloatingArrow,
  arrow,
  offset,
  shift,
  useFloating,
  useFocus,
  useHover,
  useDismiss,
  useRole,
  useInteractions,
  type Placement,
} from "@floating-ui/react";
import { useRef } from "react";
import styles from "./Tooltip.module.css";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  text: string;
  placement?: TooltipPlacement;
  autoAdjust?: boolean;
  triggerId?: string;
  children: ReactElement;
}

export function Tooltip({
  text,
  placement = "top",
  autoAdjust = true,
  triggerId,
  children,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);
  const tooltipId = useId();

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: placement as Placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      ...(autoAdjust ? [flip(), shift({ padding: 8 })] : []),
      arrow({ element: arrowRef }),
    ],
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const trigger = cloneElement(children, {
    ref: refs.setReference,
    id: triggerId,
    "aria-describedby": tooltipId,
    ...getReferenceProps(children.props),
    // Gatilho por toque: onTouchStart alterna o balão explicitamente,
    // já que hover não existe em telas de toque (a11y.notes do contrato).
    onTouchStart: (event: React.TouchEvent) => {
      children.props.onTouchStart?.(event);
      setOpen((prev) => !prev);
    },
  });

  return (
    <>
      {trigger}
      {open && (
        <div
          ref={refs.setFloating}
          id={tooltipId}
          className={styles.tooltip}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {text}
          <FloatingArrow ref={arrowRef} context={context} className={styles.arrow} />
        </div>
      )}
    </>
  );
}
