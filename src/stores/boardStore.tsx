import { create } from "zustand";

interface boardStore {
  boardMembers: string[];
  setBoardMembers: (members: string[]) => void;
}

export const useBoardStore = create<boardStore>((set) => ({
  boardMembers: [],
  setBoardMembers: (members: string[]) => set({ boardMembers: members }),
}));
