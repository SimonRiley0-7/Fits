import { create } from "zustand";

interface AppStore {
  user: any;
  items: any[];
  loading: boolean;
  setUser:   (user: any) => void;
  setItems:  (items: any[]) => void;
  addItem:   (item: any) => void;
  setLoading:(v: boolean) => void;
}

export const useStore = create<AppStore>((set) => ({
  user: null, items: [], loading: false,
  setUser:    (user)    => set({ user }),
  setItems:   (items)   => set({ items }),
  addItem:    (item)    => set((s) => ({ items: [...s.items, item] })),
  setLoading: (loading) => set({ loading }),
}));
