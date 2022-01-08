import { useFight } from "../../../pages/report/[reportID]/[fightID]";
import { classes } from "../../staticData";
import { classBorderColorMap } from "../../utils";
import { SpecIcon } from "../SpecIcon";
import { TabButton, TabList, TabPanel, useTabs } from "../Tabs";

// eslint-disable-next-line import/no-default-export
export default function CooldownManagement(): JSX.Element {
  const { player } = useFight().fight;
  const { attachRef, onKeyDown, onTabClick, selectedTab } = useTabs(player);

  return (
    <>
      <TabList>
        {player.map((p, index) => {
          function onClick() {
            onTabClick(index);
          }

          const { name, specs } = classes[p.class];

          const spec = specs.find((spec) => spec.id === p.spec);

          if (!spec) {
            return null;
          }

          const classColor = classBorderColorMap[name.toLowerCase()];

          return (
            <TabButton
              id={p.id}
              index={index}
              listLength={player.length}
              key={p.id}
              ref={(ref) => {
                attachRef(index, ref);
              }}
              onClick={onClick}
              onKeyDown={onKeyDown}
              selectedIndex={selectedTab}
            >
              <span className="flex items-center space-x-2">
                <span className="w-8 h-8">
                  <SpecIcon
                    class={name}
                    spec={spec.name}
                    className={`border-2 ${classColor}`}
                  />
                </span>
                <span>{p.name}</span>
              </span>
            </TabButton>
          );
        })}
      </TabList>

      {player.map((p, index) => {
        const hidden = index !== selectedTab;

        return (
          <TabPanel id={p.id} key={p.id} hidden={hidden}>
            {p.name}
          </TabPanel>
        );
      })}
    </>
  );
}
