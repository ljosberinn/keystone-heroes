import nc from "next-connect";

import { IS_PROD } from "../../constants";
import {
  getManifestationOfPrideDamageTaken,
  getManifestationOfPrideDeathEvents,
} from "../../server/queries/events";
import { FORBIDDEN } from "../../utils/statusCodes";

import type { RequestHandler } from "../../server/types";

const handler: RequestHandler = async (req, res) => {
  if (IS_PROD) {
    res.status(FORBIDDEN).end();
    return;
  }

  const reportId = "LafTw4CxyAjkVHv6";
  const startTime = 6_376_923;
  const endTime = 8_198_208;
  // const actorIds = [1, 2, 3, 4, 5];

  // const response = await Promise.all(
  //   actorIds.map(async (actorId) => {
  //     const json = await loadRecursiveEventsFromSource(
  //       reportId,
  //       startTime,
  //       endTime,
  //       actorId
  //     );

  //     return {
  //       [actorId]: json.filter((event) =>
  //         "abilityGameID" in event && event.abilityGameID > 1
  //           ? remarkableSpellIds.has(event.abilityGameID)
  //           : false
  //       ),
  //     };
  //   })
  // );

  const allPridefulDeathEvents = await getManifestationOfPrideDeathEvents(
    reportId,
    8,
    startTime,
    endTime
  );

  const events = await Promise.all(
    allPridefulDeathEvents.map((event, index) =>
      getManifestationOfPrideDamageTaken(
        reportId,
        index === 0 ? startTime : allPridefulDeathEvents[index - 1].timestamp,
        event.timestamp,
        event.targetID,
        event.targetInstance
      )
    )
  );

  res.json(events);
};

export default nc().get(handler);
