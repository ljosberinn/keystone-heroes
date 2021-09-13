import { classnames } from "src/utils/classnames";

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
      className={classnames(
        "object-cover w-full h-full rounded-full",
        className
      )}
    />
  );
}
