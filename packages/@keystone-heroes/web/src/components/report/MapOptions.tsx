import { useMapOptions } from "../../store";
import { Dialog } from "../Dialog";

// eslint-disable-next-line import/no-default-export
export default function MapOptions(): JSX.Element {
  return (
    <Dialog
      defaultOpen
      as="section"
      // className="absolute top-0 left-0 w-full h-full p-4 text-white bg-gray-500 dark:bg-coolgray-500 dark:bg-opacity-70 bg-opacity-70"
      aria-labelledby="map-options-heading"
    >
      <h1 id="map-options-heading" className="text-xl font-bold">
        Map Options
      </h1>

      <h2 className="pt-4 pb-2 text-lg font-bold">General</h2>
      <div className="space-y-2">
        <MapChangeLines />
        <PullConnectionLines />
        <PointsOfInterest />
      </div>

      <h2 className="pt-4 pb-2 text-lg font-bold">Colors</h2>
      <div className="space-y-2">
        <PullConnectionLineColor />
        <InvisPullConnectionLineColor />
      </div>
    </Dialog>
  );
}

function MapChangeLines() {
  const toggleMapChangeLines = useMapOptions(
    (state) => state.toggleMapChangeLines
  );
  const renderMapChangeLines = useMapOptions(
    (state) => state.renderMapChangeLines
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

function PullConnectionLines() {
  const togglePullConnectionLines = useMapOptions(
    (state) => state.togglePullConnectionLines
  );

  const renderPullConnectionLines = useMapOptions(
    (state) => state.renderPullConnectionLines
  );

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

function PointsOfInterest() {
  const togglePOIs = useMapOptions((state) => state.togglePOIs);
  const renderPOIs = useMapOptions((state) => state.renderPOIs);

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

function PullConnectionLineColor() {
  const setPullConnectionLineColor = useMapOptions(
    (state) => state.setPullConnectionLineColor
  );
  const resetPullConnectionLineColor = useMapOptions(
    (state) => state.resetPullConnectionLineColor
  );
  const pullConnectionLineColor = useMapOptions(
    (state) => state.pullConnectionLineColor
  );

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

function InvisPullConnectionLineColor() {
  const setInvisPullConnectionLineColor = useMapOptions(
    (state) => state.setInvisPullConnectionLineColor
  );
  const resetInvisPullConnectionLineColor = useMapOptions(
    (state) => state.resetInvisPullConnectionLineColor
  );
  const invisPullConnectionLineColor = useMapOptions(
    (state) => state.invisPullConnectionLineColor
  );

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
