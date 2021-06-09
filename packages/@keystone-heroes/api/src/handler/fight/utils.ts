import type {
  CastEvent,
  ApplyBuffEvent,
  DamageEvent,
  ApplyDebuffEvent,
  DeathEvent,
  HealEvent,
  InterruptEvent,
  BeginCastEvent,
  ApplyBuffStackEvent,
  RemoveBuffEvent,
} from "../../../../wcl/src/queries/events";

export type InsertableFight = {
  pulls: {
    startTime: number;
    endTime: number;
    x: number;
    y: number;
    boundingBox: {
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
    };
    maps: number[];
    events: (
      | CastEvent
      | ApplyDebuffEvent
      | DeathEvent
      | (ApplyBuffEvent & { stacks?: number })
      | BeginCastEvent
      | HealEvent
      | DamageEvent
      | InterruptEvent
      | RemoveBuffEvent
      | ApplyBuffStackEvent
    )[];
    npcs: DungeonPull["enemyNPCs"];
  }[];
};
