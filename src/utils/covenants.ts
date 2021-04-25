export const covenantMap = {
  1: {
    icon: "//assets.rpglogs.com/img/warcraft/abilities/ui_sigil_kyrian.jpg",
    name: "Kyrian",
  },
  2: {
    icon: "//assets.rpglogs.com/img/warcraft/abilities/ui_sigil_venthyr.jpg",
    name: "Venthyr",
  },
  3: {
    icon: "//assets.rpglogs.com/img/warcraft/abilities/ui_sigil_nightfae.jpg",
    name: "Night Fae",
  },
  4: {
    icon: "//assets.rpglogs.com/img/warcraft/abilities/ui_sigil_necrolord.jpg",
    name: "Necrolord",
  },
} as const;

export type Covenants = typeof covenantMap;
export type Covenant = Covenants[keyof Covenants];

export const soulbindMap = {
  1: {
    icon: "//assets.rpglogs.com/img/warcraft/soulbinds/soulbind-1.jpg",
    name: "",
  },
  2: {
    icon: "//assets.rpglogs.com/img/warcraft/soulbinds/soulbind-2.jpg",
    name: "",
  },
  3: {
    icon: "//assets.rpglogs.com/img/warcraft/soulbinds/soulbind-3.jpg",
    name: "",
  },
  4: {
    icon: "//assets.rpglogs.com/img/warcraft/soulbinds/soulbind-4.jpg",
    name: "",
  },
  5: {
    icon: "//assets.rpglogs.com/img/warcraft/soulbinds/soulbind-5.jpg",
    name: "",
  },
  6: {
    icon: "//assets.rpglogs.com/img/warcraft/soulbinds/soulbind-6.jpg",
    name: "",
  },
  7: {
    icon: "//assets.rpglogs.com/img/warcraft/soulbinds/soulbind-7.jpg",
    name: "Pelagos",
  },
  8: {
    icon: "//assets.rpglogs.com/img/warcraft/soulbinds/soulbind-8.jpg",
    name: "",
  },
  9: {
    icon: "//assets.rpglogs.com/img/warcraft/soulbinds/soulbind-9.jpg",
    name: "",
  },
  10: {
    icon: "//assets.rpglogs.com/img/warcraft/soulbinds/soulbind-10.jpg",
    name: "",
  },
  11: {
    icon: "//assets.rpglogs.com/img/warcraft/soulbinds/soulbind-11.jpg",
    name: "",
  },
  13: {
    icon: "//assets.rpglogs.com/img/warcraft/soulbinds/soulbind-13.jpg",
    name: "Kleia",
  },
  18: {
    icon: "//assets.rpglogs.com/img/warcraft/soulbinds/soulbind-18.jpg",
    name: "",
  },
};

export type Soulbinds = typeof soulbindMap;
export type Soulbind = Soulbinds[keyof Soulbinds];
