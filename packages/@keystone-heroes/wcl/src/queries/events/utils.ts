import type {
  EventDataType,
  HostilityType,
  Sdk,
} from "@keystone-heroes/wcl/types";

import { getCachedSdk } from "../../client";
import type { AnyEvent, DamageEvent, HealEvent, AbsorbEvent } from "./types";

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

export const recursiveGetEvents = async <T extends AnyEvent>(
  params: GetEventBaseParams<{
    abilityID?: number;
    dataType?: EventDataType;
    hostilityType?: HostilityType;
    sourceID?: number;
    targetID?: number;
    filterExpression?: string;
  }>,
  previousEvents: T[] = []
): Promise<T[]> => {
  const sdk = await getCachedSdk();
  const response = await sdk.EventData({ ...params, limit: 10_000 });

  const { data = [], nextPageTimestamp = null } =
    response?.reportData?.report?.events ?? {};
  const allEvents: T[] = [...previousEvents, ...data];

  if (nextPageTimestamp) {
    return recursiveGetEvents<T>(
      { ...params, startTime: nextPageTimestamp },
      allEvents
    );
  }

  return allEvents;
};

export const reduceEventsByPlayer = <
  T extends DamageEvent | HealEvent | AbsorbEvent
>(
  events: T[],
  key: "targetID" | "sourceID"
): T[] => {
  return events.reduce<T[]>((arr, event) => {
    const existingIndex = arr.findIndex(
      (dataset) => dataset[key] === event[key]
    );

    if (existingIndex > -1) {
      return arr.map((dataset, index) => {
        if (index === existingIndex) {
          switch (event.type) {
            case "absorbed":
              return {
                ...dataset,
                amount: dataset.amount + event.amount,
              };
            case "heal":
              // type guard for overheal; when reducing HealEvents,
              // dataset must also be of type heal, TS doesn't know this however
              if (dataset.type === "heal") {
                return {
                  ...dataset,
                  amount: dataset.amount + event.amount + (event.absorbed ?? 0),
                  overheal: (dataset?.overheal ?? 0) + (event?.overheal ?? 0),
                };
              }

              return dataset;
            case "damage":
              return {
                ...dataset,
                amount: dataset.amount + event.amount + (event.absorbed ?? 0),
              };
            default:
              return dataset;
          }
        }

        return dataset;
      });
    }

    return [...arr, event];
  }, []);
};

export const createChunkByThresholdReducer =
  (threshold: number) =>
  <Event extends AnyEvent>(acc: Event[][], event: Event): Event[][] => {
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

type CreateIsSpecificEventParameters<Type extends AnyEvent["type"]> = {
  abilityGameID: number | number[];
  type: Type;
};

export const createIsSpecificEvent =
  <
    Expected extends AnyEvent,
    Type extends Expected["type"] = Expected["type"]
  >({
    type,
    abilityGameID,
  }: CreateIsSpecificEventParameters<Type>) =>
  (event: AnyEvent): event is Expected => {
    return (
      event.type === type &&
      "abilityGameID" in event &&
      (Array.isArray(abilityGameID)
        ? abilityGameID.includes(event.abilityGameID)
        : event.abilityGameID === abilityGameID)
    );
  };
