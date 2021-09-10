type AbilityIconProps = {
  icon?: string | null;
  alt: string;
  className?: string;
  title?: string;
};

export const WCL_ASSET_URL = `https://assets.rpglogs.com/img/warcraft/abilities/`;
export const BLOODLUST_ICON = `${WCL_ASSET_URL}spell_nature_bloodlust.jpg`;
export const SHROUD_ICON = `${WCL_ASSET_URL}ability_rogue_shroudofconcealment.jpg`;
export const INVIS_POTION_ICON = `${WCL_ASSET_URL}inv_alchemy_80_potion02orange.jpg`;

export function AbilityIcon({
  icon,
  alt,
  className,
  title,
}: AbilityIconProps): JSX.Element {
  return (
    <img
      src={`${WCL_ASSET_URL}${icon ?? "inv_misc_questionmark"}.jpg`}
      alt={alt}
      // title={alt}
      className={className}
      title={title}
    />
  );
}
