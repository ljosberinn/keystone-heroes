import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MouseEvent, KeyboardEvent as ReactKeyboardEvent } from "react";

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
  children: string | JSX.Element;
  className?: string;
  id: string | number;
  onKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>) => void;
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
  lazy?: boolean;
};

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  (
    {
      children,
      className,
      id,
      hidden,
      "data-map-container": dataMapContainer,
      lazy,
    },
    ref
  ) => {
    if (hidden && lazy) {
      return null;
    }

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

type UseTabsReturn = {
  /**
   * index of the currently selected tab
   */
  selectedTab: number;
  /**
   * keyboard handler for arrow buttons for <TabButton />
   */
  onKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>) => void;
  /**
   * click handler for <TabButton />
   */
  onTabClick: (next: number) => void;
  /**
   * ref maintainer for focus handling
   */
  attachRef: (index: number, ref: HTMLButtonElement | null) => void;
};

export function useTabs(
  tabs: unknown[],
  initialTab: number | (() => number) = 0
): UseTabsReturn {
  const [selectedTab, setSelectedTab] = useState(
    typeof initialTab === "number" ? initialTab : initialTab()
  );

  const shouldFocusRef = useRef(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (shouldFocusRef.current) {
      shouldFocusRef.current = false;
      buttonRefs.current[selectedTab]?.focus();
    }
  });

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      const { key } = event;

      const isSMOrLarger = window.innerWidth >= 640;
      const nextKey = isSMOrLarger ? "ArrowRight" : "ArrowDown";
      const lastKey = isSMOrLarger ? "ArrowLeft" : "ArrowUp";

      const lookupValue = key === nextKey ? 1 : key === lastKey ? -1 : null;

      if (!lookupValue) {
        return;
      }

      event.preventDefault();
      shouldFocusRef.current = true;

      setSelectedTab((currentIndex) => {
        const nextIndex = currentIndex + lookupValue;

        // going from first to last
        if (nextIndex < 0) {
          return tabs.length - 1;
        }

        // going from nth to nth
        if (tabs.length - 1 >= nextIndex) {
          return nextIndex;
        }

        // going from last to first
        return 0;
      });
    },
    [tabs]
  );

  const onTabClick = useCallback((next: number) => {
    setSelectedTab(next);
  }, []);

  const attachRef = useCallback(
    (index: number, ref: HTMLButtonElement | null) => {
      buttonRefs.current[index] = ref;
    },
    []
  );

  return useMemo(() => {
    return {
      onTabClick,
      onKeyDown,
      attachRef,
      selectedTab,
    };
  }, [selectedTab, onTabClick, onKeyDown, attachRef]);
}
