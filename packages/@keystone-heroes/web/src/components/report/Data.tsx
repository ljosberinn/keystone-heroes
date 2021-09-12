import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Pulls } from "./Pulls";

const tabs = [
  {
    title: "Pulls & Events",
    disabled: false,
    component: Pulls,
    id: "pulls-events",
  },
  {
    title: "Player Details (Upcoming)",
    disabled: true,
    component: () => null,
    id: "player-details",
  },
  {
    title: "Execution (Upcoming)",
    disabled: true,
    component: () => null,
    id: "execution",
  },
];

export function Data(): JSX.Element {
  const [selectedTab, setSelectedTab] = useState(() => {
    return 0;
  });

  const shouldFocusRef = useRef(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (shouldFocusRef.current) {
      shouldFocusRef.current = false;
      buttonRefs.current[selectedTab]?.focus();
    }
  });

  const onTabButtonClick = (nextIndex: number) => {
    setSelectedTab(nextIndex);
  };

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
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

    // setSelectedTab((currentIndex) => {

    //   const nextIndex = currentIndex + lookupValue;

    //   // going from first to last
    //   if (nextIndex < 0) {
    //     return 2;
    //   }

    //   // going from nth to nth
    //   if (nextIndex <= 2) {
    //     return nextIndex;
    //   }

    //   // going from last to first
    //   return 0;
    // });
  }, []);

  return (
    <section className="pt-4 lg:pt-8">
      <div
        role="tablist"
        aria-label="Category Selection"
        aria-orientation="horizontal"
        className="flex flex-col w-full py-4 space-y-4 sm:space-x-4 sm:space-y-0 sm:flex-row sm:py-0 sm:w-initial"
      >
        {tabs.map((tab, index) => {
          const selected = selectedTab === index;

          return (
            <div className="sm:py-4" key={tab.id}>
              <button
                disabled={tab.disabled}
                type="button"
                role="tab"
                aria-controls={`tabpanel-${tab.id}`}
                aria-selected={selected ? "true" : "false"}
                id={`tab-${tab.id}`}
                onKeyDown={onKeyDown}
                ref={(ref) => {
                  buttonRefs.current[index] = ref;
                }}
                className={`focus:outline-none focus:ring disabled:cursor-not-allowed dark:disabled:text-coolgray-400 disabled:text-coolgray-700 rounded-md px-2 p-2 sm:py-0 px-2 sm:w-initial w-full ${
                  selected
                    ? "dark:bg-coolgray-500 bg-coolgray-400"
                    : "dark:bg-coolgray-600 bg-coolgray-200 hover:bg-coolgray-400"
                }`}
                onClick={
                  selected
                    ? undefined
                    : () => {
                        onTabButtonClick(index);
                      }
                }
              >
                {tab.title}
              </button>
            </div>
          );
        })}
      </div>

      {tabs.map((tab, index) => {
        const Component = tab.component;

        return (
          <div
            role="tabpanel"
            data-aria-orientation="horizontal"
            data-state="active"
            id={`tabpanel-${tab.id}`}
            key={tab.id}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            aria-labelledby={`tab-${tab.id}`}
          >
            {selectedTab === index ? <Component /> : null}
          </div>
        );
      })}
    </section>
  );
}
