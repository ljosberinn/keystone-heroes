import Link from "next/link";

import { COMMIT_SHA, BUILD_TIME } from "../env";
import { ColorModeToggle } from "./ColorModeToggle";
import { ExternalLink } from "./ExternalLink";

type FooterNavLinkProps = {
  href: string;
  children: string;
};

function FooterNavLink({ href, children }: FooterNavLinkProps) {
  return (
    <li className="py-1 text-base leading-relaxed md:text-sm">
      <Link href={href} prefetch={false}>
        <a className="transition-colors duration-150 ease-in-out hover:text-yellow-600">
          {children}
        </a>
      </Link>
    </li>
  );
}

export function Footer(): JSX.Element {
  return (
    <div className="px-6 print:hidden dark:text-gray-200">
      <footer className="w-full mx-auto max-w-screen-2xl">
        <nav className="flex flex-col items-center justify-between w-full py-16 space-y-16 md:space-y-8 md:space-y-0 md:flex-row md:items-start">
          <div className="flex flex-col items-center h-full space-y-6 md:items-start w-72">
            <Link href="/">
              <a className="flex flex-col items-center space-y-2 text-center md:flex-row md:items-start md:text-left md:space-x-2 md:space-y-0">
                <div className="mt-1 text-lg font-semibold tracking-tight leading-tighter">
                  Keystone Heroes
                </div>
              </a>
            </Link>
          </div>

          <div className="grid items-center w-full grid-cols-1 text-center md:grid-cols-2 lg:pr-8 md:gap-10 md:text-left md:items-start md:w-auto">
            <ul>
              <FooterNavLink href="/foo">Foo</FooterNavLink>
              <FooterNavLink href="/bar">Bar</FooterNavLink>
              <FooterNavLink href="/baz">Baz</FooterNavLink>
            </ul>
            <ul>
              <FooterNavLink href="/foo">Foo</FooterNavLink>
              <FooterNavLink href="/bar">Bar</FooterNavLink>
              <FooterNavLink href="/baz">Baz</FooterNavLink>
            </ul>
          </div>
        </nav>

        <small className="flex items-center justify-center w-full py-6 space-x-6 text-xs text-gray-500 md:justify-end dark:text-gray-300">
          <Link href="/terms-and-conditions" prefetch={false}>
            <a>Terms & Conditions</a>
          </Link>
          <Link href="/privacy" prefetch={false}>
            <a>Privacy</a>
          </Link>
          <ColorModeToggle />
        </small>

        {COMMIT_SHA && (
          <small className="flex items-center justify-center w-full py-6 space-x-6 text-xs text-gray-500 md:justify-end dark:text-gray-300">
            <ExternalLink
              href={`https://github.com/ljosberinn/wcl-to-mdt/tree/${COMMIT_SHA}`}
            >
              Built at {BUILD_TIME}
            </ExternalLink>
          </small>
        )}
      </footer>
    </div>
  );
}
