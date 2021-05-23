import { DungeonIds } from "./dungeons";

import type { Map } from "@prisma/client";

export const maps: Map[] = [
  { id: 1663, dungeonID: DungeonIds.HALLS_OF_ATONEMENT },
  { id: 1664, dungeonID: DungeonIds.HALLS_OF_ATONEMENT },
  { id: 1665, dungeonID: DungeonIds.HALLS_OF_ATONEMENT },

  { id: 1666, dungeonID: DungeonIds.THE_NECROTIC_WAKE },
  { id: 1667, dungeonID: DungeonIds.THE_NECROTIC_WAKE },
  { id: 1668, dungeonID: DungeonIds.THE_NECROTIC_WAKE },

  { id: 1669, dungeonID: DungeonIds.MISTS_OF_TIRNA_SCITHE },

  { id: 1675, dungeonID: DungeonIds.SANGUINE_DEPTHS },
  { id: 1676, dungeonID: DungeonIds.SANGUINE_DEPTHS },

  { id: 1677, dungeonID: DungeonIds.DE_OTHER_SIDE },
  { id: 1678, dungeonID: DungeonIds.DE_OTHER_SIDE },
  { id: 1679, dungeonID: DungeonIds.DE_OTHER_SIDE },
  { id: 1680, dungeonID: DungeonIds.DE_OTHER_SIDE },

  { id: 1683, dungeonID: DungeonIds.THEATRE_OF_PAIN },
  { id: 1684, dungeonID: DungeonIds.THEATRE_OF_PAIN },
  { id: 1685, dungeonID: DungeonIds.THEATRE_OF_PAIN },
  { id: 1686, dungeonID: DungeonIds.THEATRE_OF_PAIN },
  { id: 1687, dungeonID: DungeonIds.THEATRE_OF_PAIN },

  { id: 1692, dungeonID: DungeonIds.SPIRES_OF_ASCENSION },
  { id: 1693, dungeonID: DungeonIds.SPIRES_OF_ASCENSION },
  { id: 1694, dungeonID: DungeonIds.SPIRES_OF_ASCENSION },
  { id: 1695, dungeonID: DungeonIds.SPIRES_OF_ASCENSION },

  { id: 1674, dungeonID: DungeonIds.PLAGUEFALL },
  { id: 1697, dungeonID: DungeonIds.PLAGUEFALL },
];
