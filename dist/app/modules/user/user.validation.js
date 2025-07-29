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
        .string()
        .refine((val) => typeof val === "string", {
        message: "Name must be a string",
    })
        .min(2, { message: "Name too short. Minimum 2 character long" })
        .max(50, { message: "Name too long" }),
    email: zod_1.default
        .string()
        .refine((val) => typeof val === "string", {
        message: "Email must be a string",
    })
        .email({ message: "Invalid email format." })
        .min(8, { message: "Email must be at least 8 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    password: zod_1.default
        .string()
        .refine((val) => typeof val === "string", {
        message: "Password must be a string",
    })
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must be at least 1 special character",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number",
    }),
    gender: zod_1.default.enum(user_interface_1.IGender).refine((val) => typeof val === "string", {
        message: "Gender must be a string",
    }),
    dateOfBirth: zod_1.default
        .string()
        .refine((val) => typeof val === "string", {
        message: "Date of Birth must be a string",
    })
        .optional(),
    phone: zod_1.default
        .string()
        .refine((val) => typeof val === "string", {
        message: "Phone must be a string",
    })
        .regex(/^()/, {
        message: "Phone number must be valid for Bangladesh. Formate +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    image: zod_1.default
        .array(zod_1.default.string().refine((val) => typeof val === "string", {
        message: "image url type must be a string",
    }))
        .optional(),
    address: zod_1.default
        .string()
        .refine((val) => typeof val === "string", {
        message: "address must be a string",
    })
        .max(200, { message: "Address cannot exceed 100 characters" })
        .optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .refine((val) => typeof val === "string", {
        message: "Name must be a string",
    })
        .min(2, { message: "Name too short. Minimum 2 character long" })
        .max(50, { message: "Name too long" })
        .optional(),
    gender: zod_1.default
        .enum(user_interface_1.IGender)
        .refine((val) => typeof val === "string", {
        message: "Gender must be a string",
    })
        .optional(),
    dateOfBirth: zod_1.default
        .string()
        .refine((val) => typeof val === "string", {
        message: "Date of Birth must be a string",
    })
        .optional(),
    phone: zod_1.default
        .string()
        .refine((val) => typeof val === "string", {
        message: "Phone must be a string",
    })
        .regex(/^()/, {
        message: "Phone number must be valid for Bangladesh. Formate +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    image: zod_1.default
        .array(zod_1.default.string().refine((val) => typeof val === "string", {
        message: "Image url type must be a string",
    }))
        .optional(),
    address: zod_1.default
        .string()
        .refine((val) => typeof val === "string", {
        message: "Address must be a string",
    })
        .max(200, { message: "Address cannot exceed 100 characters" })
        .optional(),
    role: zod_1.default.enum(user_interface_1.Role).optional(),
    isActive: zod_1.default.enum(user_interface_1.IsActive).optional(),
    isDeleted: zod_1.default
        .boolean()
        .refine((val) => typeof val === "boolean", {
        message: "IsDeleted must be a boolean",
    })
        .optional(),
    isVerified: zod_1.default
        .boolean()
        .refine((val) => typeof val === "boolean", {
        message: "isVerified must be a boolean",
    })
        .optional(),
});
