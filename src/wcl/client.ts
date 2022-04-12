import type { WCLAuth } from "@prisma/client";
import { GraphQLClient } from "graphql-request";
import fetch from "node-fetch";

import type { WCLOAuthResponse } from "./auth";
import { getWCLAuthentication, setWCLAuthentication } from "./auth";
import { getSdk } from "./types";
import type { Sdk } from "./types";

type Cache = {
  sdk: Sdk | null;
  client: GraphQLClient | null;
  expiresAt: number | null;
  pending: boolean;
};

const cache: Cache = {
  sdk: null,
  client: null,
  expiresAt: null,
  pending: false,
};

export const getCachedSdk = async (): Promise<Sdk> => {
  if (cache.sdk) {
    return cache.sdk;
  }

  const client = await getGqlClient();
  cache.sdk = cache.sdk ?? getSdk(client);

  return cache.sdk;
};

const FIVE_DAYS_IN_SECONDS = 5 * 24 * 60 * 60;

const mustRefreshToken = (expiresAt: NonNullable<WCLAuth["expiresAt"]>) => {
  const now = Math.floor(Date.now() / 1000);

  return expiresAt <= now || expiresAt - now <= FIVE_DAYS_IN_SECONDS;
};

export const getGqlClient = async (): Promise<GraphQLClient> => {
  if (
    // in test, `getWLAuthentication` returns mock data
    process.env.NODE_ENV !== "test" &&
    (!process.env.WCL_CLIENT_ID || !process.env.WCL_CLIENT_SECRET)
  ) {
    throw new Error("missing WCL environment variables");
  }

  if (cache.pending) {
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    return getGqlClient();
  }

  if (cache.client && cache.expiresAt && !mustRefreshToken(cache.expiresAt)) {
    return cache.client;
  }

  cache.pending = true;
  const persisted = await getWCLAuthentication();

  if (
    persisted?.token &&
    persisted.expiresAt &&
    !mustRefreshToken(persisted.expiresAt) &&
    !cache.client &&
    !cache.expiresAt
  ) {
    cache.client = new GraphQLClient(
      "https://www.warcraftlogs.com/api/v2/client",
      {
        headers: {
          authorization: `Bearer ${persisted.token}`,
        },
        fetch: global.fetch,
      }
    );

    cache.expiresAt = persisted.expiresAt * 1000;
    cache.pending = false;

    return cache.client;
  }

  try {
    const body = new URLSearchParams({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      client_id: process.env.WCL_CLIENT_ID!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      client_secret: process.env.WCL_CLIENT_SECRET!,
      grant_type: "client_credentials",
    }).toString();

    const response = await fetch("https://www.warcraftlogs.com/oauth/token", {
      body,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.ok) {
      const json: WCLOAuthResponse = await response.json();

      await setWCLAuthentication(json);

      cache.client =
        cache.client ??
        new GraphQLClient("https://www.warcraftlogs.com/api/v2/client", {
          headers: {
            authorization: `Bearer ${json.access_token}`,
          },
          fetch: global.fetch,
        });

      cache.expiresAt = cache.expiresAt ?? Date.now() + json.expires_in;

      return cache.client;
    }

    throw new Error("unable to authenticate with WCL");
  } catch {
    throw new Error("unable to authenticate with WCL");
  }
};
