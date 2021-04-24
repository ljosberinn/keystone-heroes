import { affixes as allAffixes } from "../../utils/affixes";
import { classnames } from "../../utils/classNames";

type AffixesProps = {
  affixes: number[];
  chests: number;
};

export function Affixes({ affixes, chests }: AffixesProps): JSX.Element {
  return (
    <div className="flex items-center flex-row">
      {affixes.map((affixId, index) => {
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
              "w-4 h-4",
              index > 0 && "ml-1",
              chests === 0 && "filter grayscale opacity-50"
            )}
          />
        );
      })}
    </div>
  );
}
