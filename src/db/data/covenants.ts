import { Covenants } from "@prisma/client";
import type { Covenant } from "@prisma/client";

export const covenantMap: Record<Covenant["id"], Omit<Covenant, "id">> = {
  1: {
    icon: "ui_sigil_kyrian",
    name: Covenants.Kyrian,
  },
  2: {
    icon: "ui_sigil_venthyr",
    name: Covenants.Venthyr,
  },
  3: {
    icon: "ui_sigil_nightfae",
    name: Covenants.NightFae,
  },
  4: {
    icon: "ui_sigil_necrolord",
    name: Covenants.Necrolord,
  },
};

export const covenants: Covenant[] = Object.entries(covenantMap).map(
  ([id, dataset]) => ({ ...dataset, id: Number.parseInt(id) })
);
