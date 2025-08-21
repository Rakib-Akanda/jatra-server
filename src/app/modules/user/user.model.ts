import { model, Schema } from "mongoose";
import {
  IAuthProvider,
  IOnlineStatus,
  IsActive,
  IUser,
  Role,
} from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { versionKey: false, _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(Role), default: Role.RIDER },
    auths: [authProviderSchema],
    password: { type: String },

    gender: { type: String },
    dateOfBirth: { type: Date },
    phone: { type: String },
    image: { type: String },
    address: { type: String },

    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },

    onlineStatus: { type: String, enum: Object.values(IOnlineStatus) },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);
