"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const userToken_1 = require("../../utils/userToken");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const user_interface_1 = require("../user/user.interface");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../../utils/sendEmail");
const getNewAccessToken = async (refreshToken) => {
    const newAccessToken = await (0, userToken_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return { accessToken: newAccessToken };
};
const changePassword = async (oldPassword, newPassword, decodedToken) => {
    const user = await user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (newPassword === oldPassword) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "New password cannot be the same as the old password");
    }
    const isOldPasswordMatch = await bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Old password does not match");
    }
    user.password = await bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    await user.save();
};
const setPassword = async (userId, newPassword) => {
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (user.password &&
        user.auths.some((providerObj) => providerObj.provider === "google")) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password already set. You can update it from your profile settings.");
    }
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const credentialsProvider = {
        provider: "credentials",
        providerId: user.email,
    };
    const auths = [...user.auths, credentialsProvider];
    user.password = hashedPassword;
    user.auths = auths;
    await user.save();
};
const forgotPassword = async (email) => {
    const isUserExist = await user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User does not Exist");
    }
    if (!isUserExist.isVerified) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is not Verified");
    }
    if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED ||
        isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `User is ${isUserExist.isActive}`);
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is deleted");
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m",
    });
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
    (0, sendEmail_1.sendEmail)({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink,
        },
    });
};
const resetPassword = async (payload, decodedToken) => {
    if (payload.id != decodedToken.userId) {
        throw new AppError_1.default(401, "You can not reset you password");
    }
    const isUserExist = await user_model_1.User.findById(decodedToken.userId);
    if (!isUserExist) {
        throw new AppError_1.default(404, "User does not exist");
    }
    const hashedPassword = await bcryptjs_1.default.hash(payload.newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    isUserExist.password = hashedPassword;
    await isUserExist.save();
};
exports.AuthServices = {
    getNewAccessToken,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword,
};
