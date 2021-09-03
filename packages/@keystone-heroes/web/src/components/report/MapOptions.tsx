import { useMapOptions } from "src/store";

// eslint-disable-next-line import/no-default-export
export default function MapOptions(): JSX.Element {
  const onClose = useMapOptions((state) => state.toggleMapOptions);

  const toggleMapChangeLines = useMapOptions(
    (state) => state.toggleMapChangeLines
  );
  const togglePullConnectionLines = useMapOptions(
    (state) => state.togglePullConnectionLines
  );

  const renderMapChangeLines = useMapOptions(
    (state) => state.renderMapChangeLines
  );
  const renderPullConnectionLines = useMapOptions(
    (state) => state.renderPullConnectionLines
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

      <button onClick={onClose} type="button">
        close
      </button>
    </div>
  );
}
