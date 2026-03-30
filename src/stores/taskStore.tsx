import { create } from "zustand";
import type { task } from "@/types/task";

interface TaskStore {
  task: task | null;
  setTask: (task: task | null) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  task: null,
  setTask: (task) => set({ task }),
}));
