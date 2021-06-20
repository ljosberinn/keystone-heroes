import type {
  ApplyBuffEvent,
  ApplyBuffStackEvent,
  RemoveBuffEvent,
} from "../src/queries/events";
import { EXPLOSIVE } from "../src/queries/events/affixes/explosive";
import { SPITEFUL } from "../src/queries/events/affixes/spiteful";
import { PF } from "../src/queries/events/dungeons/pf";
import { processEvents } from "../src/transform/events";
import NPCDamagesPlayerEvents from "./fixtures/NPCDamagesPlayerEvents.json";
import bolsteringApplyBuffEvents from "./fixtures/bolsteringApplyBuffEvents.json";
import burstingDamageTakenEvents from "./fixtures/burstingDamageTakenEvents.json";
import deathEvents from "./fixtures/deathEvents.json";
import dimensionalShifterEvents from "./fixtures/dimensionalShifterEvents.json";
import dosUrnDebuffEvents from "./fixtures/dosUrnDebuffEvents.json";
import explosiveDamageTakenEvents from "./fixtures/explosiveDamageTakenEvents.json";
import hoaGargoyleCharmCastEvents from "./fixtures/hoaGargoyleCharmCastEvents.json";
import kyrianOrbHealEvents from "./fixtures/kyrianOrbHealEvents.json";
import necroticDamageTakenEvents from "./fixtures/necroticDamageTakenEvents.json";
import plaguefallSlimeBuffEvents from "./fixtures/plaguefallSlimeBuffEvents.json";
import plaguefallSlimeDeathEvents from "./fixtures/plaguefallSlimeDeathEvents.json";
import playerDamagesNPCEvents from "./fixtures/playerDamagesNPCEvents.json";
import potionOfTheHiddenSpiritEvents from "./fixtures/potionOfTheHiddenSpiritEvents.json";
import quakingDamageTakenEvents from "./fixtures/quakingDamageTakenEvents.json";
import quakingInterruptEvents from "./fixtures/quakingInterruptEvents.json";
import sanguineDamageTakenEvents from "./fixtures/sanguineDamageTakenEvents.json";
import sanguineHealEvents from "./fixtures/sanguineHealEvents.json";
import sdBuffEvents from "./fixtures/sdBuffEvents.json";
import sdLanternBeginCastEvents from "./fixtures/sdLanternBeginCastEvents.json";
import soaSpearDebuffEvents from "./fixtures/soaSpearDebuffEvents.json";
import spitefulDamageTaken from "./fixtures/spitefulDamageTaken.json";
import stormingDamageTakenEvents from "./fixtures/stormingDamageTakenEvents.json";
import topBannerAuraBuffEvents from "./fixtures/topBannerAuraBuffEvents.json";
import volcanicDamageTakenEvents from "./fixtures/volcanicDamageTakenEvents.json";

type Params = Parameters<typeof processEvents>;

const defaultPull: Params[0] = {
  id: 1,
  enemyNPCs: [],
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
  isWipe: false,
  maps: [],
};

const actorOneID = 1;
const actorOnePlayerID = 2;

const actorTwoID = 3;
const actorTwoPlayerID = 4;

const actorPlayerMap: Params[2] = new Map([
  [actorOneID, actorOnePlayerID],
  [actorTwoID, actorTwoPlayerID],
]);

