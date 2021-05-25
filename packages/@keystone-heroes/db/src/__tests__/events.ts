/* eslint-disable sonarjs/no-identical-functions */
import {
  EXPLOSIVE,
  PF_GREEN_BUFF,
  PF_PURPLE_BUFF,
  PF_RED_BUFF,
  PRIDE,
  SPITEFUL,
} from "../data";
import { processEvents } from "../transform/events";
import NPCDamagesPlayerEvents from "./NPCDamagesPlayerEvents.json";
import bolsteringApplyBuffEvents from "./bolsteringApplyBuffEvents.json";
import burstingDamageTakenEvents from "./burstingDamageTakenEvents.json";
import deathEvents from "./deathEvents.json";
import dosUrnDebuffEvents from "./dosUrnDebuffEvents.json";
import explosiveDamageTakenEvents from "./explosiveDamageTakenEvents.json";
import hoaGargoyleCharmCastEvents from "./hoaGargoyleCharmCastEvents.json";
import kyrianOrbHealEvents from "./kyrianOrbHealEvents.json";
import necroticDamageTakenEvents from "./necroticDamageTakenEvents.json";
import plaguefallSlimeBuffEvents from "./plaguefallSlimeBuffEvents.json";
import plaguefallSlimeDeathEvents from "./plaguefallSlimeDeathEvents.json";
import playerDamagesNPCEvents from "./playerDamagesNPCEvents.json";
import quakingDamageTakenEvents from "./quakingDamageTakenEvents.json";
import quakingInterruptEvents from "./quakingInterruptEvents.json";
import sanguineDamageTakenEvents from "./sanguineDamageTakenEvents.json";
import sanguineHealEvents from "./sanguineHealEvents.json";
import sdBuffEvents from "./sdBuffEvents.json";
import sdLanternBeginCastEvents from "./sdLanternBeginCastEvents.json";
import soaSpearDebuffEvents from "./soaSpearDebuffEvents.json";
import spitefulDamageTaken from "./spitefulDamageTaken.json";
import stormingDamageTakenEvents from "./stormingDamageTakenEvents.json";
import topBannerAuraBuffEvents from "./topBannerAuraBuffEvents.json";
import volcanicDamageTakenEvents from "./volcanicDamageTakenEvents.json";

import type {
  ApplyBuffEvent,
  ApplyBuffStackEvent,
  RemoveBuffEvent,
} from "../../../wcl/src/queries/events";

type Params = Parameters<typeof processEvents>;

const defaultPull: Params[0] = {
  events: [],
  npcs: [],
  startTime: 0,
  endTime: 1,
  x: 1,
  y: 1,
  boundingBox: {
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  },
  maps: [],
};

const actorOneID = 1;
const actorOnePlayerID = 2;

const actorTwoID = 3;
const actorTwoPlayerID = 4;

const actorPlayerMap: Params[1] = new Map([
  [actorOneID, actorOnePlayerID],
  [actorTwoID, actorTwoPlayerID],
]);

