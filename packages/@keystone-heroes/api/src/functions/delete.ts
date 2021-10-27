import { prisma } from "@keystone-heroes/db/prisma";

import { INTERNAL_SERVER_ERROR } from "../utils/statusCodes";
import type { RequestHandler } from "../utils/types";

type Request = {
  query: {
    reportID: string;
    key?: string;
  };
};

export const deleteHandler: RequestHandler<Request> = async (
  req,
  res,
  next
) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (
    !isDevelopment &&
    (!req.query.key || req.query.key !== process.env.ADMIN_KEY)
  ) {
    next();
    return;
  }

  const { reportID } = req.query;

  const internalReport = await prisma.report.findFirst({
    where: {
      report: reportID,
    },
    select: {
      id: true,
    },
  });

  if (!internalReport) {
    res.status(INTERNAL_SERVER_ERROR);
    res.end();
    return;
  }

  const allFightIDs = (
    await prisma.fight.findMany({
      where: {
        reportID: internalReport.id,
      },
      select: {
        id: true,
      },
    })
  ).map((fight) => fight.id);

  await prisma.playerFight.deleteMany({
    where: {
      fightID: {
        in: allFightIDs,
      },
    },
  });

  await prisma.playerConduit.deleteMany({
    where: {
      fightID: {
        in: allFightIDs,
      },
    },
  });

  await prisma.playerTalent.deleteMany({
    where: {
      fightID: {
        in: allFightIDs,
      },
    },
  });

  await prisma.playerCovenantTrait.deleteMany({
    where: {
      fightID: {
        in: allFightIDs,
      },
    },
  });

  const allPulls = (
    await prisma.pull.findMany({
      where: {
        fightID: {
          in: allFightIDs,
        },
      },
      select: {
        id: true,
      },
    })
  ).map((pull) => pull.id);

  await prisma.pullZone.deleteMany({
    where: {
      pullID: {
        in: allPulls,
      },
    },
  });

  await prisma.pullNPC.deleteMany({
    where: {
      pullID: {
        in: allPulls,
      },
    },
  });

  await prisma.event.deleteMany({
    where: {
      pullID: {
        in: allPulls,
      },
    },
  });

  await prisma.pull.deleteMany({
    where: {
      fightID: {
        in: allFightIDs,
      },
    },
  });

  await Promise.all(
    allFightIDs.map((id) => {
      return prisma.fight.delete({
        where: {
          id,
        },
      });
    })
  );

  await prisma.player.deleteMany({
    where: {
      reportID: internalReport.id,
    },
  });

  await prisma.report.delete({
    where: {
      id: internalReport.id,
    },
  });

  res.end();
};
