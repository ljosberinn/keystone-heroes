import { COMMIT_SHA, BUILD_TIME } from "@keystone-heroes/env";
import Link from "next/link";

import { ExternalLink } from "./ExternalLink";

type FooterNavLinkProps = {
  href: string;
  children: string;
};

function FooterNavLink({ href, children }: FooterNavLinkProps) {
  return (
    <li className="py-1 md:text-sm text-base leading-relaxed">
      <Link href={href}>
        <a className="hover:text-yellow-600 transition-colors ease-in-out duration-150">
          {children}
        </a>
      </Link>
    </li>
  );
}

export function Footer(): JSX.Element {
  return (
    <footer className="max-w-screen-xl w-full mx-auto">
      <nav className="w-full md:space-y-0 space-y-6 flex md:flex-row flex-col items-start justify-between gap-6 md:pt-14 pt-16 lg:pb-40 pb-16">
        <div className="space-y-5 h-full flex flex-col md:items-start items-center lg:w-72 w-full">
          <Link href="/">
            <a className="flex md:flex-row flex-col lg:items-start md:items-center items-center md:text-left text-center md:space-x-2 md:space-y-0 space-y-2 undefined">
              <div className="mt-1 text-lg font-semibold leading-tighter tracking-tight">
                Lorem ipsum dolor sit amet.
              </div>
            </a>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 lg:pr-6 md:gap-10 md:text-left text-center md:items-start items-center md:w-auto w-full">
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
      <small className="space-x-6 py-6 text-xs w-full flex items-center md:justify-end justify-center text-gray-500 dark:text-gray-300">
        {COMMIT_SHA && (
          <ExternalLink
            href={`https://github.com/ljosberinn/wcl-to-mdt/tree/${COMMIT_SHA}`}
          >
            Commit {COMMIT_SHA} built at {BUILD_TIME}
          </ExternalLink>
        )}
      </small>
    </footer>
  );
}
