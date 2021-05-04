import type { WCLAuth } from "@prisma/client";

import type { WCLOAuthResponse } from "../gqlClient";
import { prisma } from "../prismaClient";

export const WCLAuthRepo = {
  upsert: async ({
    access_token,
    expires_in,
  }: WCLOAuthResponse): Promise<void> => {
    // eslint-disable-next-line no-console
    console.info("[WCLAuthRepo/upsert] storing");

    const payload = {
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
  },
  load: (): Promise<WCLAuth | null> => prisma.wCLAuth.findFirst(),
};
