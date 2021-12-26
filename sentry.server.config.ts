import { init } from "@sentry/nextjs";

import { sentrySettings } from "./src/api/utils/sentrySettings";

init(sentrySettings);
