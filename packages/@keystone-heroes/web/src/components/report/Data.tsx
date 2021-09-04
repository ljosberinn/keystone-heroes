import { Pulls } from "./Pulls";

export function Data(): JSX.Element {
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
        <Pulls />
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