describe("Death Events", () => {
  describe("Player kills NPC", () => {
    test("Player kills Manifestation of Pride", () => {
      const pull: Params[0] = {
        ...defaultPull,
        events: [
          {
            timestamp: 1_976_727,
            type: "death",
            sourceID: -1,
            targetID: 31,
            targetInstance: 1,
            abilityGameID: 0,
          },
          {
            timestamp: 2_323_231,
            type: "death",
            sourceID: -1,
            targetID: 31,
            targetInstance: 2,
            abilityGameID: 0,
          },
          {
            timestamp: 2_608_462,
            type: "death",
            sourceID: -1,
            targetID: 31,
            targetInstance: 3,
            abilityGameID: 0,
          },
          {
            timestamp: 3_041_341,
            type: "death",
            sourceID: -1,
            targetID: 31,
            targetInstance: 4,
            abilityGameID: 0,
          },
          {
            timestamp: 3_413_149,
            type: "death",
            sourceID: -1,
            targetID: 31,
            targetInstance: 5,
            abilityGameID: 0,
          },
        ],
        npcs: [
          {
            id: 31,
            gameID: PRIDE.unit,
            maximumInstanceID: 5,
            minimumInstanceID: 1,
          },
        ],
      };

      expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
    });

    test("Player kills Plaguefall Slimes", () => {
      const pull: Params[0] = {
        ...defaultPull,
        events: plaguefallSlimeDeathEvents.map((event) => ({
          ...event,
          type: "death",
        })),
        npcs: [
          {
            id: 28,
            gameID: PF_GREEN_BUFF.unit,
            minimumInstanceID: 1,
            maximumInstanceID: 3,
          },
          {
            id: 30,
            gameID: PF_RED_BUFF.unit,
            minimumInstanceID: 1,
            maximumInstanceID: 3,
          },
          {
            id: 31,
            gameID: PF_PURPLE_BUFF.unit,
            minimumInstanceID: 1,
            maximumInstanceID: 3,
          },
        ],
      };

      expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
    });
  });

  describe("NPC kills Player", () => {
    test("Manifestation of Pride", () => {
      const pull: Params[0] = {
        ...defaultPull,
        events: [
          {
            timestamp: 2_538_004,
            type: "death",
            sourceID: -1,
            targetID: actorOneID,
            abilityGameID: 0,
            killerID: 31,
            killerInstance: 4,
            killingAbilityGameID: 324_323,
          },
          {
            timestamp: 2_922_258,
            type: "death",
            sourceID: -1,
            targetID: actorOneID,
            abilityGameID: 0,
            killerID: 31,
            killerInstance: 15,
            killingAbilityGameID: 1,
          },
          {
            timestamp: 3_037_098,
            type: "death",
            sourceID: -1,
            targetID: actorOneID,
            abilityGameID: 0,
            killerID: 31,
            killerInstance: 4,
            killingAbilityGameID: 342_332,
          },
        ],
        npcs: [
          {
            id: 31,
            gameID: PRIDE.unit,
            maximumInstanceID: 1,
            minimumInstanceID: 1,
          },
        ],
      };

      expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
    });
  });

  test("Player dying", () => {
    const pull: Params[0] = {
      ...defaultPull,
      events: deathEvents.map((event) => ({ ...event, type: "death" })),
      npcs: [...new Set(deathEvents.map((event) => event.killerID))].map(
        (id, index) => ({
          id,
          gameID: index + 1,
          maximumInstanceID: 1,
          minimumInstanceID: 1,
        })
      ),
    };

    const actorPlayerMap = new Map(
      deathEvents.map((event) => [event.targetID, event.targetID])
    );

    expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
  });
});

describe("Heal Events", () => {
  test("Sanguine", () => {
    const pull: Params[0] = {
      ...defaultPull,
      events: sanguineHealEvents.map((event) => ({
        ...event,
        type: "heal",
      })),
      npcs: [...new Set(sanguineHealEvents.map((event) => event.targetID))].map(
        (id, index) => ({
          id,
          gameID: index,
          maximumInstanceID: 1,
          minimumInstanceID: 1,
        })
      ),
    };

    expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
  });

  test("Kyrian Orb", () => {
    const pull: Params[0] = {
      ...defaultPull,
      events: kyrianOrbHealEvents.map((event) => ({
        ...event,
        type: "heal",
      })),
    };

    const actorPlayerMap = new Map(
      kyrianOrbHealEvents.map((event) => [event.sourceID, event.sourceID])
    );

    expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
  });

  test("skips any other heal event", () => {
    const pull: Params[0] = {
      ...defaultPull,
      events: [
        {
          type: "heal",
          amount: 1,
          abilityGameID: 123,
          hitType: 1,
          sourceID: 1,
          targetID: 1,
          timestamp: 1,
        },
      ],
    };

    expect(processEvents(pull, actorPlayerMap)).toStrictEqual([]);
  });
});

