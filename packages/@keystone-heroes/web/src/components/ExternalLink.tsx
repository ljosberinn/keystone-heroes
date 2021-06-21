import type { ReactNode, HTMLAttributes } from "react";

export type ExternalLinkProps = Pick<HTMLAttributes<"a">, "className"> & {
  href: string;
  children: ReactNode;
};

export function ExternalLink({
  href,
  children,
  className,
}: ExternalLinkProps): JSX.Element {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
