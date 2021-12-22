import { affixes } from "../staticData";
import { createWowheadUrl } from "../utils";
import { classnames } from "../utils/classnames";
import { AbilityIcon } from "./AbilityIcon";
import { ExternalLink } from "./ExternalLink";

export type AffixesProps = {
  ids: number[];
  className?: string;
};

export function Affixes({ ids, className }: AffixesProps): JSX.Element {
  return (
    <div className={classnames("flex space-x-1", className)}>
      {ids.map((id) => (
        <ExternalLink
          href={createWowheadUrl({
            category: "affix",
            id,
          })}
          key={id}
          className="w-10 h-10"
        >
          <AbilityIcon
            icon={affixes[id].icon}
            alt={affixes[id].name}
            title={affixes[id].name}
            className="object-cover w-full h-full rounded-full"
            width={40}
            height={40}
          />
        </ExternalLink>
      ))}
    </div>
  );
}
