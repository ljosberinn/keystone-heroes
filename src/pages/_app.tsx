import type { NextComponentType, NextPageContext } from "next";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import "../web/styles/globals.css";
import type { NextRouter } from "next/router";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Footer } from "../web/components/Footer";
import { Header } from "../web/components/Header";
import { RouteChangeIndicator } from "../web/components/RouteChangeIndicator";
import { description, logo, extendedTitle } from "../web/seo";
import { useReportStore } from "../web/store";
import { parseWCLUrl } from "../web/utils";

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
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <title>Keystone Heroes</title>
        <meta
          key="og-description"
          property="og:description"
          content={description}
        />
        <meta key="og-image" property="og:image" content={logo} />
        <meta
          key="og-image-alt"
          property="og:image:alt"
          content={extendedTitle}
        />
      </Head>
      <RouteChangeIndicator />
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Header />
        <div className="bg-stone-100 dark:bg-gray-800">
          <main className="flex flex-col">
            <Component {...pageProps} />
          </main>
        </div>
        <Footer />
      </ThemeProvider>
    </>
  );
}

function useWCLURLPaste() {
  const { push } = useRouter();
  const setSelectedPull = useReportStore((state) => state.setSelectedPull);

  useEffect(() => {
    const listener = (event: ClipboardEvent) => {
      if (!event.clipboardData) {
        return;
      }

      const paste = event.clipboardData.getData("text").trim();
      const { reportID, fightID } = parseWCLUrl(paste);

      if (reportID) {
        const nextPath = `/report/${reportID}${
          fightID ? `?fightID=${fightID}` : ""
        }`;
        // always reset to first pull
        setSelectedPull(1);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        push(nextPath);
      }
    };

    document.addEventListener("paste", listener);

    return () => {
      document.removeEventListener("paste", listener);
    };
  }, [push, setSelectedPull]);
}
