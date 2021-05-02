import type { ResponseFight2 } from "../../server/db/fights";
import { Icon } from "./Icon";

export type ConduitsProps = Pick<
  ResponseFight2["composition"][number],
  "conduits"
>;

export function Conduits({ conduits }: ConduitsProps): JSX.Element {
  return (
    <div className="flex justify-center">
      {conduits.map((conduit, index) => {
        return (
          <Icon
            src={conduit.abilityIcon}
            alt={`${conduit.name} @ ${conduit.itemLevel}`}
            className={index > 0 && "ml-1"}
            key={conduit.id}
            srcPrefix="abilities"
          />
        );
      })}
    </div>
  );
}
