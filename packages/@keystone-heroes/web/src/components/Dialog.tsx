import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { classnames } from "src/utils/classnames";

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

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 overflow-y-auto z-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0 h-screen bg-blackAlpha-600" aria-hidden />
        <As
          className={classnames(
            "inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-lg rounded-lg",
            className
          )}
        >
          {children}
        </As>
      </div>
    </div>
  );
}
