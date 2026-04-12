import { create } from "zustand";
import type { team } from "@/types/team";

interface teamStore {
  team: team;
  setTeam: (team: team) => void;
}

export const useTeamStore = create<teamStore>((set) => ({
  team: {
    teamId: "",
    teamName: "",
    teamMembers: [],
  },
  setTeam: (team) => set({ team }),
}));
