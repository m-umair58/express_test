const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://997581922b2bf5f71b535ef0edc0fb29@o4508161644429312.ingest.de.sentry.io/4508166404833360",
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});