import type { ResponseFight2 } from "../../server/db/fights";
import { classnames } from "../../utils/classNames";
import styles from "./Composition.module.css";
import { Icon } from "./Icon";

export type CompositionProps = {
  composition: ResponseFight2["composition"];
};

export function Composition({ composition }: CompositionProps): JSX.Element {
  return (
    <div className="flex items-center flex-row">
      {composition.map((player, index) => {
        return (
          <Icon
            key={player.character.name}
            src="https://assets.rpglogs.com/img/warcraft/icons/actors.jpg?v=2"
            className={classnames(
              "object-cover",
              styles.sprite,
              index > 0 && "ml-1",
              styles[
                `sprite-${player.character.class.name}-${player.character.spec.name}`
              ]
            )}
            alt={player.character.spec.name}
          />
        );
      })}
    </div>
  );
}
