import { model, Schema } from "mongoose";
import { IAuthProvider, IOnlineStatus, IUser, Role } from "./user.interface";

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

    gender: { type: String, required: true },
    dateOfBirth: { type: Date },
    phone: { type: String },
    image: { type: String },
    address: { type: String },

    isDeleted: { type: Boolean },
    isVerified: { type: Boolean },
    isActive: { type: Boolean },

    onlineStatus: { type: String, enum: Object.values(IOnlineStatus) },

    rides: [{ type: Schema.Types.ObjectId, ref: "Ride" }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);
