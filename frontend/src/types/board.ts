import type { User } from "./user";

export interface boardListProps {
  boardId: string;
  boardName: string;
  boardMembers: User[];
}

export interface boardPayload {
  boardName: string;
  boardMembers: string[];
}
