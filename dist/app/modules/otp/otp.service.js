"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = require("../../utils/sendEmail");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = require("../user/user.model");
const redis_config_1 = require("../../config/redis.config");
const OTP_EXPIRATION = 2 * 60; // 2minute
const generateOtp = (length = 6) => {
    // 6 digit otp,
    const otp = crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString(); // 100000 - 999999
    // 10 ** 5 => 10 * 10 * 10 * 10 * 10 = 100000;
    return otp;
};
const sendOTP = async (email, name) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (user.isVerified) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "You are already verified");
    }
    const otp = generateOtp();
    const redisKey = `otp:${email}`;
    await redis_config_1.redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION,
        },
    });
    await (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp,
        },
    });
};
const verifyOTP = async (email, otp) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (user.isVerified) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "You are already verified");
    }
    const redisKey = `otp:${email}`;
    const savedOtp = await redis_config_1.redisClient.get(redisKey);
    if (!savedOtp) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid OTP");
    }
    if (savedOtp !== otp) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid OTP");
    }
    await Promise.all([
        user_model_1.User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        redis_config_1.redisClient.del([redisKey]),
    ]);
};
exports.OTPService = {
    sendOTP,
    verifyOTP,
};
