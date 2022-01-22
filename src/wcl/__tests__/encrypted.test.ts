import { Affixes } from "@prisma/client";

import { getEncryptedEvents } from "../queries/events/affixes/encrypted";
import allEvents from "./fixtures/allEvents.json";

describe("getEncryptedEvents", () => {
  test("works", () => {
    expect(
      getEncryptedEvents(allEvents, new Set([Affixes.Encrypted]))
    ).toMatchSnapshot();
  });

  test("does nothing if affix is absent", () => {
    expect(getEncryptedEvents(allEvents, new Set())).toHaveLength(0);
  });
});
