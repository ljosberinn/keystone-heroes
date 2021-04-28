import type { Player } from "../../pages/api/report";
import { classnames } from "../../utils/classNames";
import styles from "./Composition.module.css";
import { Icon } from "./Icon";

export type CompositionProps = {
  composition: Player[];
};

export function Composition({ composition }: CompositionProps): JSX.Element {
  return (
    <div className="flex items-center flex-row">
      {composition.map((player, index) => {
        return (
          <Icon
            key={player.guid}
            src="https://assets.rpglogs.com/img/warcraft/icons/actors.jpg?v=2"
            className={classnames(
              "object-cover",
              styles.sprite,
              index > 0 && "ml-1",
              styles[`sprite-${player.spec.replace("_", "-")}`]
            )}
            alt={player.spec.replace("_", "")}
          />
        );
      })}
    </div>
  );
}