describe("Damage Events", () => {
  test("skips events doing 0 damage", () => {
    const pull: Params[0] = {
      ...defaultPull,
      events: playerDamagesNPCEvents.map((event) => ({
        ...event,
        type: "damage",
        amount: 0,
      })),
    };

    expect(processEvents(pull, new Map())).toStrictEqual([]);
  });

  describe("DamageDone", () => {
    test("skips events without targetNPCID or sourcePlayerID", () => {
      const pull: Params[0] = {
        ...defaultPull,
        events: playerDamagesNPCEvents.map((event) => ({
          ...event,
          type: "damage",
        })),
      };

      expect(processEvents(pull, new Map())).toStrictEqual([]);
    });

    test("normal mobs", () => {
      const pull: Params[0] = {
        ...defaultPull,
        events: playerDamagesNPCEvents.map((event) => ({
          ...event,
          type: "damage",
        })),
        npcs: [
          ...new Set(playerDamagesNPCEvents.map((event) => event.targetID)),
        ].map((id, index) => ({
          id,
          gameID: index,
          maximumInstanceID: 1,
          minimumInstanceID: 1,
        })),
      };

      const actorPlayerMap = new Map(
        playerDamagesNPCEvents.map((event) => [event.sourceID, event.sourceID])
      );

      expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
    });

    test("Explosive", () => {
      const pull: Params[0] = {
        ...defaultPull,
        events: playerDamagesNPCEvents.map((event) => ({
          ...event,
          type: "damage",
          targetID: 1000,
        })),
        npcs: [
          {
            id: 1000,
            gameID: EXPLOSIVE.unit,
            minimumInstanceID: 1,
            maximumInstanceID: 100,
          },
        ],
      };

      const actorPlayerMap = new Map(
        playerDamagesNPCEvents.map((event) => [event.sourceID, event.sourceID])
      );

      expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
    });
  });

  describe("DamageTaken", () => {
    test("works", () => {
      const pull: Params[0] = {
        ...defaultPull,
        events: NPCDamagesPlayerEvents.map((event) => ({
          ...event,
          type: "damage",
        })),
        npcs: [
          ...new Set(NPCDamagesPlayerEvents.map((event) => event.sourceID)),
        ].map((id, index) => ({
          id,
          gameID: index + 1,
          maximumInstanceID: 1,
          minimumInstanceID: 1,
        })),
      };

      const actorPlayerMap = new Map(
        NPCDamagesPlayerEvents.map((event) => [event.targetID, event.targetID])
      );

      expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
    });

    describe("DamageTaken from affixes", () => {
      test("spiteful", () => {
        const pull: Params[0] = {
          ...defaultPull,
          events: spitefulDamageTaken.map((event) => ({
            ...event,
            type: "damage",
            sourceID: 1000,
          })),
          npcs: [
            {
              id: 1000,
              gameID: SPITEFUL,
              minimumInstanceID: 1,
              maximumInstanceID: 100,
            },
          ],
        };

        const actorPlayerMap = new Map(
          spitefulDamageTaken.map((event) => [event.targetID, event.targetID])
        );

        expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
      });

      test("volcanic", () => {
        const pull: Params[0] = {
          ...defaultPull,
          events: volcanicDamageTakenEvents.map((event) => ({
            ...event,
            type: "damage",
          })),
        };

        const actorPlayerMap = new Map(
          volcanicDamageTakenEvents.map((event) => [
            event.targetID,
            event.targetID,
          ])
        );

        expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
      });

      test("quaking", () => {
        const pull: Params[0] = {
          ...defaultPull,
          events: quakingDamageTakenEvents.map((event) => ({
            ...event,
            type: "damage",
          })),
        };

        const actorPlayerMap = new Map(
          quakingDamageTakenEvents.map((event) => [
            event.sourceID,
            event.sourceID,
          ])
        );

        expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
      });

      test("necrotic", () => {
        const pull: Params[0] = {
          ...defaultPull,
          events: necroticDamageTakenEvents.map((event) => ({
            ...event,
            type: "damage",
          })),
        };

        const actorPlayerMap = new Map(
          necroticDamageTakenEvents.map((event) => [
            event.targetID,
            event.targetID,
          ])
        );

        expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
      });

      test("sanguine", () => {
        const pull: Params[0] = {
          ...defaultPull,
          events: sanguineDamageTakenEvents.map((event) => ({
            ...event,
            type: "damage",
          })),
        };

        const actorPlayerMap = new Map(
          sanguineDamageTakenEvents.map((event) => [
            event.targetID,
            event.targetID,
          ])
        );

        expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
      });

      test("storming", () => {
        const pull: Params[0] = {
          ...defaultPull,
          events: stormingDamageTakenEvents.map((event) => ({
            ...event,
            type: "damage",
          })),
        };

        const actorPlayerMap = new Map(
          stormingDamageTakenEvents.map((event) => [
            event.targetID,
            event.targetID,
          ])
        );

        expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
      });

      test("explosive", () => {
        const pull: Params[0] = {
          ...defaultPull,
          events: explosiveDamageTakenEvents.map((event) => ({
            ...event,
            type: "damage",
          })),
        };

        const actorPlayerMap = new Map(
          explosiveDamageTakenEvents.map((event) => [
            event.targetID,
            event.targetID,
          ])
        );

        expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
      });

      test("bursting", () => {
        const pull: Params[0] = {
          ...defaultPull,
          events: burstingDamageTakenEvents.map((event) => ({
            ...event,
            type: "damage",
          })),
        };

        const actorPlayerMap = new Map(
          burstingDamageTakenEvents.map((event) => [
            event.targetID,
            event.targetID,
          ])
        );

        expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
      });
    });
  });
});

