import type { WCLOAuthResponse } from "@keystone-heroes/db/wcl";
import { setWCLAuthentication } from "@keystone-heroes/db/wcl";
import { getWCLAuthentication } from "@keystone-heroes/db/wcl";
import {
  WCL_CLIENT_ID,
  WCL_CLIENT_SECRET,
  WCL_GQL_ENDPOINT,
  WCL_OAUTH_ENDPOINT,
} from "@keystone-heroes/env";
import { GraphQLClient } from "graphql-request";

import { getSdk } from "./types";
import type { Sdk } from "./types";

type Cache = {
  sdk: Sdk | null;
  client: GraphQLClient | null;
  expiresAt: number | null;
};

const cache: Cache = {
  sdk: null,
  client: null,
  expiresAt: null,
};

export const getCachedSdk = async (): Promise<Sdk> => {
  if (cache.sdk) {
    return cache.sdk;
  }

  const client = await getGqlClient();
  cache.sdk = cache.sdk ?? getSdk(client);

  return cache.sdk;
};

export const getGqlClient = async (): Promise<GraphQLClient> => {
  if (
    cache.client &&
    cache.expiresAt &&
    cache?.expiresAt > Date.now() + 60 * 1000
  ) {
    return cache.client;
  }

  const cached = await getWCLAuthentication();

  if (cached?.token && cached?.expiresAt && !cache.client && !cache.expiresAt) {
    const { token, expiresAt } = cached;

    cache.client = new GraphQLClient(WCL_GQL_ENDPOINT, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    cache.expiresAt = expiresAt * 1000;

    return cache.client;
  }

  try {
    const body = new URLSearchParams({
      client_id: WCL_CLIENT_ID,
      client_secret: WCL_CLIENT_SECRET,
      grant_type: "client_credentials",
    }).toString();

    const response = await fetch(WCL_OAUTH_ENDPOINT, {
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
        new GraphQLClient(WCL_GQL_ENDPOINT, {
          headers: {
            authorization: `Bearer ${json.access_token}`,
          },
        });

      cache.expiresAt = cache.expiresAt ?? Date.now() + json.expires_in;

      return cache.client;
    }

    throw new Error("unable to authenticate with WCL");
  } catch {
    throw new Error("unable to authenticate with WCL");
  }
};
