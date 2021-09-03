import create from "zustand";

export type ReportStore = {
  selectedPull: number;
  setSelectedPull: (id: number) => void;
};

export const useReportStore = create<ReportStore>((set) => {
  return {
    selectedPull: 1,
    setSelectedPull: (id: number) => {
      set(() => ({ selectedPull: id }));
    },
  };
});

export type MapOptionsStore = {
  visible: boolean;
  mapChangeColor: null | string;
  renderPullConnectionLines: boolean;
  renderMapChangeLines: boolean;
  renderPOIs: boolean;

  toggleMapOptions: () => void;
  togglePullConnectionLines: () => void;
  toggleMapChangeLines: () => void;
  togglePOIs: () => void;
};

export const useMapOptions = create<MapOptionsStore>((set) => {
  return {
    visible: false,
    mapChangeColor: null,
    renderPullConnectionLines: true,
    renderMapChangeLines: true,
    renderPOIs: true,
    toggleMapChangeLines: () => {
      set((state) => {
        return {
          renderMapChangeLines: !state.renderMapChangeLines,
        };
      });
    },
    togglePOIs: () => {
      set((state) => {
        return {
          renderPOIs: !state.renderPOIs,
        };
      });
    },
    togglePullConnectionLines: () => {
      set((state) => {
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
  };
});
