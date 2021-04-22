import type { UIFightsResponse } from "../../types";
import { affixes as allAffixes } from "../../utils/affixes";
import { classnames } from "../../utils/classNames";
import styles from "./Affixes.module.css";

type AffixesProps = Pick<UIFightsResponse["fights"][number], "affixes"> & {
  chests: number;
};

export function Affixes({ affixes, chests }: AffixesProps): JSX.Element {
  return (
    <div className={styles.container}>
      {affixes.map((affixId) => {
        const affixInfo = allAffixes.find((affix) => affix.id === affixId);
        const src = affixInfo?.icon ?? "unknown";
        const alt = affixInfo?.name ?? affixId.toString();

        return (
          <img
            height={4}
            loading="lazy"
            src={src}
            alt={alt}
            key={affixId}
            className={classnames(
              styles.img,
              chests > 0 ? undefined : styles.dead
            )}
          />
        );
      })}
    </div>
  );
}
