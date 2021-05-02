import type { ResponseFight2 } from "../../server/db/fights";
import { Icon } from "./Icon";

export type SoulbindsProps = Pick<
  ResponseFight2["composition"][number],
  "covenantTraits"
>;

export function Soulbinds({ covenantTraits }: SoulbindsProps): JSX.Element {
  return (
    <div className="flex justify-center">
      {covenantTraits.map((talent, index) => {
        return (
          <Icon
            src={talent.abilityIcon}
            alt={talent.name}
            className={index > 0 && "ml-1"}
            key={talent.id}
            srcPrefix="abilities"
          />
        );
      })}
    </div>
  );
}
