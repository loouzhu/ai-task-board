import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import mongoose from "mongoose";

export interface UserRecord {
  userId: string;
  username: string;
  avatar?: string;
  bio?: string;
  city?: string;
  email?: string;
  name?: string;
  position?: string;
  province?: string;
  password: string;
  createdAt: Date;
}

export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserDocument = mongoose.HydratedDocument<UserRecord, UserMethods>;
type UserModel = mongoose.Model<UserRecord, {}, UserMethods>;

const userSchema = new mongoose.Schema<UserRecord, UserModel, UserMethods>({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: () => randomUUID(),
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minLength: [3, "Username must be at least 3 characters long"],
    maxLength: [8, "Username must be at most 8 characters long"],
  },
  avatar: {
    type: String,
    trim: true,
    default: "",
  },
  bio: {
    type: String,
    trim: true,
    default: "",
  },
  city: {
    type: String,
    trim: true,
    default: "",
  },
  email: {
    type: String,
    trim: true,
    default: "",
  },
  name: {
    type: String,
    trim: true,
    default: "",
  },
  position: {
    type: String,
    trim: true,
    default: "",
  },
  province: {
    type: String,
    trim: true,
    default: "",
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [6, "Password must be at least 6 characters long"],
    maxLength: [20, "Password must be at most 20 characters long"],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("validate", function () {
  const user = this as UserDocument;
  if (!user.userId) {
    user.userId = randomUUID();
  }
});

userSchema.pre("save", async function () {
  const user = this as UserDocument;
  if (!user.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<UserRecord, UserModel>("User", userSchema);

export default User;
