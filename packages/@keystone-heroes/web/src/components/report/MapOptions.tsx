import { useReportStore } from "src/store";

export type MapOptionProps = {
  onClose: () => void;
};

// eslint-disable-next-line import/no-default-export
export default function MapOptions({ onClose }: MapOptionProps): JSX.Element {
  const toggleMapChangeLines = useReportStore(
    (state) => state.toggleMapChangeLines
  );
  const togglePullConnectionLines = useReportStore(
    (state) => state.togglePullConnectionLines
  );

  const renderMapChangeLines = useReportStore(
    (state) => state.mapOptions.renderMapChangeLines
  );
  const renderPullConnectionLines = useReportStore(
    (state) => state.mapOptions.renderPullConnectionLines
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
