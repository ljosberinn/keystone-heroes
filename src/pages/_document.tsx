import Document, { Html, Head, Main, NextScript } from "next/document";

import { icons } from "../client/icons";

export default function CustomDocument(): JSX.Element {
  return (
    <Html
      dir="auto"
      lang="en"
      className="antialiased bg-coolgray-800 text-coolgray-200"
    >
      <Head>
        <meta content="global" name="distribution" />
        <meta content="7 days" name="revisit-after" />
        <meta content="Gerrit Alex" name="author" />
        <link rel="preconnect" href="https://assets.rpglogs.com/" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <svg display="none">
          <defs>
            {Object.values(icons).map(({ component: Component, id }) => (
              <Component id={id} size="1.5em" key={id} />
            ))}
          </defs>
        </svg>
      </body>
    </Html>
  );
}

CustomDocument.renderDocument = Document.renderDocument;
CustomDocument.getInitialProps = Document.getInitialProps;
