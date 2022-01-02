import type { NextPageContext } from "next";
import NextErrorComponent from "next/error";
import Link from "next/link";
import { useEffect } from "react";

import { sentrySettings } from "../api/utils/sentrySettings";
import { concern } from "../web/styles/bears";

type ErrorProps = {
  statusCode: number;
  hasGetInitialPropsRun: boolean;
  err?: Error;
};

export default function CustomError({
  statusCode,
  hasGetInitialPropsRun,
  err,
}: ErrorProps): JSX.Element {
  useEffect(() => {
    if (!hasGetInitialPropsRun && err) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises, promise/prefer-await-to-then
      import(/* webpackChunkName: "sentry.react" */ "@sentry/react").then(
        (mod) => {
          mod.init(sentrySettings);
          // getInitialProps is not called in case of
          // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
          // err via _app.js so it can be captured
          mod.captureException(err);
        }
      );
      // Flushing is not required in this case as it only happens on the client
    }
  }, [hasGetInitialPropsRun, err]);

  return (
    <div className="flex flex-col items-center justify-center w-full px-16 py-8 m-auto xl:px-64 xl:py-32 lg:flex-row max-w-screen-2xl">
      <img
        src={concern}
        height="256"
        width="256"
        alt="An error occured! Or something."
        loading="lazy"
      />
      <div className="pt-8 lg:pl-24 lg:pt-0">
        <h1 className="font-semibold ">{statusCode}</h1>
        <p className="pt-8">You seem to be lost.</p>
        <Link href="/">
          <a className="underline">Let's stop being lost, shall we.</a>
        </Link>
      </div>
    </div>
  );
}

CustomError.getInitialProps = async (ctx: NextPageContext) => {
  const errorInitialProps = await NextErrorComponent.getInitialProps(ctx);

  const clone = {
    ...errorInitialProps,
    // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
    // getInitialProps has run
    hasGetInitialPropsRun: true,
  };

  const { captureException, flush } = await import(
    /* webpackChunkName: "sentry.react" */ "@sentry/react"
  );

  // Running on the server, the response object (`res`) is available.
  //
  // Next.js will pass an err on the server if a page's data fetching methods
  // threw or returned a Promise that rejected
  //
  // Running on the client (browser), Next.js will provide an err if:
  //
  //  - a page's `getInitialProps` threw or returned a Promise that rejected
  //  - an exception was thrown somewhere in the React lifecycle (render,
  //    componentDidMount, etc) that was caught by Next.js's React Error
  //    Boundary. Read more about what types of exceptions are caught by Error
  //    Boundaries: https://reactjs.org/docs/error-boundaries.html

  if (ctx.err) {
    captureException(ctx.err);

    // Flushing before returning is necessary if deploying to Vercel, see
    // https://vercel.com/docs/platform/limits#streaming-responses
    await flush(2000);

    return errorInitialProps;
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Sentry
  captureException(
    new Error(
      `_error.js getInitialProps missing data${
        ctx.asPath ? ` at path: ${ctx.asPath}` : ""
      }`
    )
  );
  await flush(2000);

  return clone;
};
