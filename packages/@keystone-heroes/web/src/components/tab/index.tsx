import type {
  RefObject,
  ReactNode,
  KeyboardEventHandler,
  KeyboardEvent,
  MutableRefObject,
} from "react";
import {
  forwardRef,
  createContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from "react";
import { classnames } from "src/utils/classnames";

type TabListContextType = {
  onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
  selectedIndex: number;
  buttonRefs: MutableRefObject<(HTMLButtonElement | null)[]>;
  onClick: (nextIndex: number) => void;
  amountOfTabs: number;
};

const TabListContext = createContext<TabListContextType | null>(null);

function useTabListContext() {
  const ctx = useContext(TabListContext);

  if (!ctx) {
    throw new Error("useTabListContext must be used within a TabListContext");
  }

  return ctx;
}

type TabListProviderProps = {
  children: ReactNode[];
  amountOfTabs: number;
};

export function TabListProvider({
  children,
  amountOfTabs,
}: TabListProviderProps): JSX.Element {
  const [index, setIndex] = useState(0);

  const shouldFocusRef = useRef(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (shouldFocusRef.current) {
      shouldFocusRef.current = false;
      buttonRefs.current[index]?.focus();
    }
  });

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      const { key } = event;

      const lookupValue =
        key === "ArrowRight" ? 1 : key === "ArrowLeft" ? -1 : null;

      if (!lookupValue) {
        return;
      }

      event.preventDefault();
      shouldFocusRef.current = true;

      setIndex((currentIndex) => {
        const nextIndex = currentIndex + lookupValue;

        // going from first to last
        if (nextIndex < 0) {
          return amountOfTabs - 1;
        }

        // going from nth to nth
        if (amountOfTabs - 1 >= nextIndex) {
          return nextIndex;
        }

        // going from last to first
        return 0;
      });
    },
    [amountOfTabs]
  );

  const onClick = useCallback((nextIndex) => {
    setIndex(nextIndex);
  }, []);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    onKeyDown,
    selectedIndex: index,
    buttonRefs,
    onClick,
    amountOfTabs,
  };

  return (
    <TabListContext.Provider value={value}>{children}</TabListContext.Provider>
  );
}

type TabListProps = {
  className?: string;
  children: JSX.Element | JSX.Element[];
};

function TabList({ className, children }: TabListProps): JSX.Element {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={classnames("flex", className)}
    >
      {children}
    </div>
  );
}

TabListProvider.TabList = TabList;

type TabButtonProps = {
  children: ReactNode;
  id: string | number;
  index: number;
};

function TabButton({ children, id, index }: TabButtonProps) {
  const { onKeyDown, selectedIndex, buttonRefs, onClick, amountOfTabs } =
    useTabListContext();

  const selected = index === selectedIndex;

  return (
    <div className="p-4">
      {amountOfTabs > 1 && (
        <button
          type="button"
          className={`focus:outline-none focus:ring disabled:cursor-not-allowed dark:disabled:text-coolgray-500 disabled:text-coolgray-700 ${
            selected ? "border-coolgray-500 font-bold" : ""
          }`}
          role="tab"
          tabIndex={selected ? 0 : -1}
          data-orientation="horizontal"
          data-state={selected ? "active" : "inactive"}
          aria-selected={selected}
          aria-controls={`tabpanel-${id}`}
          id={`tab-${id}`}
          onKeyDown={onKeyDown}
          ref={(ref) => {
            buttonRefs.current[index] = ref;
          }}
          onClick={() => {
            onClick(index);
          }}
        >
          {children}
        </button>
      )}
    </div>
  );
}

TabListProvider.TabButton = TabButton;

type TabPanelProps = {
  ref?: RefObject<HTMLDivElement>;
  children: JSX.Element | JSX.Element[];
  id: number | string;
  index: number;
};

const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ children, index, id }, ref) => {
    const { selectedIndex } = useTabListContext();

    const hidden = index !== selectedIndex;

    return (
      <div
        role="tabpanel"
        data-orientation="horizontal"
        data-state="active"
        id={`tabpanel-${id}`}
        aria-labelledby={`tab-${id}`}
        hidden={hidden}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        ref={hidden ? undefined : ref}
      >
        {hidden ? null : children}
      </div>
    );
  }
);

TabPanel.displayName = "TabPanel";

TabListProvider.TabPanel = TabPanel;
