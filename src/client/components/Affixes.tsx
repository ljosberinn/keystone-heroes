import type { ResponseFight2 } from "../../server/db/fights";
import { classnames } from "../../utils/classNames";
import { Icon } from "./Icon";

export type AffixesProps = Pick<ResponseFight2, "affixes" | "chests">;

export function Affixes({ affixes, chests }: AffixesProps): JSX.Element {
  return (
    <div className="flex items-center flex-row">
      {affixes.map((affix, index) => {
        const src = affix.icon ?? null;
        const alt = affix.name ?? affix.id.toString();

        return (
          <Icon
            srcPrefix="abilities"
            src={src}
            alt={alt}
            key={affix.id}
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
