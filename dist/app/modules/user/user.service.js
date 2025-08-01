"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const createUser = async (payload) => {
    const { email, password, ...rest } = payload;
    const isUserExist = await user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User Already Exist");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = await user_model_1.User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
};
const updateUser = async (userId, payload, decodedToken) => {
    if (decodedToken.role === user_interface_1.Role.RIDER || decodedToken.role === user_interface_1.Role.DRIVER) {
        if (userId !== decodedToken.userId) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized");
        }
    }
    const isUserExist = await user_model_1.User.findById(userId).select("-password");
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User Not Found");
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Cannot update a deleted user");
    }
    if (decodedToken.role === user_interface_1.Role.ADMIN &&
        isUserExist.role === user_interface_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.RIDER || decodedToken.role === user_interface_1.Role.DRIVER) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized");
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === user_interface_1.Role.RIDER || decodedToken.role === user_interface_1.Role.DRIVER) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not authorized");
        }
    }
    const newUpdateUser = await user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    }).select("-password");
    return newUpdateUser;
};
const getAllUsers = async (query) => {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const users = await queryBuilder.filter().sort().fields().paginate();
    const [data, meta] = await Promise.all([
        users.build(),
        queryBuilder.getMeta(),
    ]);
    return { meta: meta, data: data };
};
const getMe = async (userId) => {
    const users = await user_model_1.User.findById(userId).select("-password");
    return { data: users };
};
const getSingleUser = async (userId) => {
    const users = await user_model_1.User.findById(userId).select("-password");
    return { data: users };
};
const blockUser = async (userId, decodedToken) => {
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User id not found");
    }
    if (![user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN].includes(decodedToken.role)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not authorized to access this resource");
    }
    const user = await user_model_1.User.findById(userId).select("-password");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (user.isActive === user_interface_1.IsActive.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User already blocked");
    }
    if (decodedToken.role === user_interface_1.Role.ADMIN &&
        (user.role === user_interface_1.Role.ADMIN || user.role === user_interface_1.Role.SUPER_ADMIN)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not permitted to block this user");
    }
    const blockedUser = await user_model_1.User.findByIdAndUpdate(userId, {
        isActive: user_interface_1.IsActive.BLOCKED,
    }, {
        new: true,
        runValidators: true,
    }).select("-password");
    return blockedUser;
};
const unblockUser = async (userId, decodedToken) => {
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User id is required");
    }
    if (![user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN].includes(decodedToken.role)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not authorized to access this resource");
    }
    const user = await user_model_1.User.findById(userId).select("-password");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (user.isActive !== user_interface_1.IsActive.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User already unblocked");
    }
    if (decodedToken.role === user_interface_1.Role.ADMIN &&
        (user.role === user_interface_1.Role.ADMIN || user.role === user_interface_1.Role.SUPER_ADMIN)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not permitted to unblock this user");
    }
    const unblockedUser = await user_model_1.User.findByIdAndUpdate(userId, { isActive: user_interface_1.IsActive.ACTIVE }, { new: true, runValidators: true }).select("-password");
    return unblockedUser;
};
exports.UserServices = {
    createUser,
    updateUser,
    getAllUsers,
    getMe,
    getSingleUser,
    blockUser,
    unblockUser,
};
