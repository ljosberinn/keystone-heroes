import type { ReactNode, HTMLAttributes } from "react";

import { classnames } from "../utils/classnames";

export type ExternalLinkProps = Pick<
  HTMLAttributes<"a">,
  "className" | "title"
> & {
  href: string;
  children: ReactNode;
};

export function ExternalLink({
  href,
  children,
  className,
  title,
}: ExternalLinkProps): JSX.Element {
  return (
    <a
      href={href}
      target="_blank"
      rel={`noopener${href.includes("warcraftlogs") ? "" : " noreferrer"}`}
      className={classnames("hover:underline", className)}
      title={title}
    >
      {children}
    </a>
  );
}
