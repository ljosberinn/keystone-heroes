export const fightTimeToString = (time: number, omitMs = false): string => {
  const inSeconds = time / 1000;
  const minutes = Math.floor(inSeconds / 60);
  const seconds = Math.floor(inSeconds - minutes * 60);

  if (omitMs) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  const ms = time - minutes * 60 * 1000 - seconds * 1000;

  return `${minutes}:${seconds.toString().padStart(2, "0")}.${ms
    .toString()
    .padStart(3, "0")}`;
};
