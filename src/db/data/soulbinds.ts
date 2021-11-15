import type { Soulbind } from "@prisma/client";

export const soulbindMap: Record<Soulbind["id"], Omit<Soulbind, "id">> = {
  1: {
    name: "Niya",
    covenantID: 3,
  },
  2: {
    name: "Dreamweaver",
    covenantID: 3,
  },
  3: {
    name: "Draven",
    covenantID: 2,
  },
  4: {
    name: "Marileth",
    covenantID: 4,
  },
  5: {
    name: "Emeni",
    covenantID: 4,
  },
  6: {
    name: "Korayn",
    covenantID: 3,
  },
  7: {
    name: "Pelagos",
    covenantID: 1,
  },
  8: {
    name: "Nadjia",
    covenantID: 2,
  },
  9: {
    name: "Theotar",
    covenantID: 2,
  },
  10: {
    name: "Bonesmith Heirmir",
    covenantID: 4,
  },
  13: {
    name: "Kleia",
    covenantID: 1,
  },
  18: {
    name: "Mikanikos",
    covenantID: 1,
  },
};

export const soulbinds: Soulbind[] = Object.entries(soulbindMap).map(
  ([id, dataset]) => ({ id: Number.parseInt(id), ...dataset })
);
