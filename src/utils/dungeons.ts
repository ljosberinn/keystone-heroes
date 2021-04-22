import type { InitialFightInformation } from "../types";

const createTimer = (initialTime: number): [number, number, number] => [
  initialTime * 60 * 1000,
  initialTime * 60 * 1000 * 0.8,
  initialTime * 60 * 1000 * 0.6,
];

export const dungeons = [
  { id: 12_284, name: "Sanguine Depths", timer: createTimer(41), slug: "SD" },
  {
    id: 12_285,
    name: "Spires of Ascension",
    timer: createTimer(39),
    slug: "SoA",
  },
  { id: 12_286, name: "The Necrotic Wake", timer: createTimer(36), slug: "NW" },
  {
    id: 12_287,
    name: "Halls of Atonement",
    timer: createTimer(31),
    slug: "HoA",
  },
  { id: 12_289, name: "Plaguefall", timer: createTimer(38), slug: "PF" },
  {
    id: 12_290,
    name: "Mists of Tirna Scithe",
    timer: createTimer(30),
    slug: "MoTS",
  },
  { id: 12_291, name: "De Other Side", timer: createTimer(43), slug: "DOS" },
  { id: 12_293, name: "Theatre of Pain", timer: createTimer(37), slug: "TOP" },
] as const;

/**
 * `completionTime` is only larger than 0 if the key was indeed finished
 * otherwise, use log `start`/`end` timers
 */
export const getRunTime = ({
  completionTime,
  start_time,
  end_time,
}: InitialFightInformation): string => {
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
