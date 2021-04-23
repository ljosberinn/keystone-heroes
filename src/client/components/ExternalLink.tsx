import type { ReactNode } from "react";

export type ExternalLinkProps = {
  href: string;
  children: ReactNode;
};

export function ExternalLink({
  href,
  children,
}: ExternalLinkProps): JSX.Element {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
