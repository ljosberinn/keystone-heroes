import type { NextComponentType, NextPageContext } from "next";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import "../styles/globals.css";
import type { NextRouter } from "next/router";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { RouteChangeIndicator } from "../components/RouteChangeIndicator";
import { StaticDataProvider } from "../context/StaticData";
import { parseWCLUrl } from "../utils";

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
  useWCLURLPaste();

  return (
    <StaticDataProvider>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <RouteChangeIndicator />
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Header />
        <div className="bg-gray-100 dark:bg-coolgray-800">
          <main className="flex flex-col w-full p-6 mx-auto lg:p-6 max-w-screen-2xl">
            <Component {...pageProps} />
          </main>
        </div>
        <Footer />
      </ThemeProvider>
    </StaticDataProvider>
  );
}

function useWCLURLPaste() {
  const { push } = useRouter();

  useEffect(() => {
    const listener = (event: ClipboardEvent) => {
      if (!event.clipboardData) {
        return;
      }

      const paste = event.clipboardData.getData("text");
      const { reportID, fightID } = parseWCLUrl(paste);

      if (reportID) {
        const nextPath = `/report/${reportID}${
          fightID ? `?fightID=${fightID}` : ""
        }`;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        push(nextPath);
      }
    };

    document.addEventListener("paste", listener);

    return () => {
      document.removeEventListener("paste", listener);
    };
  }, [push]);
}
