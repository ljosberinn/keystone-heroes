import type { Player } from "../../pages/report/[reportId]";
import { classnames } from "../../utils/classNames";
import styles from "./Composition.module.css";

export type CompositionProps = {
  composition: Player[];
};

export function Composition({ composition }: CompositionProps): JSX.Element {
  return (
    <div className="flex items-center flex-row">
      {composition.map((player, index) => {
        const alt = `${player.spec} ${player.className}`;
        return (
          <img
            key={`${player.guid}`}
            src="//assets.rpglogs.com/img/warcraft/icons/actors.jpg?v=2"
            className={classnames(
              "w-6 h-6 object-cover",
              styles.sprite,
              index > 0 && "ml-1",
              styles[`sprite-${player.className}-${player.spec}`]
            )}
            loading="lazy"
            alt={alt}
            title={alt}
          />
        );
      })}
    </div>
  );
}