describe("Death Events", () => {
  describe("Player kills NPC", () => {
    test("Player kills Plaguefall Slimes", () => {
      const enemyNPCs = [
        {
          id: 28,
          gameID: PF.GREEN_BUFF.unit,
          minimumInstanceID: 1,
          maximumInstanceID: 3,
        },
        {
          id: 30,
          gameID: PF.RED_BUFF.unit,
          minimumInstanceID: 1,
          maximumInstanceID: 3,
        },
        {
          id: 31,
          gameID: PF.PURPLE_BUFF.unit,
          minimumInstanceID: 1,
          maximumInstanceID: 3,
        },
      ];
      const pull: Params[0] = {
        ...defaultPull,
        enemyNPCs,
      };

      const events: Params[1] = plaguefallSlimeDeathEvents.map((event) => ({
        ...event,
        type: "death",
      }));

      expect(
        processEvents(pull, events, actorPlayerMap, enemyNPCs)
      ).toMatchSnapshot();
    });
  });

  test("Player dying", () => {
    const enemyNPCs = [
      ...new Set(deathEvents.map((event) => event.killerID)),
    ].map((id, index) => ({
      id,
      gameID: index + 1,
      maximumInstanceID: 1,
      minimumInstanceID: 1,
    }));

    const pull: Params[0] = {
      ...defaultPull,
      enemyNPCs,
    };

    const events: Params[1] = deathEvents.map((event) => ({
      ...event,
      type: "death",
    }));

    const actorPlayerMap = new Map(
      deathEvents.map((event) => [event.targetID, event.targetID])
    );

    expect(
      processEvents(pull, events, actorPlayerMap, enemyNPCs)
    ).toMatchSnapshot();
  });
});

describe("Heal Events", () => {
  test("Sanguine", () => {
    const enemyNPCs = [
      ...new Set(sanguineHealEvents.map((event) => event.targetID)),
    ].map((id, index) => ({
      id,
      gameID: index,
      maximumInstanceID: 1,
      minimumInstanceID: 1,
    }));

    const pull: Params[0] = {
      ...defaultPull,
      enemyNPCs,
    };

    const events: Params[1] = sanguineHealEvents.map((event) => ({
      ...event,
      type: "heal",
    }));

    expect(
      processEvents(pull, events, actorPlayerMap, enemyNPCs)
    ).toMatchSnapshot();
  });

  test("Kyrian Orb", () => {
    const events: Params[1] = kyrianOrbHealEvents.map((event) => ({
      ...event,
      type: "heal",
    }));

    const actorPlayerMap = new Map(
      kyrianOrbHealEvents.map((event) => [event.sourceID, event.sourceID])
    );

    expect(
      processEvents(defaultPull, events, actorPlayerMap, defaultPull.enemyNPCs)
    ).toMatchSnapshot();
  });

  test("skips any other heal event", () => {
    const events: Params[1] = [
      {
        type: "heal",
        amount: 1,
        abilityGameID: 123,
        hitType: 1,
        sourceID: 1,
        targetID: 1,
        timestamp: 1,
      },
    ];

    expect(
      processEvents(defaultPull, events, actorPlayerMap, defaultPull.enemyNPCs)
    ).toStrictEqual([]);
  });
});

