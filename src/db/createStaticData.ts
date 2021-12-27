/* eslint-disable sonarjs/no-duplicate-string */
import { config } from "dotenv";
import { writeFileSync, existsSync, createWriteStream, unlinkSync } from "fs";
import { get } from "https";
import { resolve } from "path";

import { BURSTING } from "../wcl/queries/events/affixes/bursting";
import { EXPLOSIVE } from "../wcl/queries/events/affixes/explosive";
import { GRIEVOUS_WOUND } from "../wcl/queries/events/affixes/grievous";
import { NECROTIC } from "../wcl/queries/events/affixes/necrotic";
import { QUAKING } from "../wcl/queries/events/affixes/quaking";
import {
  SANGUINE_ICHOR_DAMAGE,
  SANGUINE_ICHOR_HEALING,
} from "../wcl/queries/events/affixes/sanguine";
import { SPITEFUL } from "../wcl/queries/events/affixes/spiteful";
import { STORMING } from "../wcl/queries/events/affixes/storming";
import {
  tormentedLieutenants,
  tormentedSpells,
  tormentedBuffsAndDebuffs,
} from "../wcl/queries/events/affixes/tormented";
import { VOLCANIC } from "../wcl/queries/events/affixes/volcanic";
import { CHEAT_DEATHS } from "../wcl/queries/events/cheathDeath";
import { SHARED_COVENANT_ABILITIES } from "../wcl/queries/events/covenant";
import { DOS_URN, DOS_URN_OPENING } from "../wcl/queries/events/dungeons/dos";
import { HOA_GARGOYLE } from "../wcl/queries/events/dungeons/hoa";
import {
  ENVELOPMENT_OF_MISTS,
  MOTS_OPENING,
} from "../wcl/queries/events/dungeons/mots";
import { NW } from "../wcl/queries/events/dungeons/nw";
import { PF } from "../wcl/queries/events/dungeons/pf";
import {
  SD_LANTERN_OPENING,
  SD_LANTERN_BUFF,
  SD_ZRALI_SHIELD,
  SD_ZRALI_SHIELD_BUFF,
  SD_ZRALI_SHIELD_CAST,
} from "../wcl/queries/events/dungeons/sd";
import { SOA_SPEAR, SOA_OPENING } from "../wcl/queries/events/dungeons/soa";
import {
  TOP_BANNER_AURA,
  TOP_OPENING,
} from "../wcl/queries/events/dungeons/top";
import { TRINKETS } from "../wcl/queries/events/trinkets";
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
  if (process.env.NODE_ENV === "test" || !process.env.DATABASE_URL) {
    log("in test or missing env - skipping static data creation");
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

  const rawCovenantTraits = await prisma.covenantTrait.findMany({
    select: {
      name: true,
      id: true,
      icon: true,
    },
  });

  const covenantTraits = Object.fromEntries(
    rawCovenantTraits.map((covenantTrait) => {
      return [
        covenantTrait.id,
        {
          name: covenantTrait.name,
          icon: covenantTrait.icon,
        },
      ];
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

  const rawNPCs = await prisma.pullNPC.findMany({
    select: {
      npc: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const npcMap = Object.fromEntries(
    rawNPCs.map((npc) => {
      return [npc.npc.id, npc.npc.name];
    })
  );

  const dungeons = Object.fromEntries(
    rawDungeons.map((dungeon) => {
      const covenant = rawCovenants.find(
        (covenant) => covenant.name === dungeon.covenant
      );

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
          covenant: covenant ? covenant.id : null,
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

  const affixNameIdMap = Object.fromEntries(
    rawAffixes.map((affix) => [affix.name.toLowerCase(), affix.id])
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
        name: legendary.effectName,
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

  const interruptedAbilitiyIDs = await prisma.event.findMany({
    where: {
      interruptedAbilityID: {
        not: null,
      },
    },
    select: {
      interruptedAbilityID: true,
    },
  });

  const uniqueInterruptedAbilities = [
    ...new Set(
      interruptedAbilitiyIDs
        .map((interruptedAbility) => interruptedAbility.interruptedAbilityID)
        .filter((maybeNumber): maybeNumber is number => maybeNumber !== null)
    ),
  ];

  const interruptedAbilities = await prisma.ability.findMany({
    where: {
      id: {
        in: uniqueInterruptedAbilities,
        // ignore abilities interrupted by Quaking for.. obvious reasons
        notIn: Object.keys(spells).map((key) => Number.parseInt(key)),
      },
    },
    select: {
      id: true,
      name: true,
      icon: true,
    },
  });

  log(`found ${interruptedAbilities.length} interrupted abilities`);

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
    // should come first so they can be overridden by class/covenant spels below
    ...Object.fromEntries(
      interruptedAbilities.map((ability) => [
        ability.id,
        {
          name: ability.name,
          icon: ability.icon,
          cd: 0,
        },
      ])
    ),
    ...spells,
    [SHARED_COVENANT_ABILITIES.DOOR_OF_SHADOWS]: {
      name: "Door of Shadows",
      icon: "ability_venthyr_doorofshadows",
      cd: 60,
    },
    [SHARED_COVENANT_ABILITIES.SOULSHAPE]: {
      name: "Soulshape",
      icon: "ability_nightfae_flicker",
      cd: 90,
    },
    [SHARED_COVENANT_ABILITIES.SUMMON_STEWARD]: {
      name: "Summon Steward",
      icon: "ability_kyrian_summonsteward",
      cd: 300,
    },
    [SHARED_COVENANT_ABILITIES.FLESHCRAFT]: {
      name: "Fleshcraft",
      icon: "ability_necrolord_fleshcraft",
      cd: 120,
    },

    ...Object.fromEntries(
      Object.values(CHEAT_DEATHS).map((cheat) => [
        cheat.id,
        {
          name: cheat.name,
          icon: cheat.icon,
          cd: cheat.cd,
        },
      ])
    ),
    ...Object.fromEntries(
      Object.values(TRINKETS).map((trinket) => [
        trinket.id,
        {
          name: trinket.name,
          icon: trinket.icon,
          cd: trinket.cd,
        },
      ])
    ),
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
    [BURSTING.damage]: {
      name: affixes["11"].name,
      icon: affixes["11"].icon,
      cd: DUMMY_CD,
    },
    [BURSTING.debuff]: {
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
    [NW.THROW_CLEAVER]: {
      cd: DUMMY_CD,
      icon: "spell_deathknight_butcher2",
      name: "Throw Cleaver",
    },
    [NW.ORB]: {
      name: "Discharged Anima",
      icon: "spell_animabastion_orb",
      cd: DUMMY_CD,
    },
    [NW.ORB_CAST]: {
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
    [NW.KYRIAN_ORB_BUFF]: {
      name: "Anima Exhaust",
      icon: "spell_animabastion_buff",
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
    [NW.SHIELD]: {
      name: "Discarded Shield",
      icon: "inv_shield_1h_bastionquest_b_01",
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
    [TOP_OPENING]: {
      name: "Opening",
      icon: "spell_animamaldraxxus_orb",
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
    [SD_ZRALI_SHIELD]: {
      name: "Z'rali's Essence",
      icon: "inv_pet_naaru_yellow",
      cd: DUMMY_CD,
    },
    [SD_ZRALI_SHIELD_BUFF]: {
      name: "Shining Radiance",
      icon: "spell_holy_powerwordbarrier",
      cd: DUMMY_CD,
    },
    [SD_ZRALI_SHIELD_CAST]: {
      name: "Shining Radiance",
      icon: "spell_holy_powerwordbarrier",
      cd: 35,
    },
    [ENVELOPMENT_OF_MISTS]: {
      name: "Envelopment of Mists",
      icon: "ability_monk_renewingmists",
      cd: DUMMY_CD,
    },
    [MOTS_OPENING]: {
      name: "Opening",
      icon: "spell_animaardenweald_orb",
      cd: DUMMY_CD,
    },
    [SOA_SPEAR]: {
      name: "Spear of Destiny",
      icon: "inv_polearm_2h_bastionquest_b_01",
      cd: DUMMY_CD,
    },
    [SOA_OPENING]: {
      name: "Opening",
      icon: "spell_animabastion_orb",
      cd: DUMMY_CD,
    },
    [DOS_URN]: {
      name: "Haunted Urn",
      icon: "inv_misc_urn_01",
      cd: DUMMY_CD,
    },
    [DOS_URN_OPENING]: {
      name: "Opening",
      icon: "spell_animaardenweald_orb",
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

    ...Object.fromEntries(
      tormentedBuffsAndDebuffs.map((deBuff) => [
        deBuff.id,
        {
          name: deBuff.name,
          icon: deBuff.icon,
          cd: 0,
        },
      ])
    ),
  };

  const targetPath = resolve("src/web/staticData.ts");

  const template = `
/* eslint-disable sonarjs/no-duplicate-string */
const tormentedLieutenantIDs = new Set<number>(${JSON.stringify(
    tormentedLieutenants.map((lt) => lt.id)
  )});  
const allBossIDs = new Set<number>(${JSON.stringify([...allBossIDs])});
export const VOLCANIC = ${VOLCANIC};
export const BURSTING = JSON.parse(\`${JSON.stringify(BURSTING)}\`);
export const NECROTIC = ${NECROTIC};
export const GRIEVOUS = ${GRIEVOUS_WOUND};
export const EXPLOSIVE = JSON.parse(\`${JSON.stringify(EXPLOSIVE)}\`);
export const SPITEFUL = ${SPITEFUL.ability};
export const QUAKING = ${QUAKING};
export const STORMING = ${STORMING};
export const SANGUINE_ICHOR_DAMAGE = ${SANGUINE_ICHOR_DAMAGE};
export const SANGUINE_ICHOR_HEALING = ${SANGUINE_ICHOR_HEALING};
export const DUMMY_CD = ${DUMMY_CD};
export const HOA_GARGOYLE = ${HOA_GARGOYLE};
export const ENVELOPMENT_OF_MISTS = ${ENVELOPMENT_OF_MISTS};
export const SOA_SPEAR = ${SOA_SPEAR};
export const SD_LANTERN_OPENING = ${SD_LANTERN_OPENING};
export const SD_LANTERN_BUFF = ${SD_LANTERN_BUFF};
export const PF = JSON.parse(\`${JSON.stringify(PF)}\`);
export const DOS_URN = ${DOS_URN};
export const TOP_BANNER_AURA = ${TOP_BANNER_AURA};
export const NW = JSON.parse(\`${JSON.stringify(NW)}\`);

type StaticDataMap = Record<number, { name: string, icon: string }>;

export const isBoss = (id: number): boolean => allBossIDs.has(id);
export const isTormentedLieutenant = (id: number): boolean => tormentedLieutenantIDs.has(id);
export const classes: Record<number, { name: string; cooldowns: number[]; specs: { id: number; name: string; cooldowns: number[]; }[]}> = JSON.parse(\`${JSON.stringify(
    classes
  )}\`);
export const dungeons: Record<number, { name: string; slug: string; time: number; zones: {id: number; name: string; }[]; unitCountMap: Record<number, number>; count: number; covenant: number }> = JSON.parse(\`${JSON.stringify(
    dungeons
  )}\`);
export const affixes: StaticDataMap = JSON.parse(\`${JSON.stringify(
    affixes
  )}\`);
export const affixNameIdMap = JSON.parse(\`${JSON.stringify(affixNameIdMap)}\`);
export const soulbinds: Record<number, { name: string; covenantID: number}> = JSON.parse(\`${JSON.stringify(
    soulbinds
  )}\`);
export const covenants: StaticDataMap = JSON.parse(\`${JSON.stringify(
    covenants
  )}\`);
export const spells: Record<number, { icon: string; name: string; cd: number; }> = JSON.parse(\`${JSON.stringify(
    extendedSpells
  )}\`);
export const tormentedLieutenants: StaticDataMap = JSON.parse(\`${JSON.stringify(
    tormentedLieutenantMap
  )}\`);
export const tormentedPowers: Record<number, { name: string; icon: string; sourceTormentorID: number[]; }> = JSON.parse(\`${JSON.stringify(
    tormentedPowerMap
  )}\`);
export const legendaries: StaticDataMap = JSON.parse(\`${JSON.stringify(
    legendaries
  )}\`);
export const talents: StaticDataMap = JSON.parse(\`${JSON.stringify(
    talents
  )}\`);
export const conduits: StaticDataMap = JSON.parse(\`${JSON.stringify(
    conduits
  )}\`);
export const covenantTraits: StaticDataMap = JSON.parse(\`${JSON.stringify(
    covenantTraits
  )}\`);
export const npcs: Record<number, string> = JSON.parse(\`${JSON.stringify(
    npcMap
  )}\`);
`;

  log(`writing template`);

  writeFileSync(targetPath, template);

  const spellIconBasePath = resolve("public/static/icons");

  const allLoadableIcons = [
    ...Object.values(extendedSpells).map((spell) => spell.icon),
    ...tormentedLieutenants.map((lt) => lt.icon),
    ...rawAffixes.map((affix) => affix.icon),
    ...rawLegendaries.map((legendary) => legendary.effectIcon),
    ...rawTalents.map((talent) => talent.icon),
    ...rawConduits.map((conduit) => conduit.icon),
    ...rawCovenants.map((covenant) => covenant.icon),
    ...rawCovenantTraits.map((conduit) => conduit.icon),
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
