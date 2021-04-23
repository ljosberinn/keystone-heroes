import type { WCLFight } from "./report";

type KeystoneFight = Required<
  Pick<
    WCLFight,
    | "id"
    | "start_time"
    | "end_time"
    | "dungeonPulls"
    | "affixes"
    | "keystoneLevel"
    | "boss"
  >
>;

export type CompletedKeystoneFight = KeystoneFight & {
  kill: true;
  completionTime: number;
};
export type FailedKeystoneFight = KeystoneFight & {
  kill: false;
  completionTime: never;
};
