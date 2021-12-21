import Link from "next/link";
import type { ReactNode } from "react";

import { classnames } from "../utils/classnames";
import { ExternalLink } from "./ExternalLink";
import styles from "./LinkBox.module.css";

type LinkBoxProps = {
  as?: "div" | "section";
  className?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
};

export function LinkBox({
  as: As = "div",
  className,
  children,
  "aria-labelledby": ariaLabelledBy,
}: LinkBoxProps): JSX.Element {
  return (
    <As
      aria-labelledby={ariaLabelledBy}
      className={classnames(styles.box, className)}
    >
      {children}
    </As>
  );
}

type LinkOverlayProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function LinkOverlay({
  href,
  children,
  className,
}: LinkOverlayProps): JSX.Element {
  if (href.includes("http")) {
    return (
      <ExternalLink
        href={href}
        data-linkbox-overlay
        className={classnames(styles.link, className)}
      >
        {children}
      </ExternalLink>
    );
  }

  return (
    <Link href={href} passHref>
      <a data-linkbox-overlay className={classnames(styles.link, className)}>
        {children}
      </a>
    </Link>
  );
}
