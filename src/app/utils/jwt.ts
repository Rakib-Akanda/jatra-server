/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);
  return token;
};

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: any) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or Expired Token");
  }
};
