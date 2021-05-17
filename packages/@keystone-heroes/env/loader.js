const { config } = require("dotenv");

if (!process.env.DATABASE_URL) {
  // eslint-disable-next-line no-console
  console.log(`[@keystone-heroes/env] Initializing .env`);

  config({ path: "../env/.env" });

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "[@keystone-heroes/env] dotenv initialized, but env variables are missing"
    );
  }

  // eslint-disable-next-line no-console
  console.log("[@keystone-heroes/env] Successfully loaded .env");
}