describe("Interrupt Events", () => {
  test("works", () => {
    const pull: Params[0] = {
      ...defaultPull,
      events: quakingInterruptEvents.map((event) => ({
        ...event,
        type: "interrupt",
      })),
    };

    const actorPlayerMap = new Map(
      quakingInterruptEvents.map((event) => [event.sourceID, event.sourceID])
    );

    expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
  });
});

describe("ApplyBuff Events", () => {
  test("Plaguefall Slime Buffs", () => {
    const pull: Params[0] = {
      ...defaultPull,
      events: plaguefallSlimeBuffEvents.map((event) => ({
        ...event,
        type: "applybuff",
      })),
    };

    const actorPlayerMap = new Map(
      plaguefallSlimeBuffEvents.map((event) => [event.sourceID, event.sourceID])
    );

    expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
  });

  test("Theatre of Pain Banner Aura", () => {
    const pull: Params[0] = {
      ...defaultPull,
      events: topBannerAuraBuffEvents.map((event) => ({
        ...event,
        type: "applybuff",
      })),
    };

    const actorPlayerMap = new Map(
      topBannerAuraBuffEvents.map((event) => [event.sourceID, event.sourceID])
    );

    expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
  });

  test("Bolstering", () => {
    // NOTE: `bolsteringApplyBuffEvents` uses the result of the transformation
    // within `getBolsteringEvents`
    const pull: Params[0] = {
      ...defaultPull,
      events: bolsteringApplyBuffEvents.map((event) => ({
        ...event,
        type: "applybuff",
      })),
      npcs: [
        ...new Set(bolsteringApplyBuffEvents.map((event) => event.targetID)),
      ].map((id) => ({
        id,
        gameID: id,
        minimumInstanceID: 1,
        maximumInstanceID: 1,
      })),
    };

    expect(processEvents(pull, new Map())).toMatchSnapshot();
  });
});

describe("ApplyDebuff Events", () => {
  test("SoA Spear", () => {
    const pull: Params[0] = {
      ...defaultPull,
      events: soaSpearDebuffEvents.map((event) => ({
        ...event,
        type: "applydebuff",
      })),
    };

    const actorPlayerMap = new Map(
      soaSpearDebuffEvents.map((event) => [event.sourceID, event.sourceID])
    );

    expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
  });

  test("DOS Urn", () => {
    const pull: Params[0] = {
      ...defaultPull,
      events: dosUrnDebuffEvents.map((event) => ({
        ...event,
        type: "applydebuff",
      })),
    };

    const actorPlayerMap = new Map(
      dosUrnDebuffEvents.map((event) => [event.sourceID, event.sourceID])
    );

    expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
  });
});

describe("BeginCast Events", () => {
  test("SD Lantern", () => {
    const pull: Params[0] = {
      ...defaultPull,
      events: sdLanternBeginCastEvents.map((event) => ({
        ...event,
        type: "begincast",
      })),
    };

    const actorPlayerMap = new Map(
      sdLanternBeginCastEvents.map((event) => [event.sourceID, event.sourceID])
    );

    expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
  });
});

describe("RemoveBuff Events", () => {
  test("SD Lantern", () => {
    const events = sdBuffEvents as (
      | ApplyBuffEvent
      | ApplyBuffStackEvent
      | RemoveBuffEvent
    )[];

    const pull: Params[0] = {
      ...defaultPull,
      events,
    };

    const actorPlayerMap = new Map(
      events.map((event) => [event.targetID, event.targetID])
    );
    expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
  });
});

describe("CastEvents", () => {
  test("Halls of Atonement Gargoyle Charm", () => {
    const pull: Params[0] = {
      ...defaultPull,
      events: hoaGargoyleCharmCastEvents.map((event) => ({
        ...event,
        type: "cast",
      })),
    };

    const actorPlayerMap = new Map(
      hoaGargoyleCharmCastEvents.map((event) => [
        event.sourceID,
        event.sourceID,
      ])
    );

    expect(processEvents(pull, actorPlayerMap)).toMatchSnapshot();
  });
});
