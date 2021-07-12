type AbilityIconProps = {
  icon?: string | null;
  alt: string;
  className?: string;
};

export function AbilityIcon({
  icon,
  alt,
  className,
}: AbilityIconProps): JSX.Element {
  return (
    <img
      src={`https://assets.rpglogs.com/img/warcraft/abilities/${
        icon ?? "inv_misc_questionmark"
      }.jpg`}
      alt={alt}
      title={alt}
      className={className}
    />
  );
}
