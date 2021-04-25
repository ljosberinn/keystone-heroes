import { WCL_ASSETS_STATIC_URL } from "../../constants";
import { classnames } from "../../utils/classNames";

export type IconProps = {
  src: string;
  alt: string;
  title?: string;
  className?: Parameters<typeof classnames>[0];
  prefixSrcWithWCLAssetConstant?: boolean;
};

export function Icon({
  className,
  prefixSrcWithWCLAssetConstant,
  src,
  alt,
  ...rest
}: IconProps): JSX.Element {
  return (
    <img
      loading="lazy"
      alt={alt}
      src={
        prefixSrcWithWCLAssetConstant ? `${WCL_ASSETS_STATIC_URL}${src}` : src
      }
      className={classnames("w-6 h-6", className)}
      {...rest}
    />
  );
}
