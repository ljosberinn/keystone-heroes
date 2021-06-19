import { getCachedSdk } from "../../../client";
import { EventDataType, HostilityType } from "../../../types";
import { getEnemyNPCIDs } from "../../report";
import type { DeathEvent, DamageEvent } from "../types";
import type { GetEventBaseParams, GetSourceIDParams } from "../utils";
import { getEvents, reduceEventsByPlayer } from "../utils";

export const PRIDE = {
  unit: 173_729,
  aoe: 342_332,
} as const;

export const getManifestationOfPrideSourceID = async (
  params: GetSourceIDParams
): Promise<number | null> => {
  const response = await getEnemyNPCIDs(
    {
      fightIDs: [params.fightID],
      reportID: params.reportID,
    },
    [PRIDE.unit]
  );

  return response[PRIDE.unit] ?? null;
};

export const getManifestationOfPrideDeathEvents = (
  params: GetEventBaseParams<{
    fightID: number;
    sourceID: number;
  }>
): Promise<DeathEvent[]> =>
  getEvents<DeathEvent>({
    ...params,
    dataType: EventDataType.Deaths,
    hostilityType: HostilityType.Enemies,
  });

type ManifestationOfPrideDamageEventsParams<Type extends EventDataType> =
  GetEventBaseParams<{
    targetID: number;
    targetInstance?: number;
    dataType: Type;
  }>;

const getManifestationOfPrideDamageEvents = async <Type extends EventDataType>(
  params: ManifestationOfPrideDamageEventsParams<Type>,
  firstEventOnly = false,
  previousEvents: DamageEvent[] = []
): Promise<DamageEvent[]> => {
  const sdk = await getCachedSdk();
  const response = await sdk.EventData({
    ...params,
    hostilityType: HostilityType.Friendlies,
    limit: 5000,
  });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};

  if (data.length === 0) {
    return [];
  }

  if (firstEventOnly) {
    return [data[0]];
  }

  const allEvents: DamageEvent[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getManifestationOfPrideDamageEvents(
      { ...params, startTime: nextPageTimestamp },
      false,
      allEvents
    );
  }

  return allEvents;
};

type ManifestationOfPrideDamageDoneEventParams = Omit<
  ManifestationOfPrideDamageEventsParams<EventDataType.DamageDone>,
  "dataType"
>;

export const getDamageDoneToManifestationOfPrideEvents = async (
  params: ManifestationOfPrideDamageDoneEventParams,
  firstEventOnly = false
): Promise<DamageEvent[]> => {
  const events = await getManifestationOfPrideDamageEvents(
    {
      ...params,
      dataType: EventDataType.DamageDone,
    },
    firstEventOnly
  );

  if (firstEventOnly) {
    return events;
  }

  return reduceEventsByPlayer(events, "sourceID");
};

type ManifestationOfPrideDamageTakenEventParams = Omit<
  ManifestationOfPrideDamageEventsParams<EventDataType.DamageTaken>,
  "dataType"
>;

export const getDamageTakenByManifestationOfPrideEvents = async (
  params: ManifestationOfPrideDamageTakenEventParams,
  firstEventOnly = false
): Promise<DamageEvent[]> => {
  const events = await getManifestationOfPrideDamageEvents(
    {
      ...params,
      dataType: EventDataType.DamageTaken,
    },
    firstEventOnly
  );

  return reduceEventsByPlayer(events, "targetID");
};
