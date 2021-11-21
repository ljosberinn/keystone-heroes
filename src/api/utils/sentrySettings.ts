export const sentrySettings = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production",
  release: process.env.NEXT_PUBLIC_COMMIT_SHA,
};
