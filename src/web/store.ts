import { useEffect } from "react";
import create from "zustand";

import { ls } from "./utils/localStorage";

export type ReportStore = {
  selectedPull: number;
  setSelectedPull: (id: number) => void;
};

export const reportStoreSelector = ({
  selectedPull,
  setSelectedPull,
}: ReportStore): ReportStore => ({
  selectedPull,
  setSelectedPull,
});

export const useReportStore = create<ReportStore>((set) => {
  return {
    selectedPull: 1,
    setSelectedPull: (id: number) => {
      set(() => ({
        selectedPull: id,
      }));
    },
  };
});

const defaultPullConnectionLineColor = "#22c55e";
const defaultInvisPullConnectionLineColor = "#ef4444";

export type MapOptionsStore = {
  visible: boolean;
  mapChangeColor: null | string;
  renderPullConnectionLines: boolean;
  renderMapChangeLines: boolean;
  renderPOIs: boolean;
  pullConnectionLineColor: string;
  invisPullConnectionLineColor: string;
  renderBossKillIndicator: boolean;
  renderTormentedKillIndicator: boolean;

  toggleBossKillIndicator: () => void;
  toggleTormentedKillIndicator: () => void;
  toggleMapOptions: () => void;
  togglePullConnectionLines: () => void;
  toggleMapChangeLines: () => void;
  togglePOIs: () => void;
  setPullConnectionLineColor: (value: string) => void;
  setInvisPullConnectionLineColor: (value: string) => void;
  resetPullConnectionLineColor: () => void;
  resetInvisPullConnectionLineColor: () => void;
  restoreFromLocalStorage: () => void;
};

export const useMapOptions = create<MapOptionsStore>((set) => {
  return {
    visible: false,
    mapChangeColor: null,
    renderPullConnectionLines: true,
    renderMapChangeLines: true,
    renderPOIs: true,
    renderBossKillIndicator: true,
    renderTormentedKillIndicator: true,

    toggleBossKillIndicator: () => {
      set((state) => {
        persistMapOptions(
          "renderBossKillIndicator",
          state.renderBossKillIndicator ? "0" : true
        );

        return {
          renderBossKillIndicator: !state.renderBossKillIndicator,
        };
      });
    },
    toggleTormentedKillIndicator: () => {
      set((state) => {
        persistMapOptions(
          "renderTormentedKillIndicator",
          state.renderTormentedKillIndicator ? "0" : true
        );

        return {
          renderTormentedKillIndicator: !state.renderTormentedKillIndicator,
        };
      });
    },

    toggleMapChangeLines: () => {
      set((state) => {
        persistMapOptions(
          "renderMapChangeLines",
          state.renderMapChangeLines ? "0" : true
        );

        return {
          renderMapChangeLines: !state.renderMapChangeLines,
        };
      });
    },
    togglePOIs: () => {
      set((state) => {
        persistMapOptions("renderPOIs", state.renderPOIs ? "0" : true);

        return {
          renderPOIs: !state.renderPOIs,
        };
      });
    },
    togglePullConnectionLines: () => {
      set((state) => {
        persistMapOptions(
          "renderPullConnectionLines",
          state.renderPullConnectionLines ? "0" : true
        );

        return {
          renderPullConnectionLines: !state.renderPullConnectionLines,
        };
      });
    },
    toggleMapOptions: () => {
      set((state) => {
        return {
          visible: !state.visible,
        };
      });
    },

    pullConnectionLineColor: defaultPullConnectionLineColor,
    setPullConnectionLineColor: (value: string) => {
      set({
        pullConnectionLineColor: value,
      });

      persistMapOptions("pullConnectionLineColor", value);
    },
    resetPullConnectionLineColor: () => {
      set({
        pullConnectionLineColor: defaultPullConnectionLineColor,
      });

      persistMapOptions("pullConnectionLineColor", true);
    },

    invisPullConnectionLineColor: defaultInvisPullConnectionLineColor,
    resetInvisPullConnectionLineColor: () => {
      set({
        invisPullConnectionLineColor: defaultInvisPullConnectionLineColor,
      });

      persistMapOptions("invisPullConnectionLineColor", true);
    },
    setInvisPullConnectionLineColor: (value: string) => {
      set({
        invisPullConnectionLineColor: value,
      });

      persistMapOptions("invisPullConnectionLineColor", value);
    },

    restoreFromLocalStorage: () => {
      const mapOptionsString = ls.get(lsMapOptionsKey);

      if (!mapOptionsString) {
        return;
      }

      try {
        const mapOptionsRaw = JSON.parse(mapOptionsString);

        const mapOptions = Object.fromEntries(
          Object.entries(mapOptionsRaw).map(([key, value]) => [
            key,
            value === "0" ? false : value,
          ])
        ) as Parameters<typeof set>[0];

        set(mapOptions);
      } catch {
        // eslint-disable-next-line no-console
        console.error(
          "[Keystone Heroes] - failed to restore settings from localStorage"
        );
      }
    },
  };
});

const lsMapOptionsKey = "mapOptions";

const persistMapOptions = (key: string, valueOrDropFlag: string | boolean) => {
  const mapOptionsString = ls.get(lsMapOptionsKey);

  if (mapOptionsString) {
    const mapOptions = JSON.parse(mapOptionsString);
    const nextMapOptions =
      typeof valueOrDropFlag === "string"
        ? {
            ...mapOptions,
            [key]: valueOrDropFlag,
          }
        : Object.fromEntries(
            Object.entries(mapOptions).filter((dataset) => dataset[0] !== key)
          );

    if (Object.keys(nextMapOptions).length === 0) {
      ls.remove(lsMapOptionsKey);
      return;
    }

    ls.set(lsMapOptionsKey, JSON.stringify(nextMapOptions));
    return;
  }

  if (typeof valueOrDropFlag === "string") {
    const initialOptions = { [key]: valueOrDropFlag };

    ls.set(lsMapOptionsKey, JSON.stringify(initialOptions));
  }
};

export const useRestoreMapOptions = (): void => {
  const restoreFromLocalStorage = useMapOptions(
    (state) => state.restoreFromLocalStorage
  );

  useEffect(restoreFromLocalStorage, [restoreFromLocalStorage]);
};

type Legend = {
  visible: boolean;
  toggle: () => void;
};

export const useLegend = create<Legend>((set) => {
  return {
    visible: false,
    toggle: () => {
      set((state) => ({ visible: !state.visible }));
    },
  };
});

type PullSettings = {
  useAbsoluteTimestamps: boolean;
  toggleAbsoluteTimestamps: () => void;

  trackedPlayers: number[];
  toggleTrackedPlayer: (id: number) => void;

  open: boolean;
  toggle: () => void;
};

export const usePullSettings = create<PullSettings>((set) => {
  return {
    open: false,
    toggle: () => {
      set((state) => ({ open: !state.open }));
    },
    useAbsoluteTimestamps: false,
    toggleAbsoluteTimestamps: () => {
      set((state) => ({ useAbsoluteTimestamps: !state.useAbsoluteTimestamps }));
    },
    trackedPlayers: [],
    toggleTrackedPlayer: (id) => {
      set((state) => {
        return {
          trackedPlayers: state.trackedPlayers.includes(id)
            ? state.trackedPlayers.filter((player) => player !== id)
            : [...state.trackedPlayers, id],
        };
      });
    },
  };
});
