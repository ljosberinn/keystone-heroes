import type { Soulbind } from "@prisma/client";

export const soulbindMap: Record<
  Soulbind["id"],
  Omit<Soulbind, "id" | "covenantId"> & {
    covenantId: number;
  }
> = {
  1: {
    icon: "1.jpg",
    name: "Niya",
    covenantId: 3,
  },
  2: {
    icon: "2.jpg",
    name: "Dreamweaver",
    covenantId: 3,
  },
  3: {
    icon: "3.jpg",
    name: "Draven",
    covenantId: 2,
  },
  4: {
    icon: "4.jpg",
    name: "Marileth",
    covenantId: 4,
  },
  5: {
    icon: "5.jpg",
    name: "Emeni",
    covenantId: 4,
  },
  6: {
    icon: "6.jpg",
    name: "Korayn",
    covenantId: 3,
  },
  7: {
    icon: "7.jpg",
    name: "Pelagos",
    covenantId: 1,
  },
  8: {
    icon: "8.jpg",
    name: "Nadjia",
    covenantId: 2,
  },
  9: {
    icon: "9.jpg",
    name: "Theotar",
    covenantId: 2,
  },
  10: {
    icon: "10.jpg",
    name: "Bonesmith Heirmir",
    covenantId: 4,
  },
  13: {
    icon: "13.jpg",
    name: "Kleia",
    covenantId: 1,
  },
  18: {
    icon: "18.jpg",
    name: "Mikanikos",
    covenantId: 1,
  },
};

export const soulbinds: Soulbind[] = Object.entries(soulbindMap).map(
  ([id, dataset]) => ({ id: Number.parseInt(id), ...dataset })
);
