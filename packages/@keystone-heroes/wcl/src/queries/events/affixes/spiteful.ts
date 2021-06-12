import { SPITEFUL } from "@keystone-heroes/db/data";
import { EventDataType, HostilityType } from "@keystone-heroes/wcl/types";

import { loadEnemyNPCIDs } from "../../report";
import type { DamageEvent } from "../types";
import type { GetEventBaseParams, GetSourceIDParams } from "../utils";
import { getEvents } from "../utils";

export const getSpitefulDamageTakenEvents = async (
  params: GetEventBaseParams<{ fightID: number }>,
  spitefulID = -1
): Promise<DamageEvent[]> => {
  const sourceID =
    spitefulID === -1
      ? await getSpitefulSourceID({
          fightID: params.fightID,
          reportID: params.reportID,
        })
      : spitefulID;

  if (!sourceID) {
    return [];
  }

  return getEvents<DamageEvent>({
    ...params,
    dataType: EventDataType.DamageTaken,
    hostilityType: HostilityType.Friendlies,
    targetID: sourceID,
  });
};

const getSpitefulSourceID = async (params: GetSourceIDParams) => {
  const response = await loadEnemyNPCIDs(
    {
      fightIDs: [params.fightID],
      reportID: params.reportID,
    },
    [SPITEFUL]
  );

  return response[SPITEFUL] ?? null;
};
