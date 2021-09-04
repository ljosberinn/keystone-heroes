import { useMapOptions } from "src/store";

// eslint-disable-next-line import/no-default-export
export default function MapOptions(): JSX.Element {
  // const onClose = useMapOptions((state) => state.toggleMapOptions);

  return (
    <div className="absolute top-0 left-0 w-full h-full p-4 text-white bg-gray-500 dark:bg-coolgray-500 dark:bg-opacity-70 bg-opacity-70">
      <h1>Map Options</h1>

      <MapChangeLines />
      <PullConnectionLines />
      <PointsOfInterest />
      <PullConnectionLineColor />
      <InvisPullConnectionLineColor />
    </div>
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
    <div>
      <input
        type="checkbox"
        checked={renderMapChangeLines}
        onChange={toggleMapChangeLines}
        id="toggleMapChangeLines"
        aria-labelledby="toggleMapChangeLines"
      />
      <label htmlFor="toggleMapChangeLines">toggle mapchange lines</label>
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
    <div>
      <input
        type="checkbox"
        checked={renderPullConnectionLines}
        onChange={togglePullConnectionLines}
        id="togglePullConnectionLines"
        aria-labelledby="togglePullConnectionLines"
      />

      <label htmlFor="togglePullConnectionLines">
        toggle pull connection lines
      </label>
    </div>
  );
}

function PointsOfInterest() {
  const togglePOIs = useMapOptions((state) => state.togglePOIs);
  const renderPOIs = useMapOptions((state) => state.renderPOIs);

  return (
    <div>
      <input
        type="checkbox"
        checked={renderPOIs}
        onChange={togglePOIs}
        id="togglePOIs"
        aria-labelledby="togglePOIs"
      />
      <label htmlFor="togglePOIs">toggle points of interests</label>
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
    <div>
      <input
        type="color"
        id="pullConnectionLineColor"
        aria-labelledby="pullConnectionLineColor"
        onChange={(event) => {
          setPullConnectionLineColor(event.target.value);
        }}
        value={pullConnectionLineColor}
      />
      <label htmlFor="pullConnectionLineColor">
        change color of line between pulls
      </label>
      <button type="button" onClick={resetPullConnectionLineColor}>
        reset to default
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
    <div>
      <input
        type="color"
        id="invisPullConnectionLineColor"
        aria-labelledby="invisPullConnectionLineColor"
        onChange={(event) => {
          setInvisPullConnectionLineColor(event.target.value);
        }}
        value={invisPullConnectionLineColor}
      />
      <label htmlFor="invisPullConnectionLineColor">
        change color of line between pulls when invis was used
      </label>
      <button type="button" onClick={resetInvisPullConnectionLineColor}>
        reset to default
      </button>
    </div>
  );
}
