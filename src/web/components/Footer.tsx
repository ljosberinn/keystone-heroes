import Link from "next/link";
import { version } from "react";

import { map, patreon, paypal, twitter } from "../icons";
import { internalLinKClasses } from "../styles/tokens";
import { ColorModeToggle } from "./ColorModeToggle";
import { ExternalLink } from "./ExternalLink";

type FooterNavLinkProps = {
  href: string;
  children: string | JSX.Element;
  internal?: boolean;
};

function FooterNavLink({ href, children, internal }: FooterNavLinkProps) {
  return (
    <li className="py-1 text-base leading-relaxed md:text-sm">
      {internal ? (
        <Link href={href} prefetch={false}>
          <a className={internalLinKClasses}>{children}</a>
        </Link>
      ) : (
        <ExternalLink className={internalLinKClasses} href={href}>
          {children}
        </ExternalLink>
      )}
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
              <FooterNavLink internal href="/search">
                <span className="md:items-center md:justify-end md:flex">
                  <svg className="inline w-6 h-6 mr-2">
                    <use href={`#${map.id}`} />
                  </svg>
                  Find Routes
                </span>
              </FooterNavLink>
            </ul>
            <ul className="md:text-right">
              <FooterNavLink href="/foo">
                <span className="md:items-center md:justify-end md:flex">
                  <svg className="inline w-6 h-6 mr-2">
                    <use href={`#${patreon.id}`} />
                  </svg>
                  Patreon
                </span>
              </FooterNavLink>
              <FooterNavLink href="https://www.paypal.com/paypalme/gerritalex">
                <span className="md:items-center md:justify-end md:flex">
                  <svg className="inline w-6 h-6 mr-2">
                    <use href={`#${paypal.id}`} />
                  </svg>
                  PayPal
                </span>
              </FooterNavLink>
              <FooterNavLink href="https://twitter.com/gerrit_alex">
                <span className="md:items-center md:justify-end md:flex">
                  <svg className="inline w-6 h-6 mr-2">
                    <use href={`#${twitter.id}`} />
                  </svg>
                  Twitter
                </span>
              </FooterNavLink>
            </ul>
          </div>
        </nav>

        <small className="flex items-center justify-center w-full py-6 space-x-6 text-xs text-gray-500 md:justify-end dark:text-gray-300">
          <Link href="/terms-and-conditions" prefetch={false}>
            <a className={internalLinKClasses}>Terms & Conditions</a>
          </Link>
          <Link href="/privacy" prefetch={false}>
            <a className={internalLinKClasses}>Privacy</a>
          </Link>
          <ColorModeToggle />
        </small>

        <small className="flex items-center justify-center w-full py-2 space-x-2 text-xs text-gray-500 md:justify-end dark:text-gray-300">
          <span>
            All data is retrieved from{" "}
            <ExternalLink className="underline" href="https://warcraftlogs.com">
              Warcraft Logs
            </ExternalLink>
            .
          </span>
          <span>
            Tooltips from{" "}
            <ExternalLink className="underline" href="https://www.wowhead.com/">
              Wowhead
            </ExternalLink>
            .
          </span>
        </small>

        <small className="flex items-center justify-center w-full py-2 text-xs text-gray-500 md:justify-end dark:text-gray-300">
          World of Warcraft and related artwork is copyright of Blizzard
          Entertainment, Inc. This is a fan site and we are not affiliated.
        </small>

        <small className="flex items-center justify-center w-full pt-2 pb-6 space-x-2 text-xs text-gray-500 md:justify-end dark:text-gray-300">
          <span>
            hosted on{" "}
            <ExternalLink className="underline" href="https://vercel.com/">
              Vercel
            </ExternalLink>
          </span>
          <span>|</span>
          <span>
            db via{" "}
            <ExternalLink className="underline" href="https://vercel.com/">
              Supabase
            </ExternalLink>
          </span>
          <span>|</span>
          <span>
            ui via{" "}
            <ExternalLink className="underline" href="https://tailwindcss.com/">
              Tailwind
            </ExternalLink>{" "}
            through{" "}
            <ExternalLink className="underline" href="https://nextjs.org/">
              Next.js
            </ExternalLink>{" "}
            <ExternalLink
              href={`https://www.npmjs.com/package/react/v/${
                version.includes("experimental")
                  ? version.replace("18.0.0", "0.0.0")
                  : version
              }`}
            >
              (React {version.split("-")[0]})
            </ExternalLink>
          </span>
          <span>|</span>{" "}
          <ExternalLink
            href={`https://github.com/ljosberinn/wcl-to-mdt/tree/${
              process.env.NEXT_PUBLIC_COMMIT_SHA ?? "master"
            }`}
          >
            built at{" "}
            {process.env.NEXT_PUBLIC_BUILD_TIME ?? new Date().toISOString()}
          </ExternalLink>
        </small>
      </footer>
    </div>
  );
}
