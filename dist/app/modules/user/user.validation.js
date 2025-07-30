"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name must be a string" })
        .min(2, { error: "Name too short. Minimum 2 character long" })
        .max(50, { error: "Name too long" }),
    email: zod_1.default
        .email({ error: "Invalid email format." })
        .min(8, { error: "Email must be at least 8 characters long." })
        .max(100, { error: "Email cannot exceed 100 characters." }),
    password: zod_1.default
        .string({
        error: "Password must be a string",
    })
        .min(8, { error: "Password must be at least 8 characters" })
        .regex(/^(?=.*[A-Z])/, {
        error: "Password must contain at least 1 uppercase letter",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        error: "Password must be at least 1 special character",
    })
        .regex(/^(?=.*\d)/, {
        error: "Password must contain at least 1 number",
    }),
    gender: zod_1.default.enum(user_interface_1.IGender).optional(),
    dateOfBirth: zod_1.default.string({ error: "Date of Birth must be a string" }).optional(),
    phone: zod_1.default
        .string({ error: "Phone must be a string" })
        .regex(/^()/, {
        error: "Phone number must be valid for Bangladesh. Formate +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    image: zod_1.default
        .array(zod_1.default.string({ error: "image url type must be a string" }))
        .optional(),
    address: zod_1.default
        .string({ error: "address must be a string" })
        .max(200, { error: "Address cannot exceed 100 characters" })
        .optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name must be a string" })
        .min(2, { error: "Name too short. Minimum 2 character long" })
        .max(50, { error: "Name too long" })
        .optional(),
    gender: zod_1.default.enum(user_interface_1.IGender).optional(),
    dateOfBirth: zod_1.default.string({ error: "Date of Birth must be a string" }).optional(),
    phone: zod_1.default
        .string({ error: "Phone must be a string" })
        .regex(/^()/, {
        error: "Phone number must be valid for Bangladesh. Formate +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    image: zod_1.default
        .array(zod_1.default.string({ error: "image url type must be a string" }))
        .optional(),
    address: zod_1.default
        .string({ error: "address must be a string" })
        .max(200, { error: "Address cannot exceed 100 characters" })
        .optional(),
    role: zod_1.default.enum(user_interface_1.Role).optional(),
    isActive: zod_1.default.enum(user_interface_1.IsActive).optional(),
    isDeleted: zod_1.default.boolean({ error: "IsDeleted must be a boolean" }).optional(),
    isVerified: zod_1.default.boolean({ error: "isVerified must be a boolean" }).optional(),
});
