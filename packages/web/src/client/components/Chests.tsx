import { classnames } from "../../utils/classNames";
import { icons } from "../icons";

type ChestsProps = {
  chests: number;
};

export function Chests({ chests }: ChestsProps): JSX.Element {
  return (
    <div className="flex items-center flex-row">
      {Array.from({ length: 3 }, (_, index) => {
        const isOpen = chests >= index + 1;

        const icon = isOpen ? icons.openChest : icons.lockedChest;
        const color = isOpen ? "text-green-500" : "text-gray-500";

        return (
          <svg
            className={classnames(
              "w-6",
              "h-6",
              color,
              index > 0 && "ml-1",
              !isOpen && "opacity-30"
            )}
            key={index}
          >
            <use href={`#${icon.id}`} />
          </svg>
        );
      })}
    </div>
  );
}
