export const fightTimeToString = (time: number): string => {
  const inSeconds = time / 1000;
  const minutes = Math.floor(inSeconds / 60);
  const seconds = Math.floor(inSeconds - minutes * 60);
  const ms = time - minutes * 60 * 1000 - seconds * 1000;

  return `${minutes}:${seconds}.${ms}`;
};
