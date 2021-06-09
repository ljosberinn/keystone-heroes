import Link from "next/link";
import type { ReactNode } from "react";
import { classnames } from "src/utils/classnames";

import styles from "./LinkBox.module.css";

type LinkBoxProps = {
  as?: "div" | "article";
  className?: string;
  children: ReactNode;
};

export function LinkBox({
  as: As = "div",
  className,
  children,
}: LinkBoxProps): JSX.Element {
  return <As className={classnames(styles.box, className)}>{children}</As>;
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
  return (
    <Link href={href} passHref>
      <a data-linkbox-overlay className={classnames(styles.link, className)}>
        {children}
      </a>
    </Link>
  );
}
