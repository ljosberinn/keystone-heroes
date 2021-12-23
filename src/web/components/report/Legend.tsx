import { Fragment } from "react";

import {
  NW,
  SD_LANTERN_BUFF,
  SOA_SPEAR,
  spells,
  HOA_GARGOYLE,
  TOP_BANNER_AURA,
  DOS_URN,
  dungeons,
  tormentedLieutenants,
} from "../../staticData";
import { useLegend } from "../../store";
import { STATIC_ICON_PREFIX } from "../AbilityIcon";
import { Dialog } from "../Dialog";
import {
  bloodlustTypes,
  SHROUD_OF_CONCEALMENT,
  invisibilityTypes,
} from "./utils";

type Item = {
  icons: string[];
  label: string;
};

const generalIcons: Item[] = [
  {
    icons: [
      spells[SHROUD_OF_CONCEALMENT].icon,
      ...[...invisibilityTypes]
        .filter((id) => id in spells)
        .map((id) => spells[id].icon),
    ],
    label:
      "At least one member of the group used means to go invisible before/after this pull.",
  },
  {
    icons: [...bloodlustTypes]
      .filter((id) => id in spells)
      .map((id) => spells[id].icon),
    label:
      "Bloodlust/Heroism/Timewarp/Drums of Deathly Ferocity were used on this pull.",
  },
];

const dungeonSpecificIcons: Record<number, Item[]> = {
  2284: [
    {
      icons: [spells[SD_LANTERN_BUFF].icon],
      label: "A lantern was used on this pull.",
    },
  ],
  2285: [
    {
      icons: [spells[SOA_SPEAR].icon],
      label: "Spear of Destiny was used on this pull.",
    },
  ],
  2286: [
    {
      icons: [spells[NW.HAMMER].icon],
      label: "Forgotten Forge",
    },
    {
      label: `${spells[NW.SPEAR].name} was used on this pull.`,
      icons: [spells[NW.SPEAR].icon],
    },
    {
      label: `${spells[NW.KYRIAN_ORB_BUFF].name} was used on this pull.`,
      icons: [spells[NW.KYRIAN_ORB_BUFF].icon],
    },
    {
      label: `${spells[NW.ORB].name} was used on this pull.`,
      icons: [spells[NW.ORB].icon],
    },
  ],
  2287: [
    {
      label: `${spells[HOA_GARGOYLE].name} was charmed during this pull.`,
      icons: [spells[HOA_GARGOYLE].icon],
    },
  ],
  2291: [
    {
      label: `${spells[DOS_URN].name} was used on this pull.`,
      icons: [spells[DOS_URN].icon],
    },
  ],
  2293: [
    {
      label: `${spells[TOP_BANNER_AURA].name} was activated.`,
      icons: [spells[TOP_BANNER_AURA].icon],
    },
  ],
};

const seasonSpecific: Record<string, Item[]> = {
  // "Shadowlands Season 1 - Prideful": [],
  "Shadowlands Season 2 - Tormented": Object.values(tormentedLieutenants).map(
    (lieutenant) => {
      return {
        icons: [lieutenant.icon],
        label: `${lieutenant.name} was killed during this pull.`,
      };
    }
  ),
  // "Shadowlands Season 3 - Encrypted": [],
};

// eslint-disable-next-line import/no-default-export
export default function Legend(): JSX.Element {
  const toggle = useLegend((state) => state.toggle);

  return (
    <Dialog
      defaultOpen
      as="section"
      aria-labelledby="legend-heading"
      onClose={toggle}
    >
      <h1 id="legend-heading" className="text-xl font-bold">
        Legend
      </h1>

      <h2 className="pt-4 pb-2 text-lg font-bold">General</h2>

      <div className="space-y-2">
        <ul>
          <li className="pb-2">
            <div className="flex flex-col space-y-2 md:space-y-0 md:space-x-2 md:flex-row">
              <div className="flex space-x-1 md:w-1/5">
                <img
                  src="/static/skull.png"
                  loading="lazy"
                  alt=""
                  width="16"
                  height="16"
                  className="w-6 h-6"
                />
              </div>
              <div className="md:w-4/5">
                <span>
                  This pull includes at least 5 deaths of 5 individual players
                  and is considered a wipe.
                </span>
              </div>
            </div>
          </li>
          {generalIcons.map((item) => {
            return (
              <ListItem
                icons={item.icons}
                label={item.label}
                key={item.label}
              />
            );
          })}
        </ul>
      </div>

      <details>
        <summary className="cursor-pointer">
          <h2 className="inline pt-4 pb-2 text-lg font-bold">
            Dungeon Specific
          </h2>
        </summary>

        <div className="space-y-2">
          <ul>
            {Object.entries(dungeonSpecificIcons).flatMap(([id, items]) => {
              const dungeon = dungeons[Number.parseInt(id)].name;

              return (
                <Fragment key={id}>
                  <li className="py-2 italic font-bold">{dungeon}</li>
                  {/* eslint-disable-next-line sonarjs/no-identical-functions */}
                  {items.map((item) => {
                    return (
                      <ListItem
                        icons={item.icons}
                        label={item.label}
                        key={item.label}
                      />
                    );
                  })}
                </Fragment>
              );
            })}
          </ul>
        </div>
      </details>

      <details className="pt-4">
        <summary className="cursor-pointer">
          <h2 className="inline pt-4 pb-2 text-lg font-bold">Seasonal</h2>
        </summary>

        <div className="space-y-2">
          <ul>
            {Object.entries(seasonSpecific)
              .reverse()
              .flatMap(([title, items]) => {
                return (
                  <Fragment key={title}>
                    <li className="py-2 italic font-bold">{title}</li>
                    {/* eslint-disable-next-line sonarjs/no-identical-functions */}
                    {items.map((item) => {
                      return (
                        <ListItem
                          icons={item.icons}
                          label={item.label}
                          key={item.label}
                        />
                      );
                    })}
                  </Fragment>
                );
              })}
          </ul>
        </div>
      </details>
    </Dialog>
  );
}

function ListItem({ icons, label }: Item) {
  return (
    <li className="pb-2">
      <div className="flex flex-col space-y-2 md:space-y-0 md:space-x-2 md:flex-row">
        <div className="flex space-x-1 md:w-1/5">
          {icons.map((icon) => {
            return (
              <img
                key={icon}
                src={`${STATIC_ICON_PREFIX}${icon}.jpg`}
                loading="lazy"
                width="24"
                height="24"
                className="w-6 h-6"
                alt=""
              />
            );
          })}
        </div>
        <div className="md:w-4/5">
          <span>{label}</span>
        </div>
      </div>
    </li>
  );
}
