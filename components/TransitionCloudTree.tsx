import { create } from "zustand";

export type ActiveCloud = {
  key: keyof typeof import("@/data/clouds").CLOUDS;
  rect: DOMRect;
};

type StoreState = {
  activeCloud: ActiveCloud | null;
  setActiveCloud: (data: ActiveCloud) => void;
  clear: () => void;
};

export const useTransitionStore = create<StoreState>((set) => ({
  activeCloud: null,
  setActiveCloud: (data) => set({ activeCloud: data }),
  clear: () => set({ activeCloud: null }),
}));
