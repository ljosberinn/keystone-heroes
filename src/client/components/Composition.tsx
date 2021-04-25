import type { Player } from "../../pages/report/[reportId]";
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
            src="//assets.rpglogs.com/img/warcraft/icons/actors.jpg?v=2"
            className={classnames(
              "object-cover",
              styles.sprite,
              index > 0 && "ml-1",
              styles[`sprite-${player.className}-${player.spec}`]
            )}
            alt={`${player.spec} ${player.className}`}
          />
        );
      })}
    </div>
  );
}
