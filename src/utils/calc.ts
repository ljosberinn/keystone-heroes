import type {
  HealingDone,
  DamageDone,
  DamageTaken,
  InDepthCharacterInformation,
} from "../server/queries/table";
import type { Dungeon } from "./dungeons";

export const calcMetricAverage = <
  T extends Pick<DamageDone | HealingDone | DamageTaken, "total" | "guid">[]
>(
  keystoneTime: number,
  data: T,
  guid?: InDepthCharacterInformation["guid"]
): number => {
  const runInSeconds = keystoneTime / 1000;

  const sum = guid
    ? data.find((event) => event.guid === guid)?.total ?? 0
    : data.reduce((acc: number, dataset) => acc + dataset.total, 0);

  return Math.round(sum / runInSeconds);
};

export const calcTimeLeft = (
  { timer }: Dungeon,
  keystoneTime: number
): string => {
  const [maxTime] = timer;

  return calcRunDuration(maxTime - keystoneTime);
};

export const calcRunDuration = (keystoneTime: number): string => {
  const totalSeconds = keystoneTime / 1000;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds - minutes * 60);
  const milliseconds = keystoneTime - minutes * 60 * 1000 - seconds * 1000;

  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");
  const paddedMs = milliseconds.toString().padStart(3, "0");

  return `${paddedMinutes}:${paddedSeconds}.${paddedMs}`;
};
