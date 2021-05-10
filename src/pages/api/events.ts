import nc from "next-connect";

import { IS_PROD } from "../../constants";
import { loadRecursiveEventsFromSource } from "../../server/queries/events";
import type { RequestHandler } from "../../server/types";
import { remarkableSpellIds } from "../../utils/spellIds";
import { FORBIDDEN } from "../../utils/statusCodes";

const handler: RequestHandler = async (req, res) => {
  if (IS_PROD) {
    res.status(FORBIDDEN).end();
    return;
  }

  const reportId = "LafTw4CxyAjkVHv6";
  const startTime = 545_389;
  const endTime = 2_707_896;
  const actorIds = [1, 2, 3, 4, 5];

  const response = await Promise.all(
    actorIds.map(async (actorId) => {
      const json = await loadRecursiveEventsFromSource(
        reportId,
        startTime,
        endTime,
        actorId
      );

      return {
        [actorId]: json.filter((event) =>
          "abilityGameID" in event && event.abilityGameID > 1
            ? remarkableSpellIds.has(event.abilityGameID)
            : false
        ),
      };
    })
  );

  res.json(response);
};

export default nc().get(handler);
