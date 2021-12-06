import { writeFileSync } from "fs";
import fetch from "node-fetch";
import { resolve } from "path";
import { format } from "prettier";

import {
  tormentedSpells,
  tormentedBuffsAndDebuffs,
} from "./events/affixes/tormented";
import { TRINKETS } from "./events/other";

type NPCName = {
  id: number;
  name_dede: string;
  name_enus: string;
  name_eses: string;
  name_frfr: string;
  name_itit: string;
  name_kokr: string;
  name_ptbr: string;
  name_ruru: string;
  name_zhcn: string;
};

async function loadNPCNames() {
  const response = await fetch(
    "https://assets.rpglogs.com/json/warcraft/npc-names.json"
  );
  const json: NPCName[] = await response.json();
  const extracted = json
    .map((dataset) => ({
      id: dataset.id,
      name: dataset.name_enus,
    }))
    .sort((a, b) => {
      return a.id - b.id;
    });

  writeFileSync(
    resolve("src/db/raw/all-npcs.json"),
    format(JSON.stringify(extracted), {
      parser: "json",
    })
  );

  // eslint-disable-next-line no-console
  console.log("[@keystone-heroes/wcl] npc names loaded");
}

type SpellName = {
  id: number;
  school: number;
  icon: string;
  name: string;
  rank: null | string;
};

async function loadSpellNames() {
  const response = await fetch(
    "https://assets.rpglogs.com/json/warcraft/spell-names.json"
  );
  const json: SpellName[] = await response.json();
  const extracted = [
    ...json,
    { id: 350_163, name: "Melee", icon: "ability_meleedamage" },
    { id: 358_967, name: "Inferno", icon: "ability_foundryraid_blastwave" },
    ...tormentedSpells,
    ...tormentedBuffsAndDebuffs,
    ...Object.values(TRINKETS),
  ]
    .map((dataset) => ({
      id: dataset.id,
      name: dataset.name,
      icon: dataset.icon,
    }))
    .sort((a, b) => {
      return a.id - b.id;
    });

  writeFileSync(
    resolve("src/db/raw/all-spells.json"),
    format(JSON.stringify(extracted), {
      parser: "json",
    })
  );

  // eslint-disable-next-line no-console
  console.log("[@keystone-heroes/wcl] spell names loaded");
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    await Promise.all([loadNPCNames(), loadSpellNames()]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  } finally {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
  }
})();
