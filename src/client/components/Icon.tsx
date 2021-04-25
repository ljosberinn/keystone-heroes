import { classnames } from "../../utils/classNames";

export type IconProps = {
  src: string;
  alt: string;
  className?: Parameters<typeof classnames>[0];
  srcPrefix?: keyof typeof wclAssetConstants;
};

export function Icon({
  className,
  srcPrefix,
  src,
  alt,
  ...rest
}: IconProps): JSX.Element {
  return (
    <img
      loading="lazy"
      alt={alt}
      title={alt}
      src={srcPrefix ? `${wclAssetConstants[srcPrefix]}${src}` : src}
      className={classnames("w-6 h-6", className)}
      {...rest}
    />
  );
}

const wclAssetConstants = {
  soulbinds: "//assets.rpglogs.com/img/warcraft/soulbinds/soulbind-",
  abilities: "//assets.rpglogs.com/img/warcraft/abilities/",
};
