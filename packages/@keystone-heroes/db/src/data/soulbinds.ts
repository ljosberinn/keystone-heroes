import type { Soulbind } from "@prisma/client";

export const soulbindMap: Record<Soulbind["id"], Omit<Soulbind, "id">> = {
  1: {
    icon: "1.jpg",
    name: "Niya",
    covenantID: 3,
  },
  2: {
    icon: "2.jpg",
    name: "Dreamweaver",
    covenantID: 3,
  },
  3: {
    icon: "3.jpg",
    name: "Draven",
    covenantID: 2,
  },
  4: {
    icon: "4.jpg",
    name: "Marileth",
    covenantID: 4,
  },
  5: {
    icon: "5.jpg",
    name: "Emeni",
    covenantID: 4,
  },
  6: {
    icon: "6.jpg",
    name: "Korayn",
    covenantID: 3,
  },
  7: {
    icon: "7.jpg",
    name: "Pelagos",
    covenantID: 1,
  },
  8: {
    icon: "8.jpg",
    name: "Nadjia",
    covenantID: 2,
  },
  9: {
    icon: "9.jpg",
    name: "Theotar",
    covenantID: 2,
  },
  10: {
    icon: "10.jpg",
    name: "Bonesmith Heirmir",
    covenantID: 4,
  },
  13: {
    icon: "13.jpg",
    name: "Kleia",
    covenantID: 1,
  },
  18: {
    icon: "18.jpg",
    name: "Mikanikos",
    covenantID: 1,
  },
};

export const soulbinds: Soulbind[] = Object.entries(soulbindMap).map(
  ([id, dataset]) => ({ id: Number.parseInt(id), ...dataset })
);
