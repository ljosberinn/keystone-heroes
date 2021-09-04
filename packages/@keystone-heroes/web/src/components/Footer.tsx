import { COMMIT_SHA, BUILD_TIME } from "@keystone-heroes/env";
import Link from "next/link";

import { ExternalLink } from "./ExternalLink";

type FooterNavLinkProps = {
  href: string;
  children: string;
};

function FooterNavLink({ href, children }: FooterNavLinkProps) {
  return (
    <li className="py-1 text-base leading-relaxed md:text-sm">
      <Link href={href}>
        <a className="transition-colors duration-150 ease-in-out hover:text-yellow-600">
          {children}
        </a>
      </Link>
    </li>
  );
}

export function Footer(): JSX.Element {
  return (
    <footer className="w-full max-w-screen-xl mx-auto">
      <nav className="flex flex-col items-start justify-between w-full gap-6 pt-16 pb-16 space-y-6 md:space-y-0 md:flex-row md:pt-14 lg:pb-40">
        <div className="flex flex-col items-center w-full h-full space-y-5 md:items-start lg:w-72">
          <Link href="/">
            <a className="flex flex-col items-center space-y-2 text-center md:flex-row lg:items-start md:items-center md:text-left md:space-x-2 md:space-y-0 undefined">
              <div className="mt-1 text-lg font-semibold tracking-tight leading-tighter">
                Keystone Heroes
              </div>
            </a>
          </Link>
        </div>

        <div className="grid items-center w-full grid-cols-1 text-center md:grid-cols-2 lg:pr-6 md:gap-10 md:text-left md:items-start md:w-auto">
          <ul>
            <FooterNavLink href="/foo">Foo</FooterNavLink>
            <FooterNavLink href="/bar">Bar</FooterNavLink>
            <FooterNavLink href="/baz">Baz</FooterNavLink>
          </ul>
          <ul>
            <FooterNavLink href="/quz">Quz</FooterNavLink>
            <FooterNavLink href="/qur">Qur</FooterNavLink>
          </ul>
        </div>
      </nav>
      {COMMIT_SHA && (
        <small className="flex items-center justify-center w-full py-6 space-x-6 text-xs text-gray-500 md:justify-end dark:text-gray-300">
          <ExternalLink
            href={`https://github.com/ljosberinn/wcl-to-mdt/tree/${COMMIT_SHA}`}
          >
            Commit {COMMIT_SHA} built at {BUILD_TIME}
          </ExternalLink>
        </small>
      )}
    </footer>
  );
}
