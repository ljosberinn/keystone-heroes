import { useState } from "react";

type AbilityIconProps = {
  icon?: string | null;
  alt: string;
  className?: string;
  title?: string;
  width?: number;
  height?: number;
};

export const STATIC_ICON_PREFIX = "/static/icons/";
export const BLOODLUST_ICON = `${STATIC_ICON_PREFIX}spell_nature_bloodlust.jpg`;
export const SHROUD_ICON = `${STATIC_ICON_PREFIX}ability_rogue_shroudofconcealment.jpg`;
export const INVIS_POTION_ICON = `${STATIC_ICON_PREFIX}inv_alchemy_80_potion02orange.jpg`;
export const QUESTIONMARK_ICON = "inv_misc_questionmark";
export const ZOOM_ICON = `${STATIC_ICON_PREFIX}inv_misc_spyglass_03.jpg`;

const useIcon = (icon?: string | null) => {
  const [errored, setErrored] = useState(false);
  const [useWowhead, setUseWowhead] = useState(false);

  const src =
    !errored && useWowhead && icon
      ? `https://wow.zamimg.com/images/wow/icons/medium/${icon}.jpg`
      : `${STATIC_ICON_PREFIX}${
          errored ? QUESTIONMARK_ICON : icon ?? QUESTIONMARK_ICON
        }.jpg`;

  return {
    src,
    onError: () => {
      // if below fails.. run
      if (errored) {
        return;
      }

      // if wowhead fails aswell, fallback to questionmark
      if (useWowhead) {
        setErrored(true);
        return;
      }

      // try wowhead fallback first
      setUseWowhead(true);
    },
  };
};

export function AbilityIcon({
  icon,
  alt,
  className,
  title,
  height,
  width,
}: AbilityIconProps): JSX.Element {
  const { src, onError } = useIcon(icon);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <img
      src={src}
      alt={alt}
      title={title}
      className={className}
      width={width}
      height={height}
      onError={onError}
    />
  );
}
