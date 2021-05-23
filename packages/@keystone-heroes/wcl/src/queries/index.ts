import { loadRecursiveEventsFromSource } from "./events";
import { loadFightsFromSource, loadReportFromSource } from "./report";
import { loadTableFromSource } from "./table";

export type {
  Conduit,
  DamageDone,
  DamageTaken,
  HealingDone,
  InDepthCharacterInformation,
  Item,
  LegendaryItem,
  PlayerDetails,
  SoulbindTalent,
  Table,
  Talent,
} from "./table";
export { ItemQuality } from "./table";

export type { DungeonPull, InitialReportData } from "./report";

export const wcl = {
  report: loadReportFromSource,
  fights: loadFightsFromSource,
  table: loadTableFromSource,
  events: loadRecursiveEventsFromSource,
};
