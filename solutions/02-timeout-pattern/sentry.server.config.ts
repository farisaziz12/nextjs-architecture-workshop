// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://7c22834a4fd68fba4d131a7c52ce5280@o4507364114956288.ingest.de.sentry.io/4507364116594768",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
  spotlight: process.env.NODE_ENV === "development",
  integrations: [
    // Add profiling integration to list of integrations
    nodeProfilingIntegration(),
  ],
});
