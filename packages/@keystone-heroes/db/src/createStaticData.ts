import { BURSTING } from "@keystone-heroes/wcl/queries/events/affixes/bursting";
import { EXPLOSIVE } from "@keystone-heroes/wcl/queries/events/affixes/explosive";
import { GRIEVOUS_WOUND } from "@keystone-heroes/wcl/queries/events/affixes/grievous";
import { NECROTIC } from "@keystone-heroes/wcl/queries/events/affixes/necrotic";
import { QUAKING } from "@keystone-heroes/wcl/queries/events/affixes/quaking";
import {
  SANGUINE_ICHOR_DAMAGE,
  SANGUINE_ICHOR_HEALING,
} from "@keystone-heroes/wcl/queries/events/affixes/sanguine";
import { SPITEFUL } from "@keystone-heroes/wcl/queries/events/affixes/spiteful";
import { STORMING } from "@keystone-heroes/wcl/queries/events/affixes/storming";
import {
  tormentedSpells,
  tormentedLieutenants,
} from "@keystone-heroes/wcl/queries/events/affixes/tormented";
import { VOLCANIC } from "@keystone-heroes/wcl/queries/events/affixes/volcanic";
import { DOS_URN } from "@keystone-heroes/wcl/queries/events/dungeons/dos";
import { HOA_GARGOYLE } from "@keystone-heroes/wcl/queries/events/dungeons/hoa";
import { ENVELOPMENT_OF_MISTS } from "@keystone-heroes/wcl/queries/events/dungeons/mots";
import { NW } from "@keystone-heroes/wcl/queries/events/dungeons/nw";
import { PF } from "@keystone-heroes/wcl/queries/events/dungeons/pf";
import {
  SD_LANTERN_BUFF,
  SD_LANTERN_OPENING,
} from "@keystone-heroes/wcl/queries/events/dungeons/sd";
import { SOA_SPEAR } from "@keystone-heroes/wcl/queries/events/dungeons/soa";
import { TOP_BANNER_AURA } from "@keystone-heroes/wcl/queries/events/dungeons/top";
import { config } from "dotenv";
import { writeFileSync, existsSync, createWriteStream, unlinkSync } from "fs";
import { get } from "https";
import { resolve } from "path";

import { allBossIDs, dungeons as rawDungeons } from "./data/dungeons";
import { spells } from "./data/spellIds";
import { prisma } from "./prisma";

config();

const log = (str: string) => {
  // eslint-disable-next-line no-console
  console.info(`[@keystone-heroes/db] ${str}`);
};

const DUMMY_CD = 9999;

