import { create } from "zustand";
import type { User } from "@/types/user";

interface boardStore {
  boardMembers: User[];
  setBoardMembers: (members: User[]) => void;
}

export const useBoardStore = create<boardStore>((set) => ({
  boardMembers: [],
  setBoardMembers: (members: User[]) => set({ boardMembers: members }),
}));
