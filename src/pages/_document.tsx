import { Html, Head, Main, NextScript } from "next/document";

// eslint-disable-next-line import/no-namespace
import * as icons from "../web/icons";

const title = "Keystone Heroes";
const description =
  "In-depth analysis for Mythic+ runs based on WarcraftLogs including routes, cooldown usage and improvement vectors.";

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

        <script async src="https://wow.zamimg.com/widgets/power.js" />

        <meta itemProp="name" content={title} />
        <meta itemProp="description" content={description} />
        <meta property="image:alt" content={description} />

        <meta property="og:url" content="https://keystone-heroes.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:image:alt" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={title} />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@gerrit_alex" />
        <meta name="twitter:url" content="https://keystone-heroes.com/" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image:alt" content={title} />

        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#111827" />
        <meta name="msapplication-TileColor" content="#111827" />
        <meta name="theme-color" content="#111827" />
      </Head>
      <body className="bg-white dark:bg-coolgray-900 dark:text-coolgray-200">
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