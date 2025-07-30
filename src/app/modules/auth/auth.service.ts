/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userToken";
import AppError from "../../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";
import { Request } from "express";
import { getCurrentLocationWithIP } from "../../utils/getCurrentLocation";
import { Driver } from "../driver/driver.model";
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken =
    await createNewAccessTokenWithRefreshToken(refreshToken);
  return { accessToken: newAccessToken };
};
const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  if (newPassword === oldPassword) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "New password cannot be the same as the old password"
    );
  }
  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Old password does not match");
  }
  user.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  await user.save();
};
const setPassword = async (userId: string, newPassword: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  if (
    user.password &&
    user.auths.some((providerObj) => providerObj.provider === "google")
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Password already set. You can update it from your profile settings."
    );
  }

  const hashedPassword = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  const credentialsProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };
  const auths: IAuthProvider[] = [...user.auths, credentialsProvider];

  user.password = hashedPassword;
  user.auths = auths;
  await user.save();
};
const forgotPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User does not Exist");
  }
  if (!isUserExist.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not Verified");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `User is ${isUserExist.isActive}`
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted");
  }
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });
  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });
};
const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id != decodedToken.userId) {
    throw new AppError(401, "You can not reset you password");
  }
  const isUserExist = await User.findById(decodedToken.userId);
  if (!isUserExist) {
    throw new AppError(404, "User does not exist");
  }
  const hashedPassword = await bcryptjs.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  isUserExist.password = hashedPassword;

  await isUserExist.save();
};
const setCurrentLocationForDriver = async (
  req: Request,
  user: Partial<IUser>
) => {
  const currentLocation = await getCurrentLocationWithIP(req);
  if (currentLocation.status) {
    await Driver.findOneAndUpdate(
      { userId: user._id },
      {
        currentLocation: currentLocation.currentLocation,
      },
      { runValidators: true }
    );
  }
};

export const AuthServices = {
  getNewAccessToken,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword,
  setCurrentLocationForDriver,
};
