import type { ReactNode, HTMLAttributes } from "react";

import { classnames } from "../utils/classnames";

export type ExternalLinkProps = Pick<
  HTMLAttributes<"a">,
  "className" | "title"
> & {
  href: string;
  children: ReactNode;
  "data-linkbox-overlay"?: boolean;
};

export function ExternalLink({
  href,
  children,
  className,
  title,
  "data-linkbox-overlay": dataLinkOverlay,
}: ExternalLinkProps): JSX.Element {
  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a
      href={href}
      target="_blank"
      rel={`noopener${href.includes("warcraftlogs") ? "" : " noreferrer"}`}
      className={classnames("hover:underline", className)}
      title={title}
      data-linkbox-overlay={dataLinkOverlay}
    >
      {children}
    </a>
  );
}
