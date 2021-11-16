import { DOS_URN } from "../queries/events/dungeons/dos";
import { ENVELOPMENT_OF_MISTS } from "../queries/events/dungeons/mots";
import { SOA_SPEAR } from "../queries/events/dungeons/soa";
import type { ApplyDebuffEvent } from "../queries/events/types";
import { applyDebuffProcessor } from "../transform/events/applydebuff";
import allEvents from "./fixtures/allEvents.json";

describe("applydebuff", () => {
  const params = {
    targetPlayerID: null,
    targetNPCID: null,
    sourcePlayerID: null,
    sourceNPCID: null,
  };

  const applyDebuffEvents = allEvents.filter(
    (event): event is ApplyDebuffEvent => event.type === "applydebuff"
  );

  test("tracks SOA Spear", () => {
    const result = applyDebuffEvents
      .filter((event) => event.abilityGameID === SOA_SPEAR)
      .map((event) => applyDebuffProcessor(event, params));

    expect(result).toMatchSnapshot();
  });

  test("tracks DOS Urn", () => {
    const result = applyDebuffEvents
      .filter((event) => event.abilityGameID === DOS_URN)
      .map((event) => applyDebuffProcessor(event, params));

    expect(result).toMatchSnapshot();
  });

  test("tracks MOTS maze failures", () => {
    const result = applyDebuffEvents
      .filter((event) => event.abilityGameID === ENVELOPMENT_OF_MISTS)
      .map((event) => applyDebuffProcessor(event, params));

    expect(result).toMatchSnapshot();
  });

  test("returns null for unknown applydebuff events", () => {
    expect(
      applyDebuffProcessor(
        {
          type: "applydebuff",
          abilityGameID: 1,
          sourceID: 1,
          targetID: 0,
          timestamp: 1,
        },
        params
      )
    ).toBeNull();
  });
});
