import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { bgSecondary } from "../styles/tokens";
import { classnames } from "../utils/classnames";

export type DialogProps = {
  defaultOpen?: boolean;
  children: ReactNode | ReactNode[];
  className?: string;
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
}: DialogProps): JSX.Element | null {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (!open) {
      return;
    }

    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    document.documentElement.classList.add("overflow-hidden");

    return () => {
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 overflow-y-auto z-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gray-600 opacity-50" />
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0 h-screen bg-blackAlpha-600" aria-hidden />
        <As
          className={classnames(
            "inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-lg rounded-lg",
            className,
            bgSecondary
          )}
        >
          {children}
        </As>
      </div>
    </div>
  );
}
