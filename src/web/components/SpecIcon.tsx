import { classnames } from "../utils/classnames";

export type SpecIconProps = {
  spec: string;
  class: string;
  className?: string;
  size?: number;
  alt?: string;
};

export function SpecIcon({
  className,
  spec,
  class: clazz,
  size = 8,
  alt,
}: SpecIconProps): JSX.Element {
  const width = size * 4;

  return (
    <img
      src={`/static/specs/${clazz}-${spec}.jpg`}
      alt={alt ?? `${spec} ${clazz}`}
      title={alt ?? `${spec} ${clazz}`}
      className={classnames(
        "object-cover w-full h-full rounded-full",
        className
      )}
      width={width}
      height={width}
    />
  );
}
