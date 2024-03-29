// @ts-check
const { withSentryConfig } = require("@sentry/nextjs");

const date = new Date();

/**
 * @type {import('next/dist/server/config-shared').NextConfig}
 **/
const config = {
  typescript: {
    /**
     * `yarn lint:types` ran in CI already so we can safely assume no errors
     *  here, conveniently reducing build time by ~55%
     * @see https://nextjs.org/docs/api-reference/next.config.js/ignoring-typescript-errors
     */
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  env: {
    // Make the COMMIT_SHA available to the client so that Sentry events can be
    // marked for the release they belong to. It may be undefined if running
    // outside of Vercel
    NEXT_PUBLIC_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
    NEXT_PUBLIC_BUILD_TIME: date.toISOString(),
    NEXT_PUBLIC_BUILD_TIMESTAMP: Number(date).toString(),
  },
  experimental: {
    reactRoot: true,
  },
  webpack: (config, options) => {
    // disables transpiling all `__tests__` files, speeding up build process
    // this reduces build time by ~ 25%
    config.plugins.push(
      new options.webpack.IgnorePlugin({ resourceRegExp: /\/__tests__\//u })
    );

    return config;
  },
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  swcMinify: true,
};

// https://securityheaders.com
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' data: wow.zamimg.com${
    process.env.NODE_ENV === "development"
      ? " 'unsafe-inline' 'unsafe-eval'"
      : ""
  };
  child-src *.youtube.com *.google.com *.twitter.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com wow.zamimg.com;
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self' fonts.gstatic.com;
`;

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/gu, ""),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  // Opt-out of Google FLoC: https://amifloced.org/
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

// @ts-expect-error sentry doesn't use the correct types
module.exports = withSentryConfig(config, {
  // disable in dev as its noisy in the console on basically every reload
  silent: process.env.NODE_ENV === "development",
  // we want reporting, but not actually create a release when building locally
  dryRun: typeof process.env.VERCEL === "undefined",
});
