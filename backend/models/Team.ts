import { randomUUID } from "crypto";
import mongoose from "mongoose";

export interface TeamRecord {
  teamId: string;
  teamName: string;
  teamMembers: string[];
  createdAt: Date;
  createdBy: string;
}

const teamSchema = new mongoose.Schema<TeamRecord>({
  teamId: {
    type: String,
    required: true,
    unique: true,
    default: () => randomUUID(),
  },
  teamName: {
    type: String,
    required: true,
  },
  teamMembers: {
    type: [String],
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
});

teamSchema.pre("validate", function () {
  const team = this as mongoose.HydratedDocument<TeamRecord>;
  if (!team.teamId) {
    team.teamId = randomUUID();
  }
});

const Team = mongoose.model<TeamRecord>("Team", teamSchema);
export default Team;
