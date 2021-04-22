import { classnames } from "../../utils/classNames";
import { Icons } from "../icons";
import styles from "./Chests.module.css";

type ChestsProps = {
  chests: number;
};

export function Chests({ chests }: ChestsProps): JSX.Element {
  return (
    <div className={styles.container}>
      {Array.from({ length: 3 }, (_, index) => {
        const isOpen = chests >= index + 1;

        const icon = isOpen ? Icons.openChest : Icons.closedChest;
        const color = isOpen ? "green" : "grey";

        return (
          <svg
            className={classnames(styles.icon, !isOpen && styles.lowOpacity)}
            height="1rem"
            width="1rem"
            color={color}
            key={index}
          >
            <use href={`#${icon}`} />
          </svg>
        );
      })}
    </div>
  );
}
