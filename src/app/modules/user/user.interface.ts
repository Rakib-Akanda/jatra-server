import { Types } from "mongoose";

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export enum IOnlineStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  role: Role;
  auths: IAuthProvider[];
  password?: string;

  gender: string;
  dateOfBirth?: Date;
  phone?: string;
  image?: string;
  address?: string;

  isDeleted?: boolean;
  isVerified?: boolean;
  isActive?: IsActive;

  onlineStatus?: IOnlineStatus;
  
  rides?: Types.ObjectId[];
  createdAt?: Date;
}
