import type { RawFight } from "../server/queries/report";

export const formatTimeLeft = (
  timer: [number, number, number],
  completionTime: number
): string => {
  const [maxTime] = timer;

  return formatKeystoneTime(maxTime - completionTime);
};

export const formatKeystoneTime = (
  completionTime: RawFight["keystoneTime"]
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
