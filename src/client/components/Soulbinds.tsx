import type { SoulbindTalent } from "../../server/queries/fights";
import { Icon } from "./Icon";

export type SoulbindsProps = {
  soulbinds: SoulbindTalent[];
};

export function Soulbinds({ soulbinds }: SoulbindsProps): JSX.Element {
  return (
    <div className="flex justify-center">
      {soulbinds.map((talent, index) => {
        return (
          <Icon
            src={talent.abilityIcon}
            alt={talent.name}
            title={talent.name}
            className={index > 0 && "ml-1"}
            key={talent.guid}
            prefixSrcWithWCLAssetConstant
          />
        );
      })}
    </div>
  );
}
