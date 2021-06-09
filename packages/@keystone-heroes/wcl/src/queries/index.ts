import { getCachedSdk } from "../client";
import type {
  FightPullsQuery,
  FightPullsQueryVariables,
  InitialReportDataQuery,
  InitialReportDataQueryVariables,
  TableQuery,
  TableQueryVariables,
} from "../types";
import type { Table } from "./table";

export * from "./events";

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
} from "./table";
export { ItemQuality } from "./table";

export const getInitialReportData = async (
  params: InitialReportDataQueryVariables
): Promise<InitialReportDataQuery> => {
  const sdk = await getCachedSdk();

  return sdk.InitialReportData(params);
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
          DeepNullablePath<TableQuery, ["reportData", "report"]>,
          "table"
        > & { table?: { data: Table } })
      | null;
  } | null;
};

export const getTableData = async (
  params: TableQueryVariables
): Promise<TypedTableQuery> => {
  const sdk = await getCachedSdk();

  return sdk.Table(params);
};

export const getFightPulls = async (
  params: FightPullsQueryVariables
): Promise<FightPullsQuery> => {
  const sdk = await getCachedSdk();

  return sdk.FightPulls(params);
};
