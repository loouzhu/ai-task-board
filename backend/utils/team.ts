import { getUserMap, formatUser } from "./user";

interface TeamLike {
  teamMembers?: string[];
}

export const formatTeamInfo = async <T extends TeamLike>(teams: T[]) => {
  try {
    const userMap = await getUserMap(
      teams.flatMap((team) => team.teamMembers || []),
    );

    return teams.map((team) => ({
      ...team,
      teamMembers: (team.teamMembers || []).map((memberId) =>
        formatUser(memberId, userMap),
      ),
    }));
  } catch (error) {
    console.log(error);
    return teams;
  }
};
