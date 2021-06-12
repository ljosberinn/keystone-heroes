import type {
  EventDataType,
  HostilityType,
  Sdk,
} from "@keystone-heroes/wcl/types";

import { getCachedSdk } from "../../client";
import type { AnyEvent, DamageEvent, HealEvent } from "./types";

export type GetEventBaseParams<
  T extends Record<string, unknown> = Record<string, unknown>
> = Pick<
  Parameters<Sdk["EventData"]>[0],
  "reportID" | "startTime" | "endTime"
> &
  T;

export type GetSourceIDParams = Pick<GetEventBaseParams, "reportID"> & {
  fightID: number;
};

export const getEvents = async <T extends AnyEvent>(
  params: GetEventBaseParams<{
    abilityID?: number;
    dataType: EventDataType;
    hostilityType: HostilityType;
    sourceID?: number;
    targetID?: number;
  }>,
  previousEvents: T[] = []
): Promise<T[]> => {
  const sdk = await getCachedSdk();
  const response = await sdk.EventData(params);

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: T[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return getEvents<T>({ ...params, startTime: nextPageTimestamp }, allEvents);
  }

  return allEvents;
};

type EventFetcherParams = {
  abilityID?: number;
  dataType: EventDataType;
  hostilityType: HostilityType;
};

export const createEventFetcher =
  <T extends AnyEvent>(initialParams: EventFetcherParams) =>
  (params: GetEventBaseParams): Promise<T[]> =>
    getEvents<T>({
      ...params,
      ...initialParams,
    });

export const reduceEventsByPlayer = <T extends DamageEvent | HealEvent>(
  events: T[],
  key: "targetID" | "sourceID"
): T[] => {
  return events.reduce<T[]>((arr, event) => {
    const existingIndex = arr.findIndex(
      (dataset) => dataset[key] === event[key]
    );

    if (existingIndex > -1) {
      return arr.map((dataset, index) => {
        return index === existingIndex
          ? {
              ...dataset,
              amount: dataset.amount + event.amount + (event.absorbed ?? 0),
              overheal:
                event.type === "heal" && dataset.type === "heal"
                  ? (dataset?.overheal ?? 0) + (event?.overheal ?? 0)
                  : undefined,
            }
          : dataset;
      });
    }

    return [...arr, event];
  }, []);
};

export const reduceToChunkByThreshold = <Event extends AnyEvent>(
  acc: Event[][],
  event: Event,
  threshold: number
): Event[][] => {
  if (acc.length === 0) {
    return [[event]];
  }

  const lastChunksIndex = acc.length - 1;
  const lastChunks = acc[lastChunksIndex];

  const lastIndex = lastChunks.length - 1;
  const lastEvent = lastChunks[lastIndex];

  const timePassed = event.timestamp - lastEvent.timestamp;

  return timePassed > threshold
    ? [...acc, [event]]
    : acc.map((events, index) =>
        index === lastChunksIndex ? [...events, event] : events
      );
};
