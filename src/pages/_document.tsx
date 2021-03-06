import { Html, Head, Main, NextScript } from "next/document";

import {
  logoVersion,
  defaultDescription,
  defaultTitle,
} from "../web/components/Seo";
// eslint-disable-next-line import/no-namespace
import * as icons from "../web/icons";

export default function CustomDocument(/* props: DocumentProps*/): JSX.Element {
  return (
    <Html dir="auto" lang="en" className="antialiased">
      <Head>
        <meta content="global" name="distribution" />
        <meta content="7 days" name="revisit-after" />
        <meta content="Gerrit Alex" name="author" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap"
        />

        <meta name="description" content={defaultDescription} />

        <meta property="og:type" content="website" />

        <meta property="og:site_name" content={defaultTitle} />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@gerrit_alex" />
        <meta name="twitter:site" content="@gerrit_alex" />

        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />

        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`/apple-touch-icon.png${logoVersion}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`/favicon-32x32.png${logoVersion}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`/favicon-16x16.png${logoVersion}`}
        />
        <link rel="manifest" href={`/site.webmanifest${logoVersion}`} />
        <link
          rel="mask-icon"
          href={`/safari-pinned-tab.svg${logoVersion}`}
          color="#111827"
        />
        <meta name="msapplication-TileColor" content="#111827" />
        <meta name="theme-color" content="#111827" />
      </Head>
      <body className="bg-white dark:bg-gray-900 dark:text-gray-200">
        <Main />
        <NextScript />
        <svg className="hidden">
          <defs>
            {Object.values(icons).map(({ component: Component, id }) => (
              <Component id={id} size="100%" key={id} />
            ))}
          </defs>
        </svg>
      </body>
    </Html>
  );
}
