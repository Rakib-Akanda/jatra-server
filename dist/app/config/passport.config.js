"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const user_model_1 = require("../modules/user/user.model");
const http_status_codes_1 = require("http-status-codes");
const user_interface_1 = require("../modules/user/user.interface");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
    try {
        const isUserExist = await user_model_1.User.findOne({ email });
        if (!isUserExist) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User does not exist!");
        }
        if (!isUserExist.isVerified) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, " User is not verified");
        }
        if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED ||
            isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `User is ${isUserExist.isActive}`);
        }
        if (isUserExist.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is deleted");
        }
        const isGoogleAuthenticated = isUserExist?.auths.some((providerObject) => providerObject.provider?.toLocaleLowerCase() === "google");
        if (!isUserExist.password && isGoogleAuthenticated) {
            return done(null, false, {
                message: "Your account is linked with Google. Please log in with Google first and set a password to enable email login.",
            });
        }
        const isPasswordMatched = await bcryptjs_1.default.compare(password, isUserExist.password);
        if (!isPasswordMatched) {
            return done(null, false, { message: "Password does not match" });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: pass, ...userWithoutPassword } = isUserExist.toObject();
        return done(null, userWithoutPassword);
    }
    catch (error) {
        done(error);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await user_model_1.User.findById(id);
        if (user)
            delete user.password;
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
