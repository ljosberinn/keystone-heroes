import { existsSync, readFileSync, writeFileSync } from "fs";
import { gql } from "graphql-request";
import { resolve } from "path";

import { IS_PROD } from "../../constants";
import type { PlayableClass } from "../../types/classes";
import { getGqlClient } from "../gqlClient";
import type { Fight } from "./report";

const getFightTable = (reportId: string, { id, startTime, endTime }: Fight) => {
  return getGqlClient().then((client) =>
    client.request<RawTable>(
      gql`
        query ReportData(
          $reportId: String!
          $id: [Int]
          $startTime: Float
          $endTime: Float
        ) {
          reportData {
            report(code: $reportId) {
              table(startTime: $startTime, endTime: $endTime, fightIDs: $id)
            }
          }
        }
      `,
      { reportId, id: [id], startTime, endTime }
    )
  );
};

export const retrieveFightTableCacheOrSource = async (
  reportId: string,
  fights: Fight[]
): Promise<Record<string, Table>> => {
  const tables = await Promise.all<[number, Table] | null>(
    fights.map(async (fight) => {
      const resolvedCachePath = resolve(
        `cache/${reportId}-fight-${fight.id}.json`
      );

      if (!IS_PROD && existsSync(resolvedCachePath)) {
        // eslint-disable-next-line no-console
        console.info(
          `[reportId/getStaticProps] reading fight "${fight.id}" of report "${reportId}" from cache`
        );

        const raw = readFileSync(resolvedCachePath, {
          encoding: "utf-8",
        });

        return [fight.id, JSON.parse(raw).reportData.report.table.data];
      }

      try {
        // eslint-disable-next-line no-console
        console.info(
          `[reportId/getStaticProps] fetching fight "${fight.id}" of report "${reportId}" from WCL`
        );

        const json = await getFightTable(reportId, fight);

        if (!IS_PROD) {
          writeFileSync(resolvedCachePath, JSON.stringify(json));
        }

        return [fight.id, json.reportData.report.table.data];
      } catch {
        return null;
      }
    })
  );

  return Object.fromEntries(
    tables.filter((table): table is [number, Table] => table !== null)
  );
};

type RawTable = {
  reportData: {
    report: {
      table: {
        data: {
          totalTime: number;
          itemLevel: number;
          logVersion: number;
          gameVersion: number;
          composition: Composition[];
          damageDone: DamageDone[];
          healingDone: HealinggDone[];
          damageTaken: DamageTaken[];
          deathEvents: DeathEvent[];
          playerDetails: PlayerDetails[];
        };
      };
    };
  };
};

export type Table = RawTable["reportData"]["report"]["table"]["data"];

type Composition = {
  name: string;
  id: number;
  guid: number;
  type: PlayableClass;
  specs: Spec[];
};

type Spec = {
  spec: string;
  role: "dps" | "healer" | "tank";
};

export type DamageDone = Pick<Composition, "name" | "id" | "guid"> & {
  total: number;
  icon: string;
  type: Composition["type"] | "Pet" | "NPC";
};

type HealinggDone = DamageDone;

type DamageTaken = Pick<DamageDone, "name" | "guid" | "total"> & {
  abilityIcon: string;
  type: number;
};

type DeathEvent = Pick<DamageDone, "name" | "id" | "guid" | "type" | "icon"> & {
  deathTime: number;
  ability: Omit<DamageTaken, "total">;
};

type PlayerDetails = {
  tanks: InDepthCharacterInformation[];
  dps: InDepthCharacterInformation[];
  healers: InDepthCharacterInformation[];
};

type InDepthCharacterInformation = {
  name: string;
  id: number;
  guid: number;
  type: PlayableClass;
  server: string;
  icon: string;
  specs: string[];
  minItemLevel: number;
  maxItemLevel: number;
  compatantInfo: CombatantInfo;
};

type CombatantInfo = {
  stats: Stats;
  talents: Talent[];
  artifact: Artifact[];
  gear: Gear[];
  heartOfAzeroth: HeartOfAzeroth[];
  specIDs: number[];
  factionID: number;
  covenantID: number;
  soulbindID: number;
};

type Stats = {
  Speed: Stat;
  Dodge: Stat;
  // eslint-disable-next-line inclusive-language/use-inclusive-words
  Mastery: Stat;
  Stamina: Stat;
  Haste: Stat;
  Leech: Stat;
  Armor: Stat;
  Agility: Stat;
  Crit: Stat;
  "Item Level": Stat;
  Parry: Stat;
  Avoidance: Stat;
  Versatility: Stat;
  Intellect: Stat;
};

type Stat = {
  min: number;
  max: number;
};

type Talent = {
  name: string;
  guid: number;
  type: number;
  abilityIcon: string;
};

type Artifact = {
  name: string;
  guid: number;
  type: number;
  abilityIcon: string;
  total: number;
};

type Gear = {
  id: number;
  slot: number;
  quality: number;
  icon: string;
  name?: string;
  itemLevel: number;
  bonusIDs?: number[];
  gems?: Gem[];
  permanentEnchant?: number;
  permanentEnchantName?: string;
  onUseEnchant?: number;
  onUseEnchantName?: string;
  effectID?: number;
  effectIcon?: string;
  effectName?: string;
  temporaryEnchant?: number;
  temporaryEnchantName?: string;
};

type Gem = {
  id: number;
  itemLevel: number;
  icon: string;
};

type HeartOfAzeroth = {
  name: string;
  guid: number;
  type: number;
  abilityIcon: string;
  total: number;
};
