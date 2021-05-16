import { loadTableFromSource } from "./table";
import { loadFightsFromSource, loadReportFromSource } from "./report";

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

export type { DungeonPull, RawFight, RawReport, ValidRawFight } from "./report";

export const wcl = {
  report: loadReportFromSource,
  fights: loadFightsFromSource,
  table: loadTableFromSource,
};
