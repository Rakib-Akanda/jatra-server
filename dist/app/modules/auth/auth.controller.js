"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const passport_1 = __importDefault(require("passport"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = require("http-status-codes");
const userToken_1 = require("../../utils/userToken");
const setCookie_1 = require("../../utils/setCookie");
const sendResponse_1 = require("../../utils/sendResponse");
const auth_service_1 = require("./auth.service");
const env_1 = require("../../config/env");
const credentialsLogin = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    passport_1.default.authenticate("local", async (error, user, info) => {
        if (error) {
            return next(new AppError_1.default(error.statusCode || 401, error.message));
        }
        if (!user) {
            return next(new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, info.message || "Authentication Failed"));
        }
        const userToken = await (0, userToken_1.createAccessToken)(user);
        (0, setCookie_1.setAuthCookie)(res, userToken);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: "User logged in successfully",
            data: {
                accessToken: userToken.accessToken,
                refreshToken: userToken.refreshToken,
                user,
            },
        });
    })(req, res, next);
});
const getNewAccessToken = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No refresh token from cookies");
    }
    const tokenInfo = await auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "New Access token Retrieve Successfully",
        data: tokenInfo,
    });
});
const logout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: env_1.envVars.NODE_ENV === "production",
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: env_1.envVars.NODE_ENV === "production",
        sameSite: "lax",
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "User Logged Out Successfully",
        data: null,
    });
});
const changePassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    await auth_service_1.AuthServices.changePassword(oldPassword, newPassword, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Password Changed Successfully",
        data: null,
    });
});
const setPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { password } = req.body;
    const decodedToken = req.user;
    await auth_service_1.AuthServices.setPassword(decodedToken.userId, password);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Password Set Successfully",
        data: null,
    });
});
const forgotPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email } = req.body;
    await auth_service_1.AuthServices.forgotPassword(email);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Please check your email to reset your password.",
        data: null,
    });
});
const resetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    await auth_service_1.AuthServices.resetPassword(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Password Changed successfully",
        data: null,
    });
});
const googleCallbackController = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const tokenInfo = (0, userToken_1.createAccessToken)(user);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirectTo}`);
});
exports.AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword,
    googleCallbackController,
};
