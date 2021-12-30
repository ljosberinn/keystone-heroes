import { getCachedSdk } from "../client";
import type {
  GetReportQuery,
  GetReportQueryVariables,
  GetTableQuery,
  GetTableQueryVariables,
  GetPullsOfFightQuery,
  GetPullsOfFightQueryVariables,
} from "../types";
import type { Table } from "./types";

export type {
  Conduit,
  DamageDone,
  DamageTaken,
  HealingDone,
  InDepthCharacterInformation,
  Item,
  LegendaryItem,
  PlayerDetails,
  CovenantTrait,
  Table,
  Talent,
} from "./types";
export { ItemQuality } from "./types";

export const getInitialReportData = async (
  params: GetReportQueryVariables
): Promise<GetReportQuery> => {
  const sdk = await getCachedSdk();

  return sdk.getReport(params);
};

// TODO: duplicate
type DeepNullablePath<T, P> = P extends []
  ? T
  : P extends [infer A, ...infer B]
  ? DeepNullablePath<NonNullable<T>[A & keyof NonNullable<T>] | undefined, B>
  : never;

type TypedTableQuery = {
  reportData?: {
    report?:
      | (Omit<
          DeepNullablePath<GetTableQuery, ["reportData", "report"]>,
          "table"
        > & { table?: { data: Table } })
      | null;
  } | null;
};

export const getTableData = async (
  params: GetTableQueryVariables
): Promise<TypedTableQuery> => {
  const sdk = await getCachedSdk();

  return sdk.getTable(params);
};

export const getFightPulls = async (
  params: GetPullsOfFightQueryVariables
): Promise<GetPullsOfFightQuery> => {
  const sdk = await getCachedSdk();

  return sdk.getPullsOfFight(params);
};
