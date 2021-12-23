import type { ReactNode } from "react";
import { useEffect, useState, useRef } from "react";

import { bgSecondary, hoverShadow } from "../styles/tokens";
import { classnames } from "../utils/classnames";

export type DialogProps = {
  defaultOpen?: boolean;
  children: ReactNode | ReactNode[];
  className?: string;
  onClose?: () => void;
} & (
  | {
      as: "section";
      "aria-labelledby": string;
    }
  | {
      as: "div";
    }
);

export function Dialog({
  defaultOpen,
  children,
  as: As = "div",
  className,
  onClose,
}: DialogProps): JSX.Element | null {
  const [open, setOpen] = useState(defaultOpen);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const activeElementRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        if (onClose) {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    // store currently focused element for later refocus
    activeElementRef.current = document.activeElement;

    // focus the least destructive element within the dialog - close button
    if (buttonRef.current) {
      buttonRef.current.focus();
    }

    // when closing the dialog, refocus the previously focused element
    return () => {
      if (activeElementRef.current instanceof HTMLElement) {
        activeElementRef.current.focus();
      }
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-20 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-stone-600" />
      <div className="px-4 text-center">
        <div className="fixed inset-0 rounded-lg" aria-hidden />
        <As
          className={classnames(
            "inline-block w-full max-w-xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg",
            hoverShadow,
            className,
            bgSecondary
          )}
        >
          <div className="flex justify-end w-full">
            <button
              type="button"
              className="w-6 h-6 focus:outline-dotted focus:outline-2"
              onClick={onClose}
              aria-label="Close"
              ref={buttonRef}
            >
              X
            </button>
          </div>

          {children}
        </As>
      </div>
    </div>
  );
}