describe("Damage Events", () => {
  test("skips events doing 0 damage", () => {
    const events: Params[1] = playerDamagesNPCEvents.map((event) => ({
      ...event,
      type: "damage",
      amount: 0,
    }));

    expect(
      processEvents(defaultPull, events, new Map(), defaultPull.enemyNPCs)
    ).toStrictEqual([]);
  });

  describe("DamageDone", () => {
    test("skips events without targetNPCID or sourcePlayerID", () => {
      const events: Params[1] = playerDamagesNPCEvents.map((event) => ({
        ...event,
        type: "damage",
      }));

      expect(
        processEvents(defaultPull, events, new Map(), defaultPull.enemyNPCs)
      ).toStrictEqual([]);
    });

    test("normal mobs", () => {
      const enemyNPCs = [
        ...new Set(playerDamagesNPCEvents.map((event) => event.targetID)),
      ].map((id, index) => ({
        id,
        gameID: index,
        maximumInstanceID: 1,
        minimumInstanceID: 1,
      }));

      const pull: Params[0] = {
        ...defaultPull,
        enemyNPCs,
      };

      const events: Params[1] = playerDamagesNPCEvents.map((event) => ({
        ...event,
        type: "damage",
      }));

      const actorPlayerMap = new Map(
        playerDamagesNPCEvents.map((event) => [event.sourceID, event.sourceID])
      );

      expect(
        processEvents(pull, events, actorPlayerMap, enemyNPCs)
      ).toMatchSnapshot();
    });

    test("Explosive", () => {
      const enemyNPCs = [
        {
          id: 1000,
          gameID: EXPLOSIVE.unit,
          minimumInstanceID: 1,
          maximumInstanceID: 100,
        },
      ];

      const pull: Params[0] = {
        ...defaultPull,
        enemyNPCs,
      };

      const events: Params[1] = playerDamagesNPCEvents.map((event) => ({
        ...event,
        type: "damage",
        targetID: 1000,
      }));

      const actorPlayerMap = new Map(
        playerDamagesNPCEvents.map((event) => [event.sourceID, event.sourceID])
      );

      expect(
        processEvents(pull, events, actorPlayerMap, enemyNPCs)
      ).toMatchSnapshot();
    });
  });

  describe("DamageTaken", () => {
    test("works", () => {
      const enemyNPCs = [
        ...new Set(NPCDamagesPlayerEvents.map((event) => event.sourceID)),
      ].map((id, index) => ({
        id,
        gameID: index + 1,
        maximumInstanceID: 1,
        minimumInstanceID: 1,
      }));

      const pull: Params[0] = {
        ...defaultPull,
        enemyNPCs,
      };

      const events: Params[1] = NPCDamagesPlayerEvents.map((event) => ({
        ...event,
        type: "damage",
      }));

      const actorPlayerMap = new Map(
        NPCDamagesPlayerEvents.map((event) => [event.targetID, event.targetID])
      );

      expect(
        processEvents(pull, events, actorPlayerMap, enemyNPCs)
      ).toMatchSnapshot();
    });

    describe("DamageTaken from affixes", () => {
      test("spiteful", () => {
        const enemyNPCs = [
          {
            id: 1000,
            gameID: SPITEFUL.unit,
            minimumInstanceID: 1,
            maximumInstanceID: 100,
          },
        ];

        const pull: Params[0] = {
          ...defaultPull,
          enemyNPCs,
        };

        const events: Params[1] = spitefulDamageTaken.map((event) => ({
          ...event,
          type: "damage",
          sourceID: 1000,
        }));

        const actorPlayerMap = new Map(
          spitefulDamageTaken.map((event) => [event.targetID, event.targetID])
        );

        expect(
          processEvents(pull, events, actorPlayerMap, enemyNPCs)
        ).toMatchSnapshot();
      });

      test("volcanic", () => {
        const events: Params[1] = volcanicDamageTakenEvents.map((event) => ({
          ...event,
          type: "damage",
        }));

        const actorPlayerMap = new Map(
          volcanicDamageTakenEvents.map((event) => [
            event.targetID,
            event.targetID,
          ])
        );

        expect(
          processEvents(
            defaultPull,
            events,
            actorPlayerMap,
            defaultPull.enemyNPCs
          )
        ).toMatchSnapshot();
      });

      test("quaking", () => {
        const events: Params[1] = quakingDamageTakenEvents.map((event) => ({
          ...event,
          type: "damage",
        }));

        const actorPlayerMap = new Map(
          quakingDamageTakenEvents.map((event) => [
            event.sourceID,
            event.sourceID,
          ])
        );

        expect(
          processEvents(
            defaultPull,
            events,
            actorPlayerMap,
            defaultPull.enemyNPCs
          )
        ).toMatchSnapshot();
      });

      test("necrotic", () => {
        const events: Params[1] = necroticDamageTakenEvents.map((event) => ({
          ...event,
          type: "damage",
        }));

        const actorPlayerMap = new Map(
          necroticDamageTakenEvents.map((event) => [
            event.targetID,
            event.targetID,
          ])
        );

        expect(
          processEvents(
            defaultPull,
            events,
            actorPlayerMap,
            defaultPull.enemyNPCs
          )
        ).toMatchSnapshot();
      });

      test("sanguine", () => {
        const events: Params[1] = sanguineDamageTakenEvents.map((event) => ({
          ...event,
          type: "damage",
        }));

        const actorPlayerMap = new Map(
          sanguineDamageTakenEvents.map((event) => [
            event.targetID,
            event.targetID,
          ])
        );

        expect(
          processEvents(
            defaultPull,
            events,
            actorPlayerMap,
            defaultPull.enemyNPCs
          )
        ).toMatchSnapshot();
      });

      test("storming", () => {
        const events: Params[1] = stormingDamageTakenEvents.map((event) => ({
          ...event,
          type: "damage",
        }));

        const actorPlayerMap = new Map(
          stormingDamageTakenEvents.map((event) => [
            event.targetID,
            event.targetID,
          ])
        );

        expect(
          processEvents(
            defaultPull,
            events,
            actorPlayerMap,
            defaultPull.enemyNPCs
          )
        ).toMatchSnapshot();
      });

      test("explosive", () => {
        const events: Params[1] = explosiveDamageTakenEvents.map((event) => ({
          ...event,
          type: "damage",
        }));

        const actorPlayerMap = new Map(
          explosiveDamageTakenEvents.map((event) => [
            event.targetID,
            event.targetID,
          ])
        );

        expect(
          processEvents(
            defaultPull,
            events,
            actorPlayerMap,
            defaultPull.enemyNPCs
          )
        ).toMatchSnapshot();
      });

      test("bursting", () => {
        const events: Params[1] = burstingDamageTakenEvents.map((event) => ({
          ...event,
          type: "damage",
        }));

        const actorPlayerMap = new Map(
          burstingDamageTakenEvents.map((event) => [
            event.targetID,
            event.targetID,
          ])
        );

        expect(
          processEvents(
            defaultPull,
            events,
            actorPlayerMap,
            defaultPull.enemyNPCs
          )
        ).toMatchSnapshot();
      });
    });
  });
});

