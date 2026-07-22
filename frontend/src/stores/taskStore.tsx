import { create } from "zustand";
import type { task } from "@/types/task";
import type { taskFilterParams } from "@/types/task";

interface TaskStore {
  task: task | null;
  filterParams: taskFilterParams;
  setTask: (task: task | null) => void;
  setFilterParams: (params: taskFilterParams) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  task: null,
  filterParams: {},
  setTask: (task) => set({ task }),
  setFilterParams: (filterParams) => set({ filterParams }),
}));
