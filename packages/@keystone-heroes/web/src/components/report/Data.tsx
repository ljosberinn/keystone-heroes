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
            aria-controls="tabpanel-pulls-events"
            id="tab-pulls-events"
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
            aria-controls="tabpanel-pulls-events"
            id="tab-pulls-events"
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
              <th className="text-right">Percent</th>
              <th className="text-right">Duration</th>
              <th className="text-right">Enemies</th>
              <th className="text-right">Deaths</th>
            </tr>
          </thead>
          <tbody>
            {fight.pulls.map((pull) => {
              const enemies = pull.npcs.reduce(
                (acc, npc) => acc + npc.count,
                0
              );

              const deaths = pull.events.filter(
                (event) => event.eventType === "Death"
              ).length;

              return (
                <tr key={pull.id}>
                  <td>{pull.id}</td>
                  <td className="text-right">{pull.percent.toFixed(2)}%</td>
                  <td className="text-right">
                    {fightTimeToString(pull.endTime - pull.startTime, true)}
                  </td>
                  <td className="text-right">{enemies}</td>
                  <td className="text-right">{deaths === 0 ? "" : deaths}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
