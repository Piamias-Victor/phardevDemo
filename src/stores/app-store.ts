import { create } from "zustand";

interface AppState {
  isLoading: boolean;
  isMenuOpen: boolean;
  cursorVariant: "default" | "hover" | "click";
  setIsLoading: (value: boolean) => void;
  setIsMenuOpen: (value: boolean) => void;
  setCursorVariant: (variant: "default" | "hover" | "click") => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: true,
  isMenuOpen: false,
  cursorVariant: "default",
  setIsLoading: (value) => set({ isLoading: value }),
  setIsMenuOpen: (value) => set({ isMenuOpen: value }),
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
}));
