import { randomUUID } from "crypto";
import mongoose from "mongoose";

export interface BoardRecord {
  boardId: string;
  teamId: string;
  boardName: string;
  createdAt: Date;
  createdBy: string;
  boardMembers: string[];
}

const boardSchema = new mongoose.Schema<BoardRecord>({
  boardId: {
    type: String,
    required: true,
    unique: true,
    default: () => randomUUID(),
  },
  teamId: {
    type: String,
    required: [true, "团队ID是必填项"],
    index: true,
  },
  boardName: {
    type: String,
    required: [true, "看板名称是必填项"],
    trim: true,
    minLength: [3, "看板名称至少为3个字符"],
    maxLength: [8, "看板名称最多为8个字符"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
  boardMembers: {
    type: [String],
    required: false,
    default: [],
  },
});

boardSchema.index({ teamId: 1, boardName: 1 });

boardSchema.pre("validate", function () {
  const board = this as mongoose.HydratedDocument<BoardRecord>;
  if (!board.boardId) {
    board.boardId = randomUUID();
  }
});

const Board = mongoose.model<BoardRecord>("Board", boardSchema);

export default Board;
