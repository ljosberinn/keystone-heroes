import type { FightSuccessResponse } from "@keystone-heroes/api/functions/fight";
import { useFightIDContext } from "src/pages/report/[reportID]/[fightID]";

import { AbilityIcon } from "../AbilityIcon";

type TormentedPowersProps = Pick<FightSuccessResponse, "player"> & {
  lieutenantOrder: { name: string; pullID: number }[];
};

export function TormentedPowers({
  player,
  lieutenantOrder,
}: TormentedPowersProps): JSX.Element {
  const { handlePullSelectionChange, selectedPull } = useFightIDContext();

  return (
    <>
      <h1 className="pt-4">Tormented Powers</h1>
      {Array.from({ length: 4 }, (_, index) => {
        const lieutenant = lieutenantOrder[index];
        const selected = lieutenant
          ? selectedPull === lieutenant.pullID
          : false;

        return (
          <div className="flex justify-between pt-2" key={index}>
            <div className="flex space-x-1">
              {player.map((player) => {
                const power = player.tormented[index];

                return (
                  <div className="w-8 h-8" key={player.actorID}>
                    <AbilityIcon
                      icon={power?.ability?.icon}
                      alt={power?.ability?.name ?? "Skipped"}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                );
              })}

              {lieutenant && (
                <button
                  type="button"
                  className={`pl-1 ${selected ? "cursor-forbidden" : ""}`}
                  disabled={selected}
                  onClick={() => {
                    handlePullSelectionChange(lieutenant.pullID);
                  }}
                >
                  {lieutenant.name}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
