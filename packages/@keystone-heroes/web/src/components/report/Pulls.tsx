import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";
import { useStaticData } from "src/context/StaticData";
import { useFight } from "src/pages/report/[reportID]/[fightID]";
import { useReportStore } from "src/store";
import { createWCLUrl, fightTimeToString } from "src/utils";
import { classnames } from "src/utils/classnames";

import { AbilityIcon } from "../AbilityIcon";
import { ExternalLink } from "../ExternalLink";

const findRelevantEvents = (
  thisPull: FightSuccessResponse["pulls"][number],
  allPulls: FightSuccessResponse["pulls"],
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

  return {
    before: eventsBeforeThisPull,
    during: thisPull.events,
    after: eventsAfterThisPull,
  };
};

type PullHeaderProps = {
  percentUpToThisPull: string;
  pull: FightSuccessResponse["pulls"][number];
  firstPullStartTime: number;
  selected: boolean;
};

function PullHeader({
  percentUpToThisPull,
  pull,
  firstPullStartTime,
  selected,
}: PullHeaderProps) {
  const { reportID, fightID } = useFight();

  const deaths = pull.events.filter(
    (event) => event.type === "Death" && !event.targetNPC
  ).length;
  const setSelectedPull = useReportStore((state) => state.setSelectedPull);

  return (
    <div
      className={classnames(
        "flex justify-between w-full p-2 shadow-lg dark:bg-coolgray-700 bg-white shadow-sm",
        selected ? "rounded-t-lg" : "rounded-lg"
      )}
    >
      <div className="flex items-center">
        <span>{pull.id}</span>
        <span>{pull.percent > 0 ? <>{pull.percent.toFixed(2)}%</> : "-"}</span>
        <span className="italic text-gray-500 dark:text-gray-400">
          ({percentUpToThisPull}%)
        </span>
        <span>{fightTimeToString(pull.endTime - pull.startTime, true)}</span>
        <span className="italic text-gray-500 dark:text-gray-400">
          ({fightTimeToString(pull.endTime - firstPullStartTime, true)})
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
            src="/static/icons/misc_arrowdown.jpg"
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
}

export function Pulls(): JSX.Element {
  const { fight } = useFight();
  const pulls = fight ? fight.pulls : [];
  const player = fight ? fight.player : [];
  const selectedPull = useReportStore((state) => state.selectedPull);

  return (
    <div className="space-y-4">
      {pulls.map((pull, index) => {
        const selected = selectedPull === pull.id;

        const percentUpToThisPull = pulls
          .slice(0, index + 1)
          .reduce((acc, pull) => acc + pull.percent, 0)
          .toFixed(2);

        return (
          <div key={pull.id}>
            <PullHeader
              pull={pull}
              percentUpToThisPull={percentUpToThisPull}
              firstPullStartTime={pulls[0].startTime}
              selected={selected}
            />
            {selected && (
              <PullBody pull={pull} allPulls={pulls} player={player} />
            )}
          </div>
        );
      })}
    </div>
  );
}

type PullBodyProps = {
  pull: FightSuccessResponse["pulls"][number];
  player: FightSuccessResponse["player"];
  allPulls: FightSuccessResponse["pulls"];
};

function PullBody({ pull, allPulls, player }: PullBodyProps) {
  const { spells } = useStaticData();
  const { during } = findRelevantEvents(
    pull,
    allPulls,
    allPulls.findIndex((_pull) => _pull.id === pull.id)
  );

  const sourceIDPlayerNameMap = Object.fromEntries(
    player.map((p) => [p.id, p.name])
  );

  return (
    <div className="p-2 rounded-b-lg shadow-sm bg-coolgray-100 dark:bg-coolgray-600">
      {during.length > 0 && (
        <>
          <h2 className="text-xl font-bold">During Pull</h2>
          {during.map((event) => {
            const ability = event.ability ? spells[event.ability.id] : null;

            return (
              <p
                key={`${event.timestamp}-${
                  event.sourceNPC
                    ? event.sourceNPC.id
                    : event.sourcePlayerID
                    ? event.sourcePlayerID
                    : event.targetPlayerID ?? "unknown"
                }`}
              >
                Type: {event.type} | Source:{" "}
                {event.sourcePlayerID ? (
                  sourceIDPlayerNameMap[event.sourcePlayerID]
                ) : event.sourceNPC ? (
                  <ExternalLink
                    href={`https://wowhead.com/npc=${event.sourceNPC.id}`}
                  >
                    {event.sourceNPC.name}
                  </ExternalLink>
                ) : (
                  "unknown"
                )}{" "}
                | Ability:{" "}
                {event.ability && ability ? (
                  <ExternalLink
                    href={`https://wowhead.com/spell=${event.ability.id}`}
                  >
                    <AbilityIcon
                      className="inline w-6 h-6"
                      icon={ability.icon}
                      alt={ability.name}
                      title={
                        event.ability.lastUse
                          ? `Last used ${Math.round(
                              (event.timestamp - event.ability.lastUse) / 1000
                            )} seconds ago.`
                          : "First usage."
                      }
                    />{" "}
                    {ability.name}
                  </ExternalLink>
                ) : (
                  "-"
                )}
              </p>
            );
          })}
        </>
      )}
    </div>
  );
}
