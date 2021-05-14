import type { NextComponentType, NextPageContext } from "next";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import type { NextRouter } from "next/router";

import "tailwindcss/tailwind.css";
import { Footer } from "../client/components/Footer";
import { Header } from "../client/components/Header";
import { RouteChangeIndicator } from "../client/components/RouteChangeIndicator";

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
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <RouteChangeIndicator />
      <div className="px-5">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Header />
          <main className="w-full flex flex-col flex-grow">
            <Component {...pageProps} />
          </main>
          <Footer />
        </ThemeProvider>
      </div>
    </>
  );
}