async function create() {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  log("loading static data");

  const rawCovenants = await prisma.covenant.findMany({
    select: {
      name: true,
      id: true,
      icon: true,
    },
  });
  const covenants = Object.fromEntries(
    rawCovenants.map((covenant) => {
      return [covenant.id, { name: covenant.name, icon: covenant.icon }];
    })
  );

  const rawSoulbinds = await prisma.soulbind.findMany({
    select: {
      name: true,
      id: true,
      covenantID: true,
    },
  });

  const soulbinds = Object.fromEntries(
    rawSoulbinds.map((soulbind) => {
      return [
        soulbind.id,
        { name: soulbind.name, covenantID: soulbind.covenantID },
      ];
    })
  );

  const dungeons = Object.fromEntries(
    rawDungeons.map((dungeon) => {
      return [
        dungeon.id,
        {
          name: dungeon.name,
          slug: dungeon.slug,
          time: dungeon.timer[0],
          zones: dungeon.zones.map((zone) => ({
            id: zone.id,
            name: zone.name,
          })),
          unitCountMap: dungeon.unitCountMap,
          count: dungeon.count,
        },
      ];
    })
  );

  const rawAffixes = await prisma.affix.findMany({
    select: {
      name: true,
      id: true,
      icon: true,
    },
  });

  const affixes = Object.fromEntries(
    rawAffixes.map((affix) => {
      return [
        affix.id,
        {
          name: affix.name,
          icon: affix.icon,
        },
      ];
    })
  );

  const rawClasses = await prisma.class.findMany({
    select: {
      id: true,
      name: true,
      Cooldown: {
        select: {
          ability: {
            select: {
              id: true,
              icon: true,
              name: true,
            },
          },
          cd: true,
        },
      },
      Spec: {
        select: {
          id: true,
          name: true,
          role: true,
          Cooldown: {
            select: {
              ability: {
                select: {
                  id: true,
                  icon: true,
                  name: true,
                },
              },
              cd: true,
            },
          },
        },
      },
    },
  });

  const rawLegendaries = await prisma.legendary.findMany({
    select: {
      id: true,
      effectName: true,
      effectIcon: true,
    },
  });

  log(`found ${rawLegendaries.length} legendaries`);

  const legendaries = Object.fromEntries(
    rawLegendaries.map((legendary) => [
      legendary.id,
      {
        effectName: legendary.effectName,
        icon: legendary.effectIcon,
      },
    ])
  );

  const rawTalents = await prisma.talent.findMany({
    select: {
      id: true,
      icon: true,
      name: true,
    },
  });

  log(`found ${rawTalents.length} talents`);

  const talents = Object.fromEntries(
    rawTalents.map((talent) => [
      talent.id,
      {
        name: talent.name,
        icon: talent.icon,
      },
    ])
  );

  const rawConduits = await prisma.conduit.findMany({
    select: {
      id: true,
      icon: true,
      name: true,
    },
  });

  const conduits = Object.fromEntries(
    rawConduits.map((conduit) => [
      conduit.id,
      {
        name: conduit.name,
        icon: conduit.icon,
      },
    ])
  );

  log(`found ${rawConduits.length} conduits`);

  await prisma.$disconnect();
  log(`db disconnected`);

  const classes = Object.fromEntries(
    rawClasses.map((classData) => {
      return [
        classData.id,
        {
          name: classData.name,
          cooldowns: classData.Cooldown.map((cooldown) => cooldown.ability.id),
          specs: classData.Spec.map((spec) => {
            return {
              id: spec.id,
              name: spec.name,
              cooldowns: spec.Cooldown.map((cooldown) => cooldown.ability.id),
            };
          }),
        },
      ];
    })
  );

  const tormentedLieutenantMap = Object.fromEntries(
    tormentedLieutenants.map((lt) => {
      return [
        lt.id,
        {
          name: lt.name,
          icon: lt.icon,
        },
      ];
    })
  );

  const tormentedPowerMap = Object.fromEntries(
    tormentedSpells.map((spell) => {
      return [
        spell.id,
        {
          name: spell.name,
          icon: spell.icon,
          sourceTormentorID: spell.sourceTormentorID,
        },
      ];
    })
  );

  const extendedSpells = {
    ...spells,
    [SANGUINE_ICHOR_DAMAGE]: {
      name: "Sanguine Ichor",
      icon: "spell_shadow_bloodboil",
      cd: DUMMY_CD,
    },
    [SANGUINE_ICHOR_HEALING]: {
      name: "Sanguine Ichor",
      icon: "spell_shadow_bloodboil",
      cd: DUMMY_CD,
    },
    [NECROTIC]: {
      name: "Necrotic Wound",
      icon: "ability_rogue_venomouswounds",
      cd: DUMMY_CD,
    },
    [BURSTING]: {
      name: affixes["11"].name,
      icon: affixes["11"].icon,
      cd: DUMMY_CD,
    },
    [EXPLOSIVE.ability]: {
      name: affixes["13"].name,
      icon: affixes["13"].icon,
      cd: DUMMY_CD,
    },
    [STORMING]: {
      name: affixes["124"].name,
      icon: affixes["124"].icon,
      cd: DUMMY_CD,
    },
    [VOLCANIC]: {
      name: affixes["3"].name,
      icon: affixes["3"].icon,
      cd: DUMMY_CD,
    },
    [QUAKING]: {
      name: affixes["14"].name,
      icon: affixes["14"].icon,
      cd: DUMMY_CD,
    },
    [HOA_GARGOYLE]: {
      name: "Loyal Stoneborn",
      icon: "ability_revendreth_mage",
      cd: DUMMY_CD,
    },
    [NW.ORB]: {
      name: "Discharged Anima",
      icon: "spell_animabastion_orb",
      cd: DUMMY_CD,
    },
    [NW.KYRIAN_ORB_DAMAGE]: {
      name: "Anima Exhaust",
      icon: "spell_animabastion_orb",
      cd: DUMMY_CD,
    },
    [NW.KYRIAN_ORB_HEAL]: {
      name: "Anima Exhaust",
      icon: "spell_animabastion_orb",
      cd: DUMMY_CD,
    },
    [NW.SPEAR]: {
      name: "Bloody Javelin",
      icon: "inv_polearm_2h_bastionquest_b_01",
      cd: DUMMY_CD,
    },
    [NW.HAMMER]: {
      name: "Forgotten Forgehammer",
      icon: "inv_mace_1h_bastionquest_b_01",
      cd: DUMMY_CD,
    },
    [GRIEVOUS_WOUND]: {
      name: "Grievous Wound",
      icon: "ability_backstab",
      cd: DUMMY_CD,
    },
    [SPITEFUL.ability]: {
      name: "Spiteful Shade",
      icon: "ability_meleedamage",
      cd: DUMMY_CD,
    },
    [TOP_BANNER_AURA]: {
      name: "Necrolord's Chosen",
      icon: "ui_sigil_necrolord",
      cd: DUMMY_CD,
    },
    [SD_LANTERN_BUFF]: {
      name: "Sinfall Boon",
      icon: "spell_animarevendreth_buff",
      cd: DUMMY_CD,
    },
    [SD_LANTERN_OPENING]: {
      name: "Opening",
      icon: "spell_animarevendreth_orb",
      cd: DUMMY_CD,
    },
    [ENVELOPMENT_OF_MISTS]: {
      name: "Envelopment of Mists",
      icon: "ability_monk_renewingmists",
      cd: DUMMY_CD,
    },
    [SOA_SPEAR]: {
      name: "Spear of Destiny",
      icon: "inv_polearm_2h_bastionquest_b_01",
      cd: DUMMY_CD,
    },
    [DOS_URN]: {
      name: "Haunted Urn",
      icon: "inv_misc_urn_01",
      cd: DUMMY_CD,
    },
    [PF.PLAGUE_BOMB]: {
      name: "Plague Bomb",
      icon: "ability_vehicle_plaguebarrel",
      cd: DUMMY_CD,
    },
    [PF.CANISTER_VIOLENT_DETONATION]: {
      name: "Violent Detonation",
      icon: "ability_vehicle_plaguebarrel",
      cd: DUMMY_CD,
    },
    [PF.GREEN_BUFF.aura]: {
      name: "Corrosive Gunk",
      icon: "inv_misc_bone_skull_01",
      cd: DUMMY_CD,
    },
    [PF.RED_BUFF.aura]: {
      name: "Rapid Infection",
      icon: "inv_offhand_1h_artifactskulloferedar_d_05",
      cd: DUMMY_CD,
    },
    [PF.PURPLE_BUFF.aura]: {
      name: "Congealed Contagion",
      icon: "ability_titankeeper_amalgam",
      cd: DUMMY_CD,
    },
    ...Object.fromEntries(
      tormentedSpells.map((power) => [
        power.id,
        {
          name: power.name,
          icon: power.icon,
          cd: 0,
        },
      ])
    ),
  };

  const targetPath = resolve("../web/src/staticData.ts");

  const template = `
/* eslint-disable sonarjs/no-duplicate-string */
const tormentedLieutenantIDs = new Set<number>(${JSON.stringify(
    tormentedLieutenants.map((lt) => lt.id)
  )});  
const allBossIDs = new Set<number>(${JSON.stringify([...allBossIDs])});
export const VOLCANIC = ${VOLCANIC};
export const BURSTING = ${BURSTING};
export const NECROTIC = ${NECROTIC};
export const GRIEVOUS = ${GRIEVOUS_WOUND};
export const EXPLOSIVE = JSON.parse(\`${JSON.stringify(EXPLOSIVE)}\`);
export const SPITEFUL = ${SPITEFUL.ability};
export const QUAKING = ${QUAKING};
export const STORMING = ${STORMING};
export const SANGUINE_ICHOR_DAMAGE = ${SANGUINE_ICHOR_DAMAGE};
export const SANGUINE_ICHOR_HEALING = ${SANGUINE_ICHOR_HEALING};
export const TORMENTED_ABILITIES: { id: number; icon: string; name: string; }[] = JSON.parse(\`${JSON.stringify(
    tormentedSpells.map((power) => {
      return {
        id: power.id,
        name: power.name,
        icon: power.icon,
      };
    })
  )}\`);
export const DUMMY_CD = ${DUMMY_CD};
export const DOS_URN = ${DOS_URN};
export const HOA_GARGOYLE = ${HOA_GARGOYLE};
export const ENVELOPMENT_OF_MISTS = ${ENVELOPMENT_OF_MISTS};
export const SOA_SPEAR = ${SOA_SPEAR};
export const SD_LANTERN_BUFF = ${SD_LANTERN_BUFF};
export const SD_LANTERN_OPENING = ${SD_LANTERN_OPENING};
export const NW = JSON.parse(\`${JSON.stringify(NW)}\`);
export const PF = JSON.parse(\`${JSON.stringify(PF)}\`);
export const TOP_BANNER_AURA = ${TOP_BANNER_AURA};

export const isBoss = (id: number): boolean => allBossIDs.has(id);
export const isTormentedLieutenant = (id: number): boolean => tormentedLieutenantIDs.has(id);
export const classes: Record<number, { name: string; cooldowns: number[]; specs: { id: number; name: string; cooldowns: number[]; }[]}> = JSON.parse(\`${JSON.stringify(
    classes
  )}\`);
export const dungeons: Record<number, { name: string; slug: string; time: number; zones: {id: number; name: string; }[]; unitCountMap: Record<number, number>; count: number; }> = JSON.parse(\`${JSON.stringify(
    dungeons
  )}\`);
export const affixes: Record<number, { name: string; icon: string;}> = JSON.parse(\`${JSON.stringify(
    affixes
  )}\`);
export const soulbinds: Record<number, { name: string; covenantID: number}> = JSON.parse(\`${JSON.stringify(
    soulbinds
  )}\`);
export const covenants: Record<number, { name: string; icon: string;}> = JSON.parse(\`${JSON.stringify(
    covenants
  )}\`);
export const spells: Record<number, { icon: string; name: string; cd: number; }> = JSON.parse(\`${JSON.stringify(
    extendedSpells
  )}\`);
export const tormentedLieutenants: Record<number, { name: string; icon: string; }> = JSON.parse(\`${JSON.stringify(
    tormentedLieutenantMap
  )}\`);
export const tormentedPowers: Record<number, { name: string; icon: string; sourceTormentorID: number[]; }> = JSON.parse(\`${JSON.stringify(
    tormentedPowerMap
  )}\`);
export const legendaries: Record<number, { effectName: string; icon: string; }> = JSON.parse(\`${JSON.stringify(
    legendaries
  )}\`);
export const talents: Record<number, { name: string; icon: string; }> = JSON.parse(\`${JSON.stringify(
    talents
  )}\`);
export const conduits: Record<number, { name: string; icon: string }> = JSON.parse(\`${JSON.stringify(
    conduits
  )}\`);
`;

  log(`writing template`);

  writeFileSync(targetPath, template);

  const spellIconBasePath = resolve("../web/public/static/icons");

  const allLoadableIcons = [
    ...Object.values(extendedSpells).map((spell) => spell.icon),
    ...tormentedLieutenants.map((lt) => lt.icon),
    ...rawAffixes.map((affix) => affix.icon),
    ...rawLegendaries.map((legendary) => legendary.effectIcon),
    ...rawTalents.map((talent) => talent.icon),
    ...rawConduits.map((conduit) => conduit.icon),
    "inv_alchemy_80_potion02orange",
    "inv_misc_questionmark",
    "inv_misc_spyglass_03",
  ].filter((path): path is string => !!path);

  log(`verifying presence of ${allLoadableIcons.length} icons`);

  const origin = "https://wow.zamimg.com/images/wow/icons/medium/";

  await Promise.all(
    allLoadableIcons.map(async (icon) => {
      const path = resolve(spellIconBasePath, `${icon}.jpg`);
      const exists = existsSync(path);

      if (exists) {
        return Promise.resolve(true);
      }

      log(`loading ${icon}.jpg`);

      const sourcePath = `${origin}${icon}.jpg`;

      return new Promise((resolve, reject) => {
        const file = createWriteStream(path);

        get(sourcePath, (response) => {
          response.pipe(file);

          file.on("finish", () => {
            resolve(true);
            file.close();
          });

          file.on("error", (error) => {
            unlinkSync(path);
            // eslint-disable-next-line no-console
            console.error(error);
            reject(error);
          });
        });
      });
    })
  );

  log(`done creating static data`);
}

// eslint-disable-next-line no-console
create().catch(console.error);
