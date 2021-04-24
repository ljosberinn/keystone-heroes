import type { DamageDone } from "../types/fightSummary";
import type { Dungeon } from "./dungeons";

export const calcGroupDps = (
  runDuration: number,
  damageDone?: DamageDone[]
): number => {
  if (!damageDone || runDuration === 0) {
    return 0;
  }

  const runInSeconds = runDuration / 1000;
  const sum = damageDone.reduce((acc, damage) => acc + damage.total, 0);

  return Math.round(sum / runInSeconds);
};

export const calcChests = (
  { timer }: Dungeon,
  completionTime: number
): number => {
  if (completionTime === 0) {
    return 0;
  }

  const index = timer.findIndex((timer) => completionTime > timer);

  return index > -1 ? index : 3;
};

export const calcTimeLeftOrOver = (
  { timer }: Dungeon,
  completionTime: number
): string => {
  const [maxTime] = timer;

  return calcRunDuration(
    0,
    0,
    completionTime === 0 ? 0 : maxTime - completionTime
  );
};

/**
 * `completionTime` is only larger than 0 if the key was indeed finished
 * otherwise, use log `start`/`end` timers
 */
export const calcRunDuration = (
  completionTime: number,
  start_time: number,
  end_time: number
): string => {
  const totalMilliseconds =
    completionTime > 0 ? completionTime : end_time - start_time;
  const totalSeconds = totalMilliseconds / 1000;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds - minutes * 60);
  const milliseconds = totalMilliseconds - minutes * 60 * 1000 - seconds * 1000;

  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");
  const paddedMs = milliseconds.toString().padStart(3, "0");

  return `${paddedMinutes}:${paddedSeconds}.${paddedMs}`;
};
