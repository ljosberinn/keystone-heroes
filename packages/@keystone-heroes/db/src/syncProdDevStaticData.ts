/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config();

if (!process.env.DATABASE_URL || !process.env.DATABASE_URL_PROD) {
  throw new Error("missing env vars");
}

const devDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const prodDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_PROD,
    },
  },
});

// eslint-disable-next-line no-void
void (async () => {
  console.log("loading prod data");
  const prodLegendaries = await prodDb.legendary.findMany();
  const prodConduits = await prodDb.conduit.findMany();
  const prodCovenantTraits = await prodDb.covenantTrait.findMany();
  const prodTalents = await prodDb.talent.findMany();
  const prodCooldowns = await prodDb.cooldown.findMany();

  console.log("loading dev data");

  const devLegendaries = await devDb.legendary.findMany();
  const devConduits = await devDb.conduit.findMany();
  const devCovenantTraits = await devDb.covenantTrait.findMany();
  const devTalents = await devDb.talent.findMany();
  const devCooldowns = await devDb.cooldown.findMany();

  console.log("done loading data - begin upsertion");
  console.time("upsert");

  const results = await Promise.all([
    prodDb.legendary
      .createMany({
        data: devLegendaries,
        skipDuplicates: true,
      })
      .then((result) => ({ newProdLegendaries: result.count })),
    prodDb.conduit
      .createMany({
        data: devConduits,
        skipDuplicates: true,
      })
      .then((result) => ({ newProdConduits: result.count })),
    prodDb.covenantTrait
      .createMany({
        data: devCovenantTraits,
        skipDuplicates: true,
      })
      .then((result) => ({ newProdTraits: result.count })),
    prodDb.talent
      .createMany({
        data: devTalents,
        skipDuplicates: true,
      })
      .then((result) => ({ newProdTalents: result.count })),
    prodDb.cooldown
      .createMany({
        data: devCooldowns,
        skipDuplicates: true,
      })
      .then((result) => ({ newProdCooldowns: result.count })),
    // dev
    devDb.legendary
      .createMany({
        data: prodLegendaries,
        skipDuplicates: true,
      })
      .then((result) => ({ newDevLegendaries: result.count })),
    devDb.conduit
      .createMany({
        data: prodConduits,
        skipDuplicates: true,
      })
      .then((result) => ({ newDevConduits: result.count })),
    devDb.covenantTrait
      .createMany({
        data: prodCovenantTraits,
        skipDuplicates: true,
      })
      .then((result) => ({ newDevTraits: result.count })),
    devDb.talent
      .createMany({
        data: prodTalents,
        skipDuplicates: true,
      })
      .then((result) => ({ newDevTalents: result.count })),
    devDb.cooldown
      .createMany({
        data: prodCooldowns,
        skipDuplicates: true,
      })
      .then((result) => ({ newDevCooldowns: result.count })),
  ]);

  console.log(results);

  console.timeEnd("upsert");

  console.log("done upserting");
  console.log("disconnecting dev db");
  await devDb.$disconnect();
  console.log("disconnecting prod db");
  await prodDb.$disconnect();
})();
