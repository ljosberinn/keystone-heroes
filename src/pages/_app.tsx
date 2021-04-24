import type { NextComponentType, NextPageContext } from "next";
import type { NextRouter } from "next/router";

import "tailwindcss/tailwind.css";

export type AppRenderProps = {
  pageProps: Record<string, unknown>;
  err?: Error;
  Component: NextComponentType<
    NextPageContext,
    Record<string, unknown>,
    Record<string, unknown>
  >;
  router: NextRouter;
};

export default function App({
  Component,
  pageProps,
}: AppRenderProps): JSX.Element {
  return <Component {...pageProps} />;
}
