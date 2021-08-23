import type { NextComponentType, NextPageContext } from "next";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import "../styles/globals.css";
import type { NextRouter } from "next/router";

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { RouteChangeIndicator } from "../components/RouteChangeIndicator";

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
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Header />
        <main className="flex flex-col flex-grow w-full px-5 md:px-10">
          <Component {...pageProps} />
        </main>
        <Footer />
      </ThemeProvider>
    </>
  );
}
