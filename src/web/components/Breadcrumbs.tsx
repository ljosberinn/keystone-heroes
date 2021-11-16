import Link from "next/link";
import { Fragment } from "react";

import {
  bgPrimary,
  internalLinKClasses,
  widthConstraint,
} from "../styles/tokens";

type BreadcrumbsProps = {
  paths: { href?: string; children: string }[];
};

export function Breadcrumbs({ paths }: BreadcrumbsProps): JSX.Element {
  return (
    <nav className={`${widthConstraint} pb-4`}>
      <ol className={`flex p-2 ${bgPrimary} rounded-lg`}>
        {paths.map((path, index) => {
          const isLast = index + 1 === paths.length;

          return (
            <Fragment key={path.href ?? index}>
              <li>
                {path.href ? (
                  <Link href={path.href}>
                    <a className={internalLinKClasses}>{path.children}</a>
                  </Link>
                ) : (
                  path.children
                )}
              </li>
              {isLast ? null : (
                <li>
                  <span className="mx-2">{">"}</span>
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
