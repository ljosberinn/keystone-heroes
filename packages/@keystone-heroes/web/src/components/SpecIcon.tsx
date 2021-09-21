import { classnames } from "../utils/classnames";

export type SpecIconProps = {
  spec: string;
  class: string;
  className?: string;
};

export function SpecIcon({
  className,
  spec,
  class: clazz,
}: SpecIconProps): JSX.Element {
  return (
    <img
      src={`/static/specs/${clazz}-${spec}.jpg`}
      alt={`${spec} ${clazz}`}
      title={`${spec} ${clazz}`}
      className={classnames(
        "object-cover w-full h-full rounded-full",
        className
      )}
    />
  );
}
