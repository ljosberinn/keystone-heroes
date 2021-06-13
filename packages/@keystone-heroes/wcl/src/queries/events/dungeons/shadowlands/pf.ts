import { EventDataType, HostilityType } from "../../../../types";
import { getEnemyNPCIDs } from "../../../report";
import type { DeathEvent, ApplyBuffEvent, RemoveBuffEvent } from "../../types";
import type { GetEventBaseParams } from "../../utils";
import { getEvents } from "../../utils";

export const PF_RED_BUFF = {
  unit: 164_705,
  aura: 340_225,
  buff: 340_227,
} as const;

export const PF_PURPLE_BUFF = {
  unit: 164_707,
  aura: 340_271,
  buff: 340_273,
} as const;

export const PF_GREEN_BUFF = {
  unit: 163_891,
  aura: 340_210,
  buff: 340_211,
} as const;

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
  } = await getEnemyNPCIDs(
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
