import type { InitialFightInformation } from "../../types";
import { classnames } from "../../utils/classNames";
import styles from "./Composition.module.css";

export type CompositionProps = Pick<InitialFightInformation, "composition">;

export function Composition({ composition }: CompositionProps): JSX.Element {
  return (
    <div className={styles.container}>
      {composition.map((actor, index) => {
        return (
          <img
            // eslint-disable-next-line react/no-array-index-key
            key={`${actor}-${index}`}
            src="//assets.rpglogs.com/img/warcraft/icons/actors.jpg?v=2"
            className={classnames(
              styles.sprite,
              styles[`actor-sprite-${actor}`]
            )}
            loading="lazy"
            alt={actor}
          />
        );
      })}
    </div>
  );
}
