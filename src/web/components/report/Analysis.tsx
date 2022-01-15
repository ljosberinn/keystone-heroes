import dynamic from "next/dynamic";
import { Suspense } from "react";

import { widthConstraint } from "../../styles/tokens";
import { TabList, TabPanel, TabButton, useTabs } from "../Tabs";

const Events = dynamic(
  () => import(/* webpackChunkName: "Events" */ "./Events"),
  {
    suspense: true,
  }
);

const CDManagement = dynamic(
  () =>
    import(/* webpackChunkName: "CooldownManagement" */ "./CooldownManagement"),
  {
    suspense: true,
  }
);

const tabs = [
  { id: "events", title: "Events", component: Events },
  {
    id: "cd-management",
    title: "Cooldown Management",
    component: CDManagement,
  },
];

export function Analysis(): JSX.Element {
  const { onKeyDown, onTabClick, attachRef, selectedTab } = useTabs(tabs);

  return (
    <section className={`${widthConstraint} pb-6`}>
      <div className="drop-shadow-lg">
        <TabList aria-label="Analysis Panels">
          {tabs.map((tab, index) => {
            function onClick() {
              onTabClick(index);
            }

            return (
              <TabButton
                id={tab.id}
                index={index}
                listLength={tabs.length}
                selectedIndex={selectedTab}
                key={tab.id}
                onClick={onClick}
                onKeyDown={onKeyDown}
                ref={(ref) => {
                  attachRef(index, ref);
                }}
              >
                {tab.title}
              </TabButton>
            );
          })}
        </TabList>

        {tabs.map((tab, index) => {
          const hidden = index !== selectedTab;
          const Component = tab.component;

          return (
            <TabPanel id={tab.id} key={tab.id} hidden={hidden} lazy={index > 0}>
              <Suspense fallback={null}>
                <Component />
              </Suspense>
            </TabPanel>
          );
        })}
      </div>
    </section>
  );
}
