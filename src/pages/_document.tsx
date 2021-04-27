import Document, { Html, Head, Main, NextScript } from "next/document";
import { GiOpenChest, GiLockedChest } from "react-icons/gi";

import { Icons } from "../client/icons";

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
            <GiOpenChest id={Icons.openChest} size="1.5em" />
            <GiLockedChest id={Icons.closedChest} size="1.5em" />
          </defs>
        </svg>
      </body>
    </Html>
  );
}

CustomDocument.renderDocument = Document.renderDocument;
CustomDocument.getInitialProps = Document.getInitialProps;
