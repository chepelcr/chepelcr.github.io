import { create } from "zustand";
import { fetchGitStatus } from "./local-cms";

interface AdminUiState {
  dirty: boolean;
  save: (() => Promise<void>) | null;
  filename: string | null;
  setEditor: (e: { dirty: boolean; save: () => Promise<void>; filename: string }) => void;
  clearEditor: () => void;
  navTarget: string | null;
  requestNav: (href: string) => void;
  closeNav: () => void;
  pendingPublish: boolean;
  refreshPublish: () => Promise<void>;
}

export const useAdminUi = /*#__PURE__*/ create<AdminUiState>((set) => ({
  dirty: false,
  save: null,
  filename: null,
  setEditor: (e) => set({ dirty: e.dirty, save: e.save, filename: e.filename }),
  clearEditor: () => set({ dirty: false, save: null, filename: null }),
  navTarget: null,
  requestNav: (href) => set({ navTarget: href }),
  closeNav: () => set({ navTarget: null }),
  pendingPublish: false,
  refreshPublish: async () => {
    const status = await fetchGitStatus();
    set({ pendingPublish: Boolean(status.pending) });
  },
}));

export function guardNavigation(href: string): boolean {
  const { dirty, requestNav } = useAdminUi.getState();
  if (dirty) {
    requestNav(href);
    return true;
  }
  return false;
}
