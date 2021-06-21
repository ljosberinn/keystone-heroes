import Document, { Html, Head, Main, NextScript } from "next/document";

import { icons } from "../icons";

export default function CustomDocument(/* props: DocumentProps*/): JSX.Element {
  return (
    <Html dir="auto" lang="en" className="antialiased">
      <Head>
        <meta content="global" name="distribution" />
        <meta content="7 days" name="revisit-after" />
        <meta content="Gerrit Alex" name="author" />
        <link rel="preconnect" href="https://assets.rpglogs.com/" />
      </Head>
      <body className="dark:bg-coolgray-800 dark:text-coolgray-200">
        <Main />
        <NextScript />
        <svg className="hidden">
          <defs>
            {Object.values(icons).map(({ component: Component, id }) => (
              <Component id={id} size="1em" key={id} />
            ))}
          </defs>
        </svg>
      </body>
    </Html>
  );
}

CustomDocument.renderDocument = Document.renderDocument;
CustomDocument.getInitialProps = Document.getInitialProps;
