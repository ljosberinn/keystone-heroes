import Head from "next/head";
import { useRouter } from "next/router";

export const logoVersion = "?v2";
export const defaultTitle = "Keystone Heroes";
export const extendedTitle = `${defaultTitle} - Mythic+ Log Analysis`;
export const defaultDescription =
  "In-depth analysis for Mythic+ runs based on Warcraft Logs including routes, cooldown usage and other improvement vectors.";
export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://keystone-heroes.com";
export const logo = `${url}/summary_large_image.png`;

type SeoProps = {
  title?: string;
  description?: string;
  image?: string;
  children?: JSX.Element | JSX.Element[];
};

export function Seo({
  description = defaultDescription,
  image = "/summary_large_image.png",
  title,
  children,
}: SeoProps): JSX.Element {
  const { asPath } = useRouter();

  const suffixedTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const absoluteUrl = `${url}${asPath}`;
  const absoluteImageUrl = `${url}${image}`;

  return (
    <Head>
      <title key="title">{suffixedTitle}</title>
      <meta key="twitter:title" name="twitter:title" content={suffixedTitle} />
      <meta key="og:title" property="og:title" content={suffixedTitle} />

      <meta
        key="twitter:description"
        name="twitter:description"
        content={description}
      />
      <meta
        key="twitter:image"
        name="twitter:image"
        content={absoluteImageUrl}
      />
      <meta
        key="twitter:image:alt"
        name="twitter:image:alt"
        content={suffixedTitle}
      />

      <meta key="og:url" property="og:url" content={absoluteUrl} />
      <meta name="twitter:url" content={absoluteUrl} />

      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:image" property="og:image" content={absoluteImageUrl} />
      <meta
        key="og:image:alt"
        property="og:image:alt"
        content={suffixedTitle}
      />

      <link rel="canonical" key="canonical" href={absoluteUrl} />
      {children}
    </Head>
  );
}
