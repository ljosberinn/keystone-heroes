import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";
import { fightTimeToString } from "src/utils";

export type DataProps = {
  fight: FightSuccessResponse;
};

export function Data({ fight }: DataProps): JSX.Element {
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
        <table className="w-full">
          <thead>
            <tr>
              <th>Pull</th>
              <th className="text-right">Percent (Total)</th>
              <th className="text-right">Duration (Total)</th>
              <th className="text-right">Enemies</th>
              <th className="text-right">Deaths</th>
            </tr>
          </thead>
          <tbody>
            {fight.pulls.map((pull, index) => {
              const enemies = pull.npcs.reduce(
                (acc, npc) => acc + npc.count,
                0
              );

              const deaths = pull.events.filter(
                (event) => event.eventType === "Death"
              ).length;

              const percentUpToThisPull = fight.pulls
                .slice(0, index + 1)
                .reduce((acc, pull) => acc + pull.percent, 0)
                .toFixed(2);

              return (
                <tr key={pull.id}>
                  <td>{pull.id}</td>
                  <td className="text-right">
                    {pull.percent > 0 ? (
                      <span>{pull.percent.toFixed(2)}%</span>
                    ) : (
                      "-"
                    )}{" "}
                    <span className="italic text-gray-500 dark:text-gray-400">
                      ({percentUpToThisPull}%)
                    </span>
                  </td>
                  <td className="text-right">
                    {fightTimeToString(pull.endTime - pull.startTime, true)}{" "}
                    <span className="italic text-gray-500 dark:text-gray-400">
                      (
                      {fightTimeToString(
                        pull.endTime - fight.pulls[0].startTime,
                        true
                      )}
                      )
                    </span>
                  </td>
                  <td className="text-right">{enemies}</td>
                  <td className="text-right">{deaths === 0 ? "" : deaths}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
