import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exist");
  }
  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...userWithoutPassword } = user.toObject();

  return userWithoutPassword;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
    if (userId !== decodedToken.userId) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
    }
  }
  const isUserExist = await User.findById(userId).select("-password");
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User Not Found");
  }
  if (isUserExist.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, "Cannot update a deleted user");
  }
  if (
    decodedToken.role === Role.ADMIN &&
    isUserExist.role === Role.SUPER_ADMIN
  ) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
  }
  if (payload.role) {
    if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
    }
  }
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select("-password");

  return newUpdateUser;
};
const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const users = await queryBuilder.filter().sort().fields().paginate();
  const [data, meta] = await Promise.all([
    users.build(),
    queryBuilder.getMeta(),
  ]);
  return { meta: meta, data: data };
};
const getMe = async (userId: string) => {
  const users = await User.findById(userId).select("-password");
  return { data: users };
};
const getSingleUser = async (userId: string) => {
  const users = await User.findById(userId).select("-password");
  return { data: users };
};
const blockUser = async (userId: string, decodedToken: JwtPayload) => {
  if (!userId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User id not found");
  }
  if (![Role.ADMIN, Role.SUPER_ADMIN].includes(decodedToken.role)) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not authorized to access this resource"
    );
  }
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  if (user.isActive === IsActive.BLOCKED) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User already blocked");
  }
  if (
    decodedToken.role === Role.ADMIN &&
    (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN)
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not permitted to block this user"
    );
  }
  const blockedUser = await User.findByIdAndUpdate(
    userId,
    {
      isActive: IsActive.BLOCKED,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");
  return blockedUser;
};
const unblockUser = async (userId: string, decodedToken: JwtPayload) => {
  if (!userId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User id is required");
  }

  if (![Role.ADMIN, Role.SUPER_ADMIN].includes(decodedToken.role)) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not authorized to access this resource"
    );
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  if (user.isActive !== IsActive.BLOCKED) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User already unblocked");
  }
  if (
    decodedToken.role === Role.ADMIN &&
    (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN)
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not permitted to unblock this user"
    );
  }
  const unblockedUser = await User.findByIdAndUpdate(
    userId,
    { isActive: IsActive.ACTIVE },
    { new: true, runValidators: true }
  ).select("-password");

  return unblockedUser;
};
export const UserServices = {
  createUser,
  updateUser,
  getAllUsers,
  getMe,
  getSingleUser,
  blockUser,
  unblockUser,
};
