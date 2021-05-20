// import { IS_PROD } from "@keystone-heroes/env";
// import crypto from "crypto";
import Document, { Html, Head, Main, NextScript } from "next/document";

import { icons } from "../icons";

// import type { DocumentProps } from "next/document";

// const createCSP = (props: DocumentProps) => {
//   const hash1 = crypto.createHash("sha256");
//   hash1.update(NextScript.getInlineScriptSource(props));
//   const nextDataHash = `'sha256-${hash1.digest("base64")}'`;

//   const nextThemesScript = `!function(){try {var d=document.documentElement.classList;d.remove('light','dark');var e=localStorage.getItem('theme');d.add('dark');if("system"===e||(!e&&false)){var t="(prefers-color-scheme: dark)",m=window.matchMedia(t);m.media!==t||m.matches?d.add('dark'):d.add('light')}else if(e) d.add(e)}catch(e){}}()`;
//   const hash2 = crypto.createHash("sha256");
//   hash2.update(nextThemesScript);
//   const nextThemesHash = `'sha256-${hash2.digest("base64")}'`;

//   if (!IS_PROD) {
//     return `style-src 'self' 'unsafe-inline'; font-src 'self' data:; default-src 'self'; script-src 'unsafe-eval' 'self' ${nextDataHash} ${nextThemesHash}`;
//   }

//   return `default-src 'self'; script-src 'self' ${nextDataHash} ${nextThemesHash}`;
// };

export default function CustomDocument(/* props: DocumentProps*/): JSX.Element {
  return (
    <Html dir="auto" lang="en" className="antialiased">
      <Head>
        {/* <meta httpEquiv="Content-Security-Policy" content={createCSP(props)} /> */}
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
