import Document, { Html, Head, Main, NextScript } from "next/document";
import { GiOpenChest, GiLockedChest } from "react-icons/gi";

import { Icons } from "../client/icons";

export default function CustomDocument(): JSX.Element {
  return (
    <Html dir="auto">
      <Head>
        <meta content="global" name="distribution" />
        <meta content="7 days" name="revisit-after" />
        <meta content="Gerrit Alex" name="author" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <svg display="none">
          <defs>
            <GiOpenChest id={Icons.openChest} height="1rem" width="1rem" />
            <GiLockedChest id={Icons.closedChest} height="1rem" width="1rem" />
          </defs>
        </svg>
      </body>
    </Html>
  );
}

CustomDocument.renderDocument = Document.renderDocument;
CustomDocument.getInitialProps = Document.getInitialProps;
