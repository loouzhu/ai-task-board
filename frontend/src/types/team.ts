export interface team {
  teamId: string;
  teamName: string;
  teamMembers: string[];
  ownerId?: string;
}

export interface teamPayload {
  teamName: string;
  teamMembers: string[];
}
