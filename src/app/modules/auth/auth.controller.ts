/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { createAccessToken } from "../../utils/userToken";
import { setAuthCookie } from "../../utils/setCookie";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

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
const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "No refresh token from cookies"
    );
  }
  const tokenInfo = await AuthServices.getNewAccessToken(
    refreshToken as string
  );
  setAuthCookie(res, tokenInfo);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "New Access token Retrieve Successfully",
    data: tokenInfo,
  });
});
const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: "lax",
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User Logged Out Successfully",
    data: null,
  });
});
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const decodedToken = req.user;
  await AuthServices.changePassword(
    oldPassword,
    newPassword,
    decodedToken as JwtPayload
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Password Changed Successfully",
    data: null,
  });
});
const setPassword = catchAsync(async (req: Request, res: Response) => {
  const { password } = req.body as JwtPayload;
  const decodedToken = req.user as JwtPayload;
  await AuthServices.setPassword(decodedToken.userId, password);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Password Set Successfully",
    data: null,
  });
});
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await AuthServices.forgotPassword(email);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Please check your email to reset your password.",
    data: null,
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user;
  await AuthServices.resetPassword(req.body, decodedToken as JwtPayload);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Password Changed successfully",
    data: null,
  });
});
const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }
    const tokenInfo = createAccessToken(user);

    setAuthCookie(res, tokenInfo);
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword,
  googleCallbackController,
};
