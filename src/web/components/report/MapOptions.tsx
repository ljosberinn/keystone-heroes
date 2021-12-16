import type { MapOptionsStore } from "../../store";
import { useMapOptions } from "../../store";
import { Dialog } from "../Dialog";

// eslint-disable-next-line import/no-default-export
export default function MapOptions(): JSX.Element {
  const toggleMapOptions = useMapOptions((state) => state.toggleMapOptions);

  return (
    <Dialog
      defaultOpen
      as="section"
      // className="absolute top-0 left-0 w-full h-full p-4 text-white bg-stone-500 dark:bg-gray-500 dark:bg-opacity-70 bg-opacity-70"
      aria-labelledby="map-options-heading"
      onClose={toggleMapOptions}
    >
      <h1 id="map-options-heading" className="text-xl font-bold">
        Map Options
      </h1>

      <h2 className="pt-4 pb-2 text-lg font-bold">General</h2>
      <div className="space-y-2">
        <MapChangeLines />
        <PullConnectionLines />
        <PointsOfInterest />
        <BossKillIndicatorToggle />
        <TormentedKillIndicatorToggle />
      </div>

      <h2 className="pt-4 pb-2 text-lg font-bold">Colors</h2>
      <div className="space-y-2">
        <PullConnectionLineColor />
        <InvisPullConnectionLineColor />
      </div>
    </Dialog>
  );
}

const bossKillIndicatorSelector = ({
  toggleBossKillIndicator,
  renderBossKillIndicator,
}: MapOptionsStore) => ({
  toggleBossKillIndicator,
  renderBossKillIndicator,
});

function BossKillIndicatorToggle() {
  const { renderBossKillIndicator, toggleBossKillIndicator } = useMapOptions(
    bossKillIndicatorSelector
  );

  return (
    <div className="space-x-2">
      <input
        className="cursor-pointer"
        type="checkbox"
        checked={renderBossKillIndicator}
        onChange={toggleBossKillIndicator}
        id="toggleBossKillIndicator"
        aria-labelledby="toggleBossKillIndicator"
      />
      <label htmlFor="toggleBossKillIndicator" className="cursor-pointer">
        toggle boss kill indicator
      </label>
    </div>
  );
}

const tormentedKillIndicatorSelector = ({
  toggleTormentedKillIndicator,
  renderTormentedKillIndicator,
}: MapOptionsStore) => ({
  toggleTormentedKillIndicator,
  renderTormentedKillIndicator,
});

function TormentedKillIndicatorToggle() {
  const { renderTormentedKillIndicator, toggleTormentedKillIndicator } =
    useMapOptions(tormentedKillIndicatorSelector);

  return (
    <div className="space-x-2">
      <input
        className="cursor-pointer"
        type="checkbox"
        checked={renderTormentedKillIndicator}
        onChange={toggleTormentedKillIndicator}
        id="toggleTormentedKillIndicator"
        aria-labelledby="toggleTormentedKillIndicator"
      />
      <label htmlFor="toggleTormentedKillIndicator" className="cursor-pointer">
        toggle tormented kill indicator
      </label>
    </div>
  );
}

const mapChangeLinesSelector = ({
  toggleMapChangeLines,
  renderMapChangeLines,
}: MapOptionsStore) => ({
  toggleMapChangeLines,
  renderMapChangeLines,
});

function MapChangeLines() {
  const { toggleMapChangeLines, renderMapChangeLines } = useMapOptions(
    mapChangeLinesSelector
  );

  return (
    <div className="space-x-2">
      <input
        className="cursor-pointer"
        type="checkbox"
        checked={renderMapChangeLines}
        onChange={toggleMapChangeLines}
        id="toggleMapChangeLines"
        aria-labelledby="toggleMapChangeLines"
      />
      <label htmlFor="toggleMapChangeLines" className="cursor-pointer">
        toggle mapchange lines
      </label>
    </div>
  );
}

const pullConnectionLineSelector = ({
  togglePullConnectionLines,
  renderPullConnectionLines,
}: MapOptionsStore) => ({
  togglePullConnectionLines,
  renderPullConnectionLines,
});

function PullConnectionLines() {
  const { togglePullConnectionLines, renderPullConnectionLines } =
    useMapOptions(pullConnectionLineSelector);

  return (
    <div className="space-x-2">
      <input
        className="cursor-pointer"
        type="checkbox"
        checked={renderPullConnectionLines}
        onChange={togglePullConnectionLines}
        id="togglePullConnectionLines"
        aria-labelledby="togglePullConnectionLines"
      />

      <label htmlFor="togglePullConnectionLines" className="cursor-pointer">
        toggle pull connection lines
      </label>
    </div>
  );
}

const pointsOfInterestSelector = ({
  togglePOIs,
  renderPOIs,
}: MapOptionsStore) => ({
  togglePOIs,
  renderPOIs,
});

function PointsOfInterest() {
  const { togglePOIs, renderPOIs } = useMapOptions(pointsOfInterestSelector);

  return (
    <div className="space-x-2">
      <input
        className="cursor-pointer"
        type="checkbox"
        checked={renderPOIs}
        onChange={togglePOIs}
        id="togglePOIs"
        aria-labelledby="togglePOIs"
      />
      <label htmlFor="togglePOIs" className="cursor-pointer">
        toggle points of interests
      </label>
    </div>
  );
}

const pullConnectionLineColorSelector = ({
  setPullConnectionLineColor,
  resetPullConnectionLineColor,
  pullConnectionLineColor,
}: MapOptionsStore) => ({
  setPullConnectionLineColor,
  resetPullConnectionLineColor,
  pullConnectionLineColor,
});

function PullConnectionLineColor() {
  const {
    setPullConnectionLineColor,
    resetPullConnectionLineColor,
    pullConnectionLineColor,
  } = useMapOptions(pullConnectionLineColorSelector);

  return (
    <div className="space-x-2">
      <input
        className="bg-transparent cursor-pointer"
        type="color"
        id="pullConnectionLineColor"
        aria-labelledby="pullConnectionLineColor"
        onChange={(event) => {
          setPullConnectionLineColor(event.target.value);
        }}
        value={pullConnectionLineColor}
      />
      <label htmlFor="pullConnectionLineColor" className="cursor-pointer">
        color of lines between pulls
      </label>
      <button type="button" onClick={resetPullConnectionLineColor}>
        reset
      </button>
    </div>
  );
}

const invisPullConnectionLineColorSelector = ({
  setInvisPullConnectionLineColor,
  resetInvisPullConnectionLineColor,
  invisPullConnectionLineColor,
}: MapOptionsStore) => ({
  setInvisPullConnectionLineColor,
  resetInvisPullConnectionLineColor,
  invisPullConnectionLineColor,
});

function InvisPullConnectionLineColor() {
  const {
    setInvisPullConnectionLineColor,
    resetInvisPullConnectionLineColor,
    invisPullConnectionLineColor,
  } = useMapOptions(invisPullConnectionLineColorSelector);

  return (
    <div className="space-x-2">
      <input
        className="bg-transparent cursor-pointer"
        type="color"
        id="invisPullConnectionLineColor"
        aria-labelledby="invisPullConnectionLineColor"
        onChange={(event) => {
          setInvisPullConnectionLineColor(event.target.value);
        }}
        value={invisPullConnectionLineColor}
      />
      <label htmlFor="invisPullConnectionLineColor" className="cursor-pointer">
        color of lines between pulls when invisibility was used
      </label>
      <button type="button" onClick={resetInvisPullConnectionLineColor}>
        reset
      </button>
    </div>
  );
}