describe("Interrupt Events", () => {
  test("works", () => {
    const events: Params[1] = quakingInterruptEvents.map((event) => ({
      ...event,
      type: "interrupt",
    }));

    const actorPlayerMap = new Map(
      quakingInterruptEvents.map((event) => [event.sourceID, event.sourceID])
    );

    expect(
      processEvents(defaultPull, events, actorPlayerMap, defaultPull.enemyNPCs)
    ).toMatchSnapshot();
  });
});

describe("ApplyBuff Events", () => {
  test("Plaguefall Slime Buffs", () => {
    const events: Params[1] = plaguefallSlimeBuffEvents.map((event) => ({
      ...event,
      type: "applybuff",
    }));

    const actorPlayerMap = new Map(
      plaguefallSlimeBuffEvents.map((event) => [event.sourceID, event.sourceID])
    );

    expect(
      processEvents(defaultPull, events, actorPlayerMap, defaultPull.enemyNPCs)
    ).toMatchSnapshot();
  });

  test("Theatre of Pain Banner Aura", () => {
    const events: Params[1] = topBannerAuraBuffEvents.map((event) => ({
      ...event,
      type: "applybuff",
    }));

    const actorPlayerMap = new Map(
      topBannerAuraBuffEvents.map((event) => [event.sourceID, event.sourceID])
    );

    expect(
      processEvents(defaultPull, events, actorPlayerMap, defaultPull.enemyNPCs)
    ).toMatchSnapshot();
  });

  test("Bolstering", () => {
    const enemyNPCs = [
      ...new Set(bolsteringApplyBuffEvents.map((event) => event.targetID)),
    ].map((id) => ({
      id,
      gameID: id,
      minimumInstanceID: 1,
      maximumInstanceID: 1,
    }));

    // NOTE: `bolsteringApplyBuffEvents` uses the result of the transformation
    // within `getBolsteringEvents`
    const pull: Params[0] = {
      ...defaultPull,
      enemyNPCs,
    };

    const events: Params[1] = bolsteringApplyBuffEvents.map((event) => ({
      ...event,
      type: "applybuff",
    }));

    expect(processEvents(pull, events, new Map(), enemyNPCs)).toMatchSnapshot();
  });

  test("Potion of the Hidden Spirit", () => {
    const events: Params[1] = potionOfTheHiddenSpiritEvents.map((event) => ({
      ...event,
      type: event.type === "applybuff" ? "applybuff" : "removebuff",
    }));

    const actorPlayerMap = new Map(
      potionOfTheHiddenSpiritEvents.map((event) => [
        event.sourceID,
        event.sourceID,
      ])
    );

    expect(
      processEvents(defaultPull, events, actorPlayerMap, defaultPull.enemyNPCs)
    ).toMatchSnapshot();
  });

  test("Dimensional Shifter", () => {
    const events: Params[1] = dimensionalShifterEvents.filter(
      (event): event is ApplyBuffEvent | RemoveBuffEvent => {
        return event.type === "applybuff" || event.type === "removebuff";
      }
    );

    const actorPlayerMap = new Map(
      dimensionalShifterEvents.map((event) => [event.sourceID, event.sourceID])
    );

    expect(
      processEvents(defaultPull, events, actorPlayerMap, defaultPull.enemyNPCs)
    ).toMatchSnapshot();
  });
});

