import { useTheme } from "next-themes";
import Link from "next/link";
import { version } from "react";

import { buymeacoffee, paypal, twitter, discord, patreon } from "../icons";
import { internalLinkClasses } from "../styles/tokens";
import {
  buyMeACoffeeUrl,
  discordUrl,
  patreonUrl,
  paypalUrl,
  twitterUrl,
} from "../urls";
import { ColorModeToggle } from "./ColorModeToggle";
import { ExternalLink } from "./ExternalLink";
import { Logo } from "./Logo";

type FooterNavLinkProps = {
  href: string;
  children: string;
  icon:
    | typeof buymeacoffee
    | typeof patreon
    | typeof paypal
    | typeof discord
    | typeof twitter;
};

function FooterNavLink({ href, children, icon }: FooterNavLinkProps) {
  return (
    <li className="py-1 text-base leading-relaxed md:text-sm">
      <ExternalLink className={internalLinkClasses} href={href}>
        <span className="md:items-center md:justify-end md:flex">
          <svg className="inline w-6 h-6 mr-2">
            <use href={`#${icon.id}`} />
          </svg>
          {children}
        </span>
      </ExternalLink>
    </li>
  );
}

export function Footer(): JSX.Element {
  return (
    <div className="px-6 print:hidden dark:text-stone-200">
      <footer className="w-full mx-auto max-w-screen-2xl">
        <nav className="flex flex-col items-center justify-between w-full py-16 space-y-16 md:space-y-8 md:space-y-0 md:flex-row md:items-start">
          <div className="flex flex-col items-center h-full space-y-6 md:items-start w-72">
            <Logo />
          </div>

          <div className="grid items-center w-full grid-cols-1 text-center md:grid-cols-2 lg:pr-8 md:gap-10 md:text-left md:items-start md:w-auto">
            <ul>
              {/*
               */}
            </ul>
            <ul className="md:text-right">
              <FooterNavLink href={buyMeACoffeeUrl} icon={buymeacoffee}>
                Buy Me A Coffee
              </FooterNavLink>

              <FooterNavLink href={patreonUrl} icon={patreon}>
                Patreon
              </FooterNavLink>

              <FooterNavLink href={paypalUrl} icon={paypal}>
                PayPal
              </FooterNavLink>

              <FooterNavLink href={twitterUrl} icon={twitter}>
                Twitter
              </FooterNavLink>

              <FooterNavLink href={discordUrl} icon={discord}>
                Discord
              </FooterNavLink>
            </ul>
          </div>
        </nav>

        <small className="flex items-center justify-center w-full py-6 space-x-6 text-xs text-stone-500 md:justify-end dark:text-stone-300">
          <Link href="/privacy" prefetch={false}>
            <a className={internalLinkClasses}>Privacy</a>
          </Link>
          <ColorModeToggle />
        </small>

        <small className="flex flex-col items-center justify-center w-full py-2 space-x-0 space-y-1 text-xs text-stone-500 md:space-x-2 md:space-y-0 md:flex-row md:justify-end dark:text-stone-300">
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
          <span>
            Bear Emotes from{" "}
            <ExternalLink
              className="underline"
              href="https://yilinzc.carrd.co/"
            >
              yilinzc
            </ExternalLink>
            .
          </span>
        </small>

        <small className="flex flex-col justify-center w-full py-2 space-x-0 space-y-1 text-xs text-center text-stone-500 md:text-right md:space-x-2 md:space-y-0 md:flex-row md:justify-end dark:text-stone-300">
          <span>
            World of Warcraft and related artwork is copyright of Blizzard
            Entertainment, Inc.
          </span>
          <span>This is a fan site and we are not affiliated.</span>
        </small>

        <small className="flex items-center justify-center w-full py-2 space-x-2 space-y-1 text-xs text-stone-500 md:space-x-2 md:space-y-0 md:justify-end dark:text-stone-300">
          <ExternalLink
            className="flex items-center justify-center space-x-2 "
            href="https://vercel.com/"
            aria-label="Vercel"
          >
            <Vercel />
          </ExternalLink>

          <ExternalLink
            className="flex items-center justify-center space-x-2"
            href="https://nextjs.org/"
            aria-label="Next.js"
          >
            <Next />
          </ExternalLink>

          <ExternalLink
            href={`https://www.npmjs.com/package/react/v/${
              version.includes("experimental")
                ? version.replace("18.0.0", "0.0.0").replace("-rc.0", "")
                : version
            }`}
            className="flex"
            aria-label={`React ${version.split("-")[0]}`}
          >
            <React /> {version.split("-")[0]}
          </ExternalLink>

          <ExternalLink href="https://tailwindcss.com/" aria-label="Tailwind">
            <Tailwind />
          </ExternalLink>

          <ExternalLink href="https://supabase.io/" aria-label="Supabase">
            <Supabase />
          </ExternalLink>
        </small>

        <small className="flex items-center justify-center w-full pt-2 pb-6 space-x-1 space-y-1 text-xs text-stone-500 md:space-x-2 md:space-y-0 md:justify-end dark:text-stone-300">
          <ExternalLink
            href={`https://github.com/ljosberinn/keystone-heroes/tree/${
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

function React() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 841.9 595.3"
      className="h-4"
    >
      <g fill="#61DAFB">
        <path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z" />
        <circle cx="420.9" cy="296.5" r="45.7" />
        <path d="M520.5 78.1z" />
      </g>
    </svg>
  );
}

function Tailwind() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 33" className="h-4">
      <g clipPath="url(#tailwind-a)">
        <path
          fill="#06B6D4"
          fillRule="evenodd"
          d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="tailwind-a">
          <path fill="#fff" d="M0 0h54v32.4H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function Next() {
  const { theme } = useTheme();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      className="h-4"
    >
      <path
        fill={theme === "light" ? "black" : "white"}
        d="M467.253.2691c-2.15.1955-8.993.8797-15.151 1.3684C310.068 14.441 177.028 91.067 92.7664 208.841 45.8456 274.325 15.8358 348.605 4.4966 427.284.4888 454.748 0 462.86 0 500.098c0 37.238.4888 45.35 4.4966 72.814C31.6716 760.666 165.298 918.414 346.53 976.861c32.453 10.458 66.666 17.592 105.572 21.893 15.151 1.666 80.645 1.666 95.796 0 67.156-7.428 124.047-24.044 180.157-52.681 8.602-4.398 10.264-5.571 9.091-6.548-.782-.586-37.439-49.748-81.428-109.173l-79.96-107.999-100.196-148.268c-55.132-81.513-100.489-148.17-100.88-148.17-.391-.097-.782 65.778-.977 146.215-.293 140.84-.391 146.509-2.151 149.832-2.541 4.789-4.496 6.744-8.602 8.894-3.128 1.564-5.865 1.857-20.625 1.857h-16.912l-4.496-2.835c-2.933-1.857-5.083-4.3-6.549-7.134l-2.053-4.399.195-195.963.293-196.061 3.031-3.812c1.564-2.052 4.887-4.691 7.233-5.962 4.008-1.955 5.572-2.15 22.483-2.15 19.942 0 23.265.782 28.446 6.451 1.466 1.563 55.719 83.272 120.626 181.693 64.907 98.422 153.665 232.811 197.263 298.783l79.178 119.924 4.008-2.639c35.484-23.066 73.021-55.906 102.737-90.114 63.246-72.618 104.008-161.169 117.693-255.583 4.008-27.464 4.497-35.576 4.497-72.814 0-37.238-.489-45.35-4.497-72.814C968.328 239.53 834.702 81.7821 653.47 23.3352 621.505 12.975 587.488 5.8402 549.365 1.5397 539.98.5623 475.367-.5128 467.253.2691ZM671.945 302.668c4.692 2.346 8.505 6.842 9.873 11.533.782 2.542.978 56.884.782 179.348l-.293 175.732-30.987-47.5-31.085-47.5V446.538c0-82.588.391-129.013.977-131.261 1.564-5.474 4.985-9.774 9.678-12.315 4.007-2.053 5.474-2.248 20.821-2.248 14.467 0 17.008.195 20.234 1.954Z"
      />
    </svg>
  );
}

function Vercel() {
  const { theme } = useTheme();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1155 1000"
      className="h-4"
    >
      <path
        fill={theme === "light" ? "black" : "white"}
        d="m577.344 0 577.346 1000H0L577.344 0Z"
      />
    </svg>
  );
}

function Supabase() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 109 113"
      className="h-4"
    >
      <path
        fill="url(#supabase-a)"
        d="M63.7076 110.284c-2.8595 3.601-8.6574 1.628-8.7263-2.97l-1.0075-67.2513h45.2197c8.1905 0 12.7585 9.4601 7.6655 15.8747L63.7076 110.284Z"
      />
      <path
        fill="url(#supabase-b)"
        fillOpacity=".2"
        d="M63.7076 110.284c-2.8595 3.601-8.6574 1.628-8.7263-2.97l-1.0075-67.2513h45.2197c8.1905 0 12.7585 9.4601 7.6655 15.8747L63.7076 110.284Z"
      />
      <path
        fill="#3ECF8E"
        d="M45.317 2.071c2.8595-3.6014 8.6575-1.628 8.7264 2.97l.4415 67.2512H9.8311c-8.1907 0-12.7588-9.4601-7.6656-15.8747L45.317 2.071Z"
      />
      <defs>
        <linearGradient
          id="supabase-a"
          x1="53.9738"
          x2="94.1635"
          y1="54.974"
          y2="71.8295"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#249361" />
          <stop offset="1" stopColor="#3ECF8E" />
        </linearGradient>
        <linearGradient
          id="supabase-b"
          x1="36.1558"
          x2="54.4844"
          y1="30.578"
          y2="65.0806"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
