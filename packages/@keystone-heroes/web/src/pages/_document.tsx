import { Html, Head, Main, NextScript } from "next/document";

// eslint-disable-next-line import/no-namespace
import * as icons from "../icons";

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
