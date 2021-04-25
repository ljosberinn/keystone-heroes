import type { NextComponentType, NextPageContext } from "next";
import type { NextRouter } from "next/router";

import "tailwindcss/tailwind.css";
import { Footer } from "../client/components/Footer";
import { Header } from "../client/components/Header";

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
  return (
    <>
      <div className="bg-yellow-600 h-2" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-6xl xl:px-0">
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  );
}
