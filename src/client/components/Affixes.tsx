import type { Affixes as AffixesType } from "../../utils/affixes";
import { affixes as allAffixes } from "../../utils/affixes";
import { classnames } from "../../utils/classNames";
import { Icon } from "./Icon";

export type AffixesProps = {
  affixes: (keyof AffixesType)[];
  chests: number;
};

export function Affixes({ affixes, chests }: AffixesProps): JSX.Element {
  return (
    <div className="flex items-center flex-row">
      {affixes.map((affixId, index) => {
        const affixInfo = allAffixes[affixId] ?? null;

        if (!affixInfo) {
          return "?";
        }

        const src = affixInfo.icon ?? null;
        const alt = affixInfo.name ?? affixId.toString();

        return (
          <Icon
            srcPrefix="abilities"
            src={src}
            alt={alt}
            key={affixId}
            className={classnames(
              index > 0 && "ml-1",
              chests === 0 && "filter grayscale opacity-50"
            )}
          />
        );
      })}
    </div>
  );
}
