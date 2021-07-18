type AbilityIconProps = {
  icon?: string | null;
  alt: string;
  className?: string;
};

export const WCL_ASSET_URL = `https://assets.rpglogs.com/img/warcraft/abilities/`;

export function AbilityIcon({
  icon,
  alt,
  className,
}: AbilityIconProps): JSX.Element {
  return (
    <img
      src={`${WCL_ASSET_URL}${icon ?? "inv_misc_questionmark"}.jpg`}
      alt={alt}
      title={alt}
      className={className}
    />
  );
}
