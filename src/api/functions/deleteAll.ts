/* eslint-disable no-console */
import { prisma } from "../../db/prisma";
import type { RequestHandler } from "../utils/types";

type Request = {
  query: {
    key?: string;
  };
};

export const deleteAllHandler: RequestHandler<Request> = async (
  req,
  res,
  next
) => {
  if (
    process.env.NODE_ENV !== "development" &&
    (!req.query.key || req.query.key !== process.env.ADMIN_KEY)
  ) {
    next();
    return;
  }

  console.time("report.findMany");
  const allReports = (
    await prisma.report.findMany({
      select: {
        id: true,
      },
    })
  ).map((report) => report.id);
  console.timeEnd("report.findMany");

  console.log(`found ${allReports.length} reports`);

  console.time("fight.findMany");
  const allFightIDs = (
    await prisma.fight.findMany({
      where: {
        reportID: {
          in: allReports,
        },
      },
      select: {
        id: true,
      },
    })
  ).map((fight) => fight.id);
  console.timeEnd("fight.findMany");

  console.log(`found ${allFightIDs.length} fights`);

  console.time("playerFight.deleteMany");
  await prisma.playerFight.deleteMany({
    where: {
      fightID: {
        in: allFightIDs,
      },
    },
  });
  console.timeEnd("playerFight.deleteMany");

  console.time("playerConduit.deleteMany");
  await prisma.playerConduit.deleteMany({
    where: {
      fightID: {
        in: allFightIDs,
      },
    },
  });
  console.timeEnd("playerConduit.deleteMany");

  console.time("playerTalent.deleteMany");
  await prisma.playerTalent.deleteMany({
    where: {
      fightID: {
        in: allFightIDs,
      },
    },
  });
  console.timeEnd("playerTalent.deleteMany");

  console.time("playerCovenantTrait.deleteMany");
  await prisma.playerCovenantTrait.deleteMany({
    where: {
      fightID: {
        in: allFightIDs,
      },
    },
  });
  console.timeEnd("playerCovenantTrait.deleteMany");

  console.time("playerLegendary.deleteMany");
  await prisma.playerLegendary.deleteMany({
    where: {
      fightID: {
        in: allFightIDs,
      },
    },
  });
  console.timeEnd("playerLegendary.deleteMany");

  console.time("pull.findMany");
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
  console.timeEnd("pull.findMany");

  console.log(`found ${allPulls.length} pulls`);

  console.time("pullZone.deleteMany");
  await prisma.pullZone.deleteMany({
    where: {
      pullID: {
        in: allPulls,
      },
    },
  });
  console.timeEnd("pullZone.deleteMany");

  console.time("pullNPC.deleteMany");
  await prisma.pullNPC.deleteMany({
    where: {
      pullID: {
        in: allPulls,
      },
    },
  });
  console.timeEnd("pullNPC.deleteMany");

  console.time("event.deleteMany");
  await prisma.event.deleteMany({
    where: {
      pullID: {
        in: allPulls,
      },
    },
  });
  console.timeEnd("event.deleteMany");

  console.time("pull.deleteMany");
  await prisma.pull.deleteMany({
    where: {
      fightID: {
        in: allFightIDs,
      },
    },
  });
  console.timeEnd("pull.deleteMany");

  console.time("fight.deleteMany");
  await prisma.fight.deleteMany({
    where: {
      id: {
        in: allFightIDs,
      },
    },
  });
  console.timeEnd("fight.deleteMany");

  console.time("player.deleteMany");
  await prisma.player.deleteMany({
    where: {
      reportID: {
        in: allReports,
      },
    },
  });
  console.timeEnd("player.deleteMany");

  console.time("report.deleteMany");
  await prisma.report.deleteMany({
    where: {
      id: {
        in: allReports,
      },
    },
  });
  console.timeEnd("report.deleteMany");

  res.end();
};
