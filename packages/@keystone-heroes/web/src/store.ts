import create from "zustand";

export type ReportStore = {
  selectedPull: number;
  setSelectedPull: (id: number) => void;
};

export const useReportStore = create<ReportStore>((set) => ({
  selectedPull: 1,
  setSelectedPull: (id: number) => {
    set(() => ({ selectedPull: id }));
  },
}));
