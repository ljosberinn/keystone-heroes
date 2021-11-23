import { forwardRef } from "react";
import type { MouseEvent, KeyboardEvent } from "react";

import { bgPrimary, hoverBg } from "../styles/tokens";
import { classnames } from "../utils/classnames";

export type TabListProps = {
  children: JSX.Element[];
  "aria-label"?: string;
};

export function TabList({
  children,
  "aria-label": ariaLabel,
}: TabListProps): JSX.Element {
  return (
    <div className="flex justify-between pt-2">
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className="hidden w-full px-2 sm:flex sm:flex-row sm:py-0 sm:w-initial"
      >
        {children}
      </div>
    </div>
  );
}

export type TabButtonProps = {
  children: string;
  className?: string;
  id: string | number;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  index: number;
  listLength: number;
  selectedIndex: number;
};

export const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(
  (
    {
      children,
      className,
      id,
      onKeyDown,
      onClick,
      index,
      listLength,
      selectedIndex,
    },
    ref
  ) => {
    const isFirst = index === 0;
    const isLast = index === listLength - 1;

    const selected = index === selectedIndex;

    return (
      <button
        type="button"
        ref={ref}
        role="tab"
        className={classnames(
          "p-2 truncate focus:outline-none focus:ring transition",
          hoverBg,
          selected && bgPrimary,
          isFirst && "rounded-tl-lg",
          isLast && "rounded-tr-lg",
          className
        )}
        aria-controls={`tabpanel-${id}`}
        aria-selected={selected ? "true" : "false"}
        id={`tab-${id}`}
        tabIndex={selected ? undefined : -1}
        onClick={selected ? undefined : onClick}
        onKeyDown={onKeyDown}
      >
        {children}
      </button>
    );
  }
);

export type TabPanelProps = {
  hidden: boolean;
  className?: string;
  children: JSX.Element | (JSX.Element | null)[];
  id: number | string;
  "data-map-container"?: number;
};

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  (
    { children, className, id, hidden, "data-map-container": dataMapContainer },
    ref
  ) => {
    return (
      <div
        hidden={hidden}
        role="tabpanel"
        data-orientation="horizontal"
        data-state="active"
        id={`tabpanel-${id}`}
        aria-labelledby={`tab-${id}`}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        ref={hidden ? undefined : ref}
        className={classnames("h-full", className)}
        data-map-container={dataMapContainer}
      >
        {children}
      </div>
    );
  }
);
