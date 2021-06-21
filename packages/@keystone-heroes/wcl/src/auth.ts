import { prisma } from "@keystone-heroes/db/prisma";
import type { WCLAuth } from "@keystone-heroes/db/types";

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

export const getWCLAuthentication = (): Promise<WCLAuth | null> => {
  if (process.env.NODE_ENV === "test") {
    return Promise.resolve({
      id: 1,
      token: "mock-token",
      expiresAt: Date.now() + 28 * 24 * 60 * 60 * 1000,
    });
  }

  return prisma.wCLAuth.findFirst();
};
