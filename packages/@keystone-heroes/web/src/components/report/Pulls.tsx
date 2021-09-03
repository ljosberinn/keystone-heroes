import { useReportStore } from "src/store";
import { createWCLUrl, fightTimeToString } from "src/utils";
import { classnames } from "src/utils/classnames";

import { ExternalLink } from "../ExternalLink";
import type { DataProps } from "./Data";

const findRelevantEvents = (
  thisPull: DataProps["fight"]["pulls"][number],
  allPulls: DataProps["fight"]["pulls"],
  index: number
) => {
  const { events: lastPullEvents, endTime: lastPullEnd } = allPulls[
    index - 1
  ] ?? [{ events: [], endTime: 0 }];
  const { events: nextPullEvents, startTime: nextPullStart } = allPulls[
    index + 1
  ] ?? [{ events: [], startTime: 0 }];

  // events that occured later than 50% of the time between two pulls count
  // towards this pull
  const middleAfterLastPull = lastPullEnd
    ? lastPullEnd + (thisPull.startTime - lastPullEnd) / 2
    : null;

  // events that occured earlier than 50% of the time between two pulls count
  // towards this pull
  const middleAfterThisPull = nextPullStart
    ? thisPull.endTime + (nextPullStart - thisPull.endTime) / 2
    : null;

  const eventsBeforeThisPull = middleAfterLastPull
    ? lastPullEvents.filter((event) => {
        return (
          event.timestamp >= middleAfterLastPull &&
          event.timestamp < thisPull.startTime
        );
      })
    : [];

  const eventsAfterThisPull = middleAfterThisPull
    ? nextPullEvents.filter((event) => {
        return event.timestamp < middleAfterThisPull;
      })
    : [];

  return [...eventsBeforeThisPull, ...thisPull.events, ...eventsAfterThisPull];
};

export type PullsProps = DataProps;

export function Pulls({ fight, reportID, fightID }: PullsProps): JSX.Element {
  const selectedPull = useReportStore((state) => state.selectedPull);
  const setSelectedPull = useReportStore((state) => state.setSelectedPull);

  return (
    <>
      {fight.pulls.map((pull, index) => {
        const deaths = pull.events.filter(
          (event) => event.eventType === "Death"
        ).length;

        const percentUpToThisPull = fight.pulls
          .slice(0, index + 1)
          .reduce((acc, pull) => acc + pull.percent, 0)
          .toFixed(2);

        const selected = selectedPull === pull.id;

        const events = findRelevantEvents(pull, fight.pulls, index);
        console.log({ events, index });

        return (
          <div className="flex justify-between w-full" key={pull.id}>
            <div className="flex items-center">
              <span>{pull.id}</span>
              <span>
                {pull.percent > 0 ? <>{pull.percent.toFixed(2)}%</> : "-"}
              </span>
              <span className="italic text-gray-500 dark:text-gray-400">
                ({percentUpToThisPull}%)
              </span>
              <span>
                {fightTimeToString(pull.endTime - pull.startTime, true)}
              </span>
              <span className="italic text-gray-500 dark:text-gray-400">
                (
                {fightTimeToString(
                  pull.endTime - fight.pulls[0].startTime,
                  true
                )}
                )
              </span>
              <span className="flex space-x-2">
                {pull.npcs.map((npc) => (
                  <span
                    key={npc.id}
                    className="flex items-center w-10 h-10 space-x-2 lg:w-12 lg:h-12"
                  >
                    <span>{npc.count}</span>
                    <img
                      src={`/static/npcs/${npc.id}.png`}
                      alt={npc.name}
                      title={npc.name}
                      className="object-cover w-8 h-8 rounded-full"
                    />
                  </span>
                ))}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {deaths > 0 && (
                <ExternalLink
                  className="relative inline-flex items-center justify-center w-8 h-8"
                  href={createWCLUrl({
                    reportID,
                    fightID,
                    start: pull.startTime,
                    end: pull.endTime,
                    type: "deaths",
                  })}
                >
                  <style jsx>
                    {`
                      .deaths {
                        background-image: url(/static/icons/ability_rogue_feigndeath.jpg);
                      }
                    `}
                  </style>
                  <div
                    className="absolute w-full h-full bg-center bg-cover rounded-full opacity-25 deaths"
                    title="View deaths of this pull on WarcraftLogs"
                  />
                  <div className="font-bold text-red-500">{deaths}</div>
                </ExternalLink>
              )}
              <ExternalLink
                href={createWCLUrl({
                  reportID,
                  fightID,
                  start: pull.startTime,
                  end: pull.endTime,
                })}
              >
                <img
                  src="/static/icons/wcl.png"
                  alt="View this pull on WarcraftLogs"
                  title="View this pull on WarcraftLogs"
                  className="w-8 h-8"
                />
              </ExternalLink>
              <button
                type="button"
                onClick={() => {
                  setSelectedPull(pull.id);
                }}
              >
                <img
                  src={`/static/icons/misc_${
                    selected ? "arrowdown" : "arrowlup"
                  }.jpg`}
                  alt={`${selected ? "Hide" : "Show"} pull details`}
                  title={`${selected ? "Hide" : "Show"} pull details`}
                  className={classnames(
                    "w-8 h-8 filter rounded-full",
                    selected ? "" : "grayscale hover:grayscale-0"
                  )}
                />
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}
