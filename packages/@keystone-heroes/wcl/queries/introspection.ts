import { config } from "dotenv";
import { writeFileSync } from "fs";
import { getIntrospectionQuery, printSchema, buildClientSchema } from "graphql";
import { resolve } from "path";

import { getGqlClient } from "../client";

import type { IntrospectionQuery } from "graphql";

if (!process.env.DATABASE_URL) {
  // eslint-disable-next-line no-console
  console.log(`
  Loading .env from "@keystone-heroes/env/.env" (rel. path: "../env/.env").
  
  If this crashes, make sure the file is present.
  `);
  config({
    path: "../env/.env",
  });

  // eslint-disable-next-line no-console
  console.log("Loaded .env successfully!");
}

async function loadSchema() {
  const client = await getGqlClient();

  const response = await client.request<IntrospectionQuery>(
    getIntrospectionQuery()
  );

  const schema = printSchema(buildClientSchema(response));

  const targetPath = resolve("gql/schema.graphql");
  writeFileSync(targetPath, schema);
}

loadSchema()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("[@keystone-heroes/wcl] gql schema loaded");
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
  })
  // eslint-disable-next-line no-console
  .catch(console.error);
