import { writeFileSync } from "fs";
import fetch from "node-fetch";
import { resolve } from "path";
import { format } from "prettier";

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
  const extracted = json.map((dataset) => ({
    id: dataset.id,
    name: dataset.name_enus,
  }));

  const targetPath = resolve("../db/raw/all-npcs.json");
  writeFileSync(
    targetPath,
    format(JSON.stringify(extracted), {
      parser: "json",
    })
  );
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
  const extracted = json.map((dataset) => ({
    id: dataset.id,
    name: dataset.name,
  }));

  const targetPath = resolve("../db/raw/all-spells.json");
  writeFileSync(
    targetPath,
    format(JSON.stringify(extracted), {
      parser: "json",
    })
  );
}

loadNPCNames()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("[@keystone-heroes/wcl] npc names loaded");
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
  })
  // eslint-disable-next-line no-console
  .catch(console.error);

loadSpellNames()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("[@keystone-heroes/wcl] spell names loaded");
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
  })
  // eslint-disable-next-line no-console
  .catch(console.error);
