"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const passport_1 = __importDefault(require("passport"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = require("http-status-codes");
const userToken_1 = require("../../utils/userToken");
const setCookie_1 = require("../../utils/setCookie");
const sendResponse_1 = require("../../utils/sendResponse");
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
exports.AuthController = {
    credentialsLogin,
};
