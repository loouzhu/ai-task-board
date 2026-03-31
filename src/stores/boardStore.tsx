import { create } from "zustand";

interface BoardStore {
  boardMembers: string[];
  setBoardMembers: (boardMembers: string[]) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  boardMembers: [],
  setBoardMembers: (boardMembers) => set({ boardMembers }),
}));
