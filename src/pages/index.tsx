// import Link from "next/link";
import { useRouter } from "next/router";
import type { FormEvent, ChangeEvent } from "react";
import { useState } from "react";

import { ExternalLink } from "../web/components/ExternalLink";
import { MIN_KEYSTONE_LEVEL } from "../web/env";
import {
  ReportParseError,
  reportParseErrorMap,
  reportParseErrorIconMap,
  parseWCLUrl,
} from "../web/utils";
import { classnames } from "../web/utils/classnames";
// import { defaultQueryParams, url as discoverUrl } from "./routes/discover";

export default function Home(): JSX.Element | null {
  return (
    <div className="relative flex flex-col items-center justify-center w-full px-5 py-24 sm:py-32 sm:min-h-screen">
      <BackgroundImage />
      <div className="relative z-10 flex flex-col items-center justify-center max-w-screen-lg pb-8">
        <h1 className="text-2xl font-semibold text-center lg:text-5xl sm:text-3xl leading-tighter max-w-[16ch]">
          Analyse Mythic+ Logs In The Blink Of An Eye
        </h1>
        <h2 className="pt-3 pb-10 text-sm leading-tight text-center text-yellow-600 dark:text-yellow-400 lg:text-xl sm:text-base ">
          stop guessing what you could improve or what went wrong - gain some
          actual insight for once
        </h2>
        <Form />
        <p className="max-w-sm pt-10 text-xs text-center text-gray-800 dark:text-gray-200 sm:text-sm">
          Enter any Warcraft Logs report link that includes Mythic+ runs on
          level {MIN_KEYSTONE_LEVEL} or higher. You can paste an URL anywhere!
        </p>

        <p className="pt-10 text-2xl font-semibold leading-tight">OR</p>

        <div className="w-full pt-10 sm:w-auto">
          {/* <Link href={createInternalUrl(discoverUrl, defaultQueryParams)}> */}
          {/* <a> */}
          <button
            disabled
            type="button"
            className="sm:mt-0 bg-blue-600 w-full sm:min-w-[140px] text-center dark:hover:bg-blue-500 hover:bg-blue-500 rounded-lg px-4 sm:py-3 py-4 text-white font-medium text-sm flex-shrink-0 flex items-center justify-center transition-all ease-in-out duration-200 group focus:outline-none outline-none focus:ring-2 focus:ring-blue-700 focus:bg-blue-500 dark:focus:ring-blue-300 relative z-10"
          >
            Discover Routes (coming soon)
          </button>
          {/* </a> */}
          {/* </Link> */}
        </div>

        <p className="max-w-sm pt-10 text-xs text-center text-gray-800 dark:text-gray-200 sm:text-sm">
          Explore previously imported routes and filter by dungeon, key level,
          legendary, spec, group composition and more!
        </p>

        <p className="max-w-sm pt-20 text-xs text-center text-gray-800 sm:pt-60 dark:text-gray-200 sm:text-sm">
          Wondering how to start logging yourself?
          <br />
          <ExternalLink
            className="underline"
            href="https://www.warcraftlogs.com/help/start"
          >
            Check out Warcraft Logs help!
          </ExternalLink>
        </p>
      </div>
    </div>
  );
}

function BackgroundImage() {
  return (
    <div className="absolute inset-0">
      <style jsx>
        {`
          @keyframes change-opacity {
            0% {
              opacity: 0.1;
            }

            50% {
              opacity: 0.2;
            }

            100% {
              opacity: 0.1;
            }
          }

          .with-animation {
            animation: change-opacity 15s infinite ease-in-out;
            will-change: opacity;
          }

          @media (prefers-reduced-motion) {
            .with-animation {
              animation: unset;
            }
          }
        `}
      </style>
      <img
        src="static/index-backgrounds/91.jpg"
        className="object-cover w-full h-full opacity-10 with-animation"
        alt=""
      />
    </div>
  );
}

function Form() {
  const { push } = useRouter();
  const [{ url, error }, setState] = useState<{
    error: ReportParseError | null;
    url: string;
  }>({
    url: "",
    error: null,
  });

  // only present for the case the window paste event in _app doesn't work
  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { reportID, fightID, error } = parseWCLUrl(url);

    setState((prev) => ({ ...prev, error }));

    if (reportID) {
      const nextPath = `/report/${reportID}${
        fightID ? `?fightID=${fightID}` : ""
      }`;

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      push(nextPath);
    }
  }

  return (
    <form className="w-full max-w-xl" onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row">
        <div className="relative flex items-center w-full text-gray-400 dark:text-white">
          <img
            src="/static/icons/wcl.png"
            className="absolute w-5 h-5 left-3"
            aria-hidden="true"
            alt=""
            width="64"
            height="64"
          />
          <input
            type="text"
            name="report"
            placeholder="Warcraft Logs Report URL"
            className="block w-full py-3 pl-10 text-black placeholder-gray-500 bg-transparent border-2 border-gray-500 rounded-lg shadow-sm outline-none dark:placeholder-gray-400 sm:border-r-0 dark:border-coolgray-700 sm:rounded-r-none dark:text-white focus:outline-none focus:ring-0 dark:focus:border-blue-500 focus:border-blue-500"
            required
            aria-labelledby="report-label"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const url = event.target.value.trim();
              setState((prev) => ({ ...prev, error: null, url }));
            }}
          />
        </div>
        <button
          type="submit"
          id="report-label"
          className="sm:mt-0 mt-4 bg-blue-600 min-w-[140px] text-center dark:hover:bg-blue-500 hover:bg-blue-500 sm:rounded-l-none rounded-lg px-4 sm:py-3 py-4 text-white font-medium text-sm flex-shrink-0 flex items-center justify-center transition-all ease-in-out duration-200 group focus:outline-none outline-none focus:ring-2 focus:ring-blue-700 focus:bg-blue-500 dark:focus:ring-blue-300 relative z-10"
        >
          Start Improving
        </button>
      </div>

      {error ? (
        <div className="flex items-center justify-center pt-2 space-x-4">
          <img
            src={reportParseErrorIconMap[error]}
            loading="lazy"
            width="48"
            height="48"
            className={classnames(
              "w-12 h-12",
              error === ReportParseError.INVALID_HOST && "-scale-x-100"
            )}
            alt="An error occured:"
          />

          <p className="text-center text-red-500 dark:text-red-400">
            {reportParseErrorMap[error]}
          </p>
        </div>
      ) : null}
    </form>
  );
}
