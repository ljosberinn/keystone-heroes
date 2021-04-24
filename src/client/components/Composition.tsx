import { classnames } from "../../utils/classNames";
import styles from "./Composition.module.css";

export type CompositionProps = {
  composition: string[];
};

export function Composition({ composition }: CompositionProps): JSX.Element {
  return (
    <div className="flex items-center flex-row">
      {composition.map((actor, index) => {
        return (
          <img
            // eslint-disable-next-line react/no-array-index-key
            key={`${actor}-${index}`}
            src="//assets.rpglogs.com/img/warcraft/icons/actors.jpg?v=2"
            className={classnames(
              "w-4 h-4 object-cover",
              styles.sprite,
              index > 0 && "ml-1",
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
