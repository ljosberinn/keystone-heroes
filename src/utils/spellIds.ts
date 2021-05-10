import { classes } from "../../prisma/classes";

const NW_KYRIAN_ORB_HEAL = 344_422;
const NW_KYRIAN_ORB_DAMAGE = 344_421;
const NW_SPEAR = 328_351;
const NW_HAMMER = 328_128;
const NW_ORB = 328_406;

export const SOA_SPEAR = 339_917;
export const DOS_URN = 228_626;

// const DIMENSIONAL_SHIFTER = 1;

// profession specific
//  CARDBOARD_ASSASSIN
//  DRUMS
//  DISPOSABLE_SPECTROPHASIC_REANIMATOR

//  // battle rez
//  REBIRTH
//  SOULSTONE

//  // class specific cooldowns - everything that has 1+ min base cd
//  // # death knight
//  ARMY_OF_THE_DEAD
//  ANTI_MAGIC_ZONE
//  ICEBOUND_FORTITUDE
//  DARK_TRANSFORMATION
//  ANTI_MAGIC_SHELL
//  UNHOLY_ASSAULT

//  // dungeon specific
//  SOA_SPEAR

//  HOA_GARGOYLE

//  DOS_URN

//  SD_LANTERN

//  // affix specific
//  HEALING_BY_SANGUINE
//  EXPLOSIVE_KILLS // with meta: amount per role

// type Event = {
//   id: number;
//   name: string;
//   meta?: string;
// };

// const priest: Event[] = [
//   {
//     name: "Power Infusion",
//     id: 1,

//     meta: "target player",
//   },
//   { name: "Void Form", id: 1 },
//   { name: "Power Word: Barrier", id: 1 },
//   { name: "Desperate Prayer", id: 1 },
//   { name: "Pain Suppression", id: 1 },
// ];

// const warlock: Event[] = [
//   { name: "Shadowfury", id: 1 },
//   { name: "Unending Resolve", id: 1 },
// ];

// const hunter: Event[] = [
//   { name: "Aspect of the Turtle", id: 1 },
//   { name: "Double Tap", id: 1 },
//   { name: "Exhilaration", id: 1 },
// ];

// const paladin: Event[] = [
//   {
//     name: "Blessing of Protection",
//     id: 1,
//   },
//   { name: "Divine Shield", id: 1 },
//   { name: "Divine Protection", id: 1 },
//   { name: "Lay On Hands", id: 1 },
//   { name: "Avenging Wrath", id: 1 },
//   { name: "Holy Avenger", id: 1 },
// ];

// const druid: Event[] = [
//   { name: "Celestial Alignment", id: 1 },
//   { name: "Force of Nature", id: 1 },
//   { name: "Barkskin", id: 1 },
//   { name: "Ironbark", id: 1 },
//   { name: "Tranquility", id: 1 },
//   { name: "Fourish", id: 1 },
//   { name: "Innervate", id: 1 },
//   {
//     name: "Stampeding Roar",
//     id: 1,
//   },
//   { name: "Heart of the Wild", id: 1 },
//   { name: "Ursol's Vortex", id: 1 },
//   { name: "Renewal", id: 1 },
// ];

// const shaman: Event[] = [
//   { name: "Spirit Link Totem", id: 1 },
//   { name: "Bloodlust", id: 1 },
//   { name: "Heroism", id: 1 },
//   { name: "Ascendance", id: 1 },
// ];

export const remarkableSpellIds = new Set(
  classes.reduce<number[]>((acc, data) => {
    const allSharedCooldownIds = data.cooldowns.map((cooldown) => cooldown.id);
    const allSpecCooldownIds = data.specs.flatMap((spec) =>
      spec.cooldowns.map((cooldown) => cooldown.id)
    );
    const allCovenantIds = data.covenantAbilities.map((ability) => ability.id);

    return [
      ...acc,
      ...allSharedCooldownIds,
      ...allSpecCooldownIds,
      ...allCovenantIds,
    ];
  }, [])
);
