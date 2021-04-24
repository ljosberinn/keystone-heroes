import { classnames } from "../../utils/classNames";
import { Icons } from "../icons";

type ChestsProps = {
  chests: number;
};

export function Chests({ chests }: ChestsProps): JSX.Element {
  return (
    <div className="flex items-center flex-row">
      {Array.from({ length: 3 }, (_, index) => {
        const isOpen = chests >= index + 1;

        const icon = isOpen ? Icons.openChest : Icons.closedChest;
        const color = isOpen ? "text-green-500" : "text-gray-500";

        return (
          <svg
            className={classnames(
              "w-4 h-4",
              color,
              index > 0 && "ml-1",
              !isOpen && "opacity-30"
            )}
            key={index}
          >
            <use href={`#${icon}`} />
          </svg>
        );
      })}
    </div>
  );
}
