import create from "zustand";

export type ReportStore = {
  selectedPull: number;
  setSelectedPull: (id: number) => void;
  mapOptions: {
    visible: boolean;
    mapChangeColor: null | string;
    renderPullConnectionLines: boolean;
    renderMapChangeLines: boolean;
  };
  toggleMapOptions: () => void;
  togglePullConnectionLines: () => void;
  toggleMapChangeLines: () => void;
};

export const useReportStore = create<ReportStore>((set) => ({
  selectedPull: 1,
  setSelectedPull: (id: number) => {
    set(() => ({ selectedPull: id }));
  },
  mapOptions: {
    visible: false,
    mapChangeColor: null,
    renderPullConnectionLines: true,
    renderMapChangeLines: true,
  },
  toggleMapOptions: () => {
    set((state) => ({
      mapOptions: { ...state.mapOptions, visible: !state.mapOptions.visible },
    }));
  },
  togglePullConnectionLines: () => {
    set((state) => ({
      mapOptions: {
        ...state.mapOptions,
        renderPullConnectionLines: !state.mapOptions.renderPullConnectionLines,
      },
    }));
  },
  toggleMapChangeLines: () => {
    set((state) => ({
      mapOptions: {
        ...state.mapOptions,
        renderMapChangeLines: !state.mapOptions.renderMapChangeLines,
      },
    }));
  },
}));