describe("ApplyDebuff Events", () => {
  test("SoA Spear", () => {
    const events: Params[1] = soaSpearDebuffEvents.map((event) => ({
      ...event,
      type: "applydebuff",
    }));

    const actorPlayerMap = new Map(
      soaSpearDebuffEvents.map((event) => [event.sourceID, event.sourceID])
    );

    expect(
      processEvents(defaultPull, events, actorPlayerMap, defaultPull.enemyNPCs)
    ).toMatchSnapshot();
  });

  test("DOS Urn", () => {
    const events: Params[1] = dosUrnDebuffEvents.map((event) => ({
      ...event,
      type: "applydebuff",
    }));

    const actorPlayerMap = new Map(
      dosUrnDebuffEvents.map((event) => [event.sourceID, event.sourceID])
    );

    expect(
      processEvents(defaultPull, events, actorPlayerMap, defaultPull.enemyNPCs)
    ).toMatchSnapshot();
  });
});

describe("BeginCast Events", () => {
  test("SD Lantern", () => {
    const events: Params[1] = sdLanternBeginCastEvents.map((event) => ({
      ...event,
      type: "begincast",
    }));

    const actorPlayerMap = new Map(
      sdLanternBeginCastEvents.map((event) => [event.sourceID, event.sourceID])
    );

    expect(
      processEvents(defaultPull, events, actorPlayerMap, defaultPull.enemyNPCs)
    ).toMatchSnapshot();
  });
});

describe("RemoveBuff Events", () => {
  test("SD Lantern", () => {
    const events = sdBuffEvents as (
      | ApplyBuffEvent
      | ApplyBuffStackEvent
      | RemoveBuffEvent
    )[];

    const actorPlayerMap = new Map(
      events.map((event) => [event.targetID, event.targetID])
    );

    expect(
      processEvents(defaultPull, events, actorPlayerMap, defaultPull.enemyNPCs)
    ).toMatchSnapshot();
  });
});

describe("CastEvents", () => {
  test("Halls of Atonement Gargoyle Charm", () => {
    const events: Params[1] = hoaGargoyleCharmCastEvents.map((event) => ({
      ...event,
      type: "cast",
    }));

    const actorPlayerMap = new Map(
      hoaGargoyleCharmCastEvents.map((event) => [
        event.sourceID,
        event.sourceID,
      ])
    );

    expect(
      processEvents(defaultPull, events, actorPlayerMap, defaultPull.enemyNPCs)
    ).toMatchSnapshot();
  });
});
