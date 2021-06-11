import type { WCLAuth } from "@prisma/client";

import { prisma } from "./prisma";

export * from "./transform/events";

export type WCLOAuthResponse = {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
};

export const setWCLAuthentication = async ({
  access_token,
  expires_in,
}: WCLOAuthResponse): Promise<void> => {
  const payload: Omit<WCLAuth, "id"> = {
    token: access_token,
    expiresAt: Math.round(Date.now() / 1000) + expires_in,
  };

  await prisma.wCLAuth.upsert({
    create: payload,
    where: {
      id: 1,
    },
    update: payload,
  });
};

export const getWCLAuthentication = (): Promise<WCLAuth | null> =>
  prisma.wCLAuth.findFirst();
