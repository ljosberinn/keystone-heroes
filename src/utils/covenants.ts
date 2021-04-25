export const covenantMap = {
  1: {
    icon: "ui_sigil_kyrian.jpg",
    name: "Kyrian",
  },
  2: {
    icon: "ui_sigil_venthyr.jpg",
    name: "Venthyr",
  },
  3: {
    icon: "ui_sigil_nightfae.jpg",
    name: "Night Fae",
  },
  4: {
    icon: "ui_sigil_necrolord.jpg",
    name: "Necrolord",
  },
} as const;

export type Covenants = typeof covenantMap;
export type Covenant = Covenants[keyof Covenants];

export const soulbindMap = {
  1: {
    icon: "1.jpg",
    name: "Niya",
  },
  2: {
    icon: "2.jpg",
    name: "Dreamweaver",
  },
  3: {
    icon: "3.jpg",
    name: "Draven",
  },
  4: {
    icon: "4.jpg",
    name: "Marileth",
  },
  5: {
    icon: "5.jpg",
    name: "Emeni",
  },
  6: {
    icon: "6.jpg",
    name: "Korayn",
  },
  7: {
    icon: "7.jpg",
    name: "Pelagos",
  },
  8: {
    icon: "8.jpg",
    name: "Nadjia",
  },
  9: {
    icon: "9.jpg",
    name: "Theotar",
  },
  10: {
    icon: "10.jpg",
    name: "Bonesmith Heirmir",
  },
  13: {
    icon: "13.jpg",
    name: "Kleia",
  },
  18: {
    icon: "18.jpg",
    name: "Mikanikos",
  },
};

export type Soulbinds = typeof soulbindMap;
export type Soulbind = Soulbinds[keyof Soulbinds];
