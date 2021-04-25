import type { Fight } from "../server/queries/report";
import type { Dungeon } from "./dungeons";

export const formatTimeLeft = (
  { timer }: Dungeon,
  completionTime: number
): string => {
  const [maxTime] = timer;

  return formatKeystoneTime(maxTime - completionTime);
};

export const formatKeystoneTime = (
  completionTime: Fight["keystoneTime"]
): string => {
  const totalSeconds = completionTime / 1000;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds - minutes * 60);
  const milliseconds = completionTime - minutes * 60 * 1000 - seconds * 1000;

  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");
  const paddedMs = milliseconds.toString().padStart(3, "0");

  return `${paddedMinutes}:${paddedSeconds}.${paddedMs}`;
};
