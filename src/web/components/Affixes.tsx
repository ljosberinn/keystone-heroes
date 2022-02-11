import { affixes } from "../staticData";
import { createWowheadUrl } from "../utils";
import { classnames } from "../utils/classnames";
import { AbilityIcon } from "./AbilityIcon";
import { ExternalLink } from "./ExternalLink";

export type AffixesProps = {
  ids: number[];
  className?: string;
  iconSize?: 24 | 32 | 40 | 48;
};

const iconSizeMap = {
  24: "w-6 h-6",
  32: "w-8 h-8",
  40: "w-10 h-10",
  48: "w-12 h-12",
};

export function Affixes({
  ids,
  className,
  iconSize = 40,
}: AffixesProps): JSX.Element {
  const linkClasses = iconSizeMap[iconSize];

  return (
    <div className={classnames("flex space-x-1", className)}>
      {ids.map((id) => (
        <ExternalLink
          href={createWowheadUrl({
            category: "affix",
            id,
          })}
          key={id}
          className={linkClasses}
        >
          <AbilityIcon
            icon={affixes[id].icon}
            alt={affixes[id].name}
            title={affixes[id].name}
            className="object-cover w-full h-full rounded-full"
            width={iconSize}
            height={iconSize}
          />
        </ExternalLink>
      ))}
    </div>
  );
}
