import type { Conduit } from "../../server/queries/fights";
import { Icon } from "./Icon";

export type ConduitsProps = {
  conduits: Conduit[];
};

export function Conduits({ conduits }: ConduitsProps): JSX.Element {
  return (
    <div className="flex justify-center">
      {conduits.map((conduit, index) => {
        return (
          <Icon
            src={conduit.abilityIcon}
            alt={conduit.name}
            className={index > 0 && "ml-1"}
            key={conduit.guid}
            srcPrefix="abilities"
          />
        );
      })}
    </div>
  );
}
