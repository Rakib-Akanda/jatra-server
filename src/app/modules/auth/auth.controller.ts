/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { createAccessToken } from "../../utils/userToken";
import { setAuthCookie } from "../../utils/setCookie";
import { sendResponse } from "../../utils/sendResponse";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (error: any, user: any, info: any) => {
      if (error) {
        return next(new AppError(error.statusCode || 401, error.message));
      }
      if (!user) {
        return next(
          new AppError(
            StatusCodes.UNAUTHORIZED,
            info.message || "Authentication Failed"
          )
        );
      }
      const userToken = await createAccessToken(user);
      setAuthCookie(res, userToken);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "User logged in successfully",
        data: {
          accessToken: userToken.accessToken,
          refreshToken: userToken.refreshToken,
          user,
        },
      });
    })(req, res, next);
  }
);

export const AuthController = {
  credentialsLogin,
};
