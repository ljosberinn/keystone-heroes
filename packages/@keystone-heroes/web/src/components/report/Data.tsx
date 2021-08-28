import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";
import { useReportStore } from "src/store";
import { fightTimeToString } from "src/utils";

import { ExternalLink } from "../ExternalLink";

export type DataProps = {
  fight: FightSuccessResponse;
  reportID: string;
  fightID: string;
};

export function Data({ fight, reportID, fightID }: DataProps): JSX.Element {
  const selectedPull = useReportStore((state) => state.selectedPull);
  const setSelectedPull = useReportStore((state) => state.setSelectedPull);

  return (
    <section className="pt-5 lg:pt-10">
      <div role="tablist" aria-orientation="horizontal" className="flex">
        <div className="p-4">
          <button
            type="button"
            role="tab"
            data-aria-orientation="horizontal"
            aria-controls="tabpanel-pulls-events"
            id="tab-pulls-events"
            className="font-bold focus:outline-none focus:ring disabled:cursor-not-allowed dark:disabled:text-coolgray-500 disabled:text-coolgray-700 border-coolgray-500"
          >
            Pulls & Events
          </button>
        </div>

        <div className="p-4">
          <button
            disabled
            type="button"
            role="tab"
            data-aria-orientation="horizontal"
            aria-controls="tabpanel-player-details"
            id="tab-player-details"
            className="focus:outline-none focus:ring disabled:cursor-not-allowed dark:disabled:text-coolgray-500 disabled:text-coolgray-700"
          >
            Player Details (Upcoming)
          </button>
        </div>

        <div className="p-4">
          <button
            disabled
            type="button"
            role="tab"
            data-aria-orientation="horizontal"
            aria-controls="tabpanel-execution"
            id="tab-execution"
            className="focus:outline-none focus:ring disabled:cursor-not-allowed dark:disabled:text-coolgray-500 disabled:text-coolgray-700"
          >
            Execution (Upcoming)
          </button>
        </div>
      </div>

      <div
        role="tabpanel"
        data-orientation="horizontal"
        data-state="active"
        id="tabpanel-pulls-events"
        aria-labelledby="tab-pulls-events"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        {fight.pulls.map((pull, index) => {
          const deaths = pull.events.filter(
            (event) => event.eventType === "Death"
          ).length;

          const percentUpToThisPull = fight.pulls
            .slice(0, index + 1)
            .reduce((acc, pull) => acc + pull.percent, 0)
            .toFixed(2);

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
                    <div
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
                    </div>
                  ))}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {deaths > 0 && (
                  <ExternalLink
                    className="relative inline-flex items-center justify-center w-8 h-8"
                    href={`https://www.warcraftlogs.com/reports/${reportID}#fight=${fightID}&start=${pull.startTime}&end=${pull.endTime}&type=deaths`}
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
                  href={`https://www.warcraftlogs.com/reports/${reportID}#fight=${fightID}&start=${pull.startTime}&end=${pull.endTime}`}
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
                  {selectedPull === pull.id ? "^" : "v"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div
        role="tabpanel"
        data-orientation="horizontal"
        data-state="active"
        id="tabpanel-player-details"
        aria-labelledby="tab-player-details"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      />

      <div
        role="tabpanel"
        data-orientation="horizontal"
        data-state="active"
        id="tabpanel-execution"
        aria-labelledby="tab-execution"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      />
    </section>
  );
}
