import {
  PF_RED_BUFF,
  PF_GREEN_BUFF,
  PF_PURPLE_BUFF,
} from "@keystone-heroes/db/data";
import { EventDataType, HostilityType } from "@keystone-heroes/wcl/types";

import { loadEnemyNPCIDs } from "../../../report";
import type { DeathEvent, ApplyBuffEvent, RemoveBuffEvent } from "../../types";
import type { GetEventBaseParams } from "../../utils";
import { getEvents } from "../../utils";

type PFSlimeKillsParams = GetEventBaseParams & {
  fightID: number;
};

export const getPFSlimeKills = async (
  params: PFSlimeKillsParams
): Promise<(DeathEvent | ApplyBuffEvent)[]> => {
  const {
    [PF_RED_BUFF.unit]: red,
    [PF_GREEN_BUFF.unit]: green,
    [PF_PURPLE_BUFF.unit]: purple,
  } = await loadEnemyNPCIDs(
    {
      fightIDs: [params.fightID],
      reportID: params.reportID,
    },
    [PF_RED_BUFF.unit, PF_GREEN_BUFF.unit, PF_PURPLE_BUFF.unit]
  );

  const [redDeathEvents, greenDeathEvents, purpleDeathEvents] =
    await Promise.all<DeathEvent[]>(
      [red, green, purple].map(async (sourceID) => {
        if (!sourceID) {
          return [];
        }

        return getEvents<DeathEvent>({
          ...params,
          dataType: EventDataType.Deaths,
          hostilityType: HostilityType.Enemies,
          sourceID,
        });
      })
    );

  const earliestUnitDeathTimestamp = [
    ...redDeathEvents,
    ...greenDeathEvents,
    ...purpleDeathEvents,
  ].reduce(
    (acc, event) => (acc <= event.timestamp ? acc : event.timestamp),
    Infinity
  );

  const [redAuraApplication, greenAuraApplication, purpleAuraApplication] =
    await Promise.all(
      [PF_RED_BUFF.aura, PF_GREEN_BUFF.aura, PF_PURPLE_BUFF.aura].map(
        async (abilityID) => {
          if (earliestUnitDeathTimestamp === Infinity) {
            return [];
          }

          const events = await getEvents<ApplyBuffEvent | RemoveBuffEvent>({
            ...params,
            startTime: earliestUnitDeathTimestamp,
            dataType: EventDataType.Buffs,
            hostilityType: HostilityType.Friendlies,
            abilityID,
          });

          return events.filter(
            (event): event is ApplyBuffEvent => event.type === "applybuff"
          );
        }
      )
    );

  return [
    ...redDeathEvents,
    ...greenDeathEvents,
    ...purpleDeathEvents,
    ...redAuraApplication,
    ...greenAuraApplication,
    ...purpleAuraApplication,
  ];

  // return {
  //   red: {
  //     kills: redDeathEvents.length,
  //     consumed: redAuraApplication.length,
  //   },
  //   green: {
  //     kills: greenDeathEvents.length,
  //     consumed: greenAuraApplication.length,
  //   },
  //   purple: {
  //     kills: purpleDeathEvents.length,
  //     consumed: purpleAuraApplication.length,
  //   },
  // };
};
