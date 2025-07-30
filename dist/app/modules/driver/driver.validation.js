"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDriverZodValidation = exports.createDriverZodValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const driver_interface_1 = require("./driver.interface");
exports.createDriverZodValidation = zod_1.default.object({
    userId: zod_1.default.string({ error: "User ID must be a string" }),
    NIDNumber: zod_1.default
        .number({ error: "NID number must be a number" })
        .min(1000000000, { message: "NID must be at least 10 digits" }) // 10-digit
        .max(999999999999999, { message: "NID must not exceed 15 digits" }), // 15-digit
    licenseNumber: zod_1.default.number({ error: "License number Must be a number" }),
    vehicleInfo: zod_1.default.object({
        vehicleType: zod_1.default.enum(driver_interface_1.IVehicleType),
        vehicleModel: zod_1.default.string({ error: "Vehicle Model must be a string" }),
        vehicleNumberPlate: zod_1.default.string({ error: "Number Plate must be a string" }),
        vehicleColor: zod_1.default
            .string({ error: "Vehicle color must be a string" })
            .optional(),
        seats: zod_1.default
            .number({ error: "Seats must be a number" })
            .min(1, "At least 1 seat is required.")
            .optional(),
    }),
});
exports.updateDriverZodValidation = zod_1.default.object({
    NIDNumber: zod_1.default
        .number({ error: "NID number must be a number" })
        .min(1000000000, { message: "NID must be at least 10 digits" }) // 10-digit
        .max(999999999999999, { message: "NID must not exceed 15 digits" }) // 15-digit
        .optional(),
    name: zod_1.default
        .string({ error: "Name must be a string" })
        .min(2, { error: "Name too short. Minimum 2 character long" })
        .max(50, { error: "Name too long" })
        .optional(),
    email: zod_1.default
        .email({ error: "Invalid email format." })
        .min(8, { error: "Email must be at least 8 characters long." })
        .max(100, { error: "Email cannot exceed 100 characters." })
        .optional(),
    licenseNumber: zod_1.default
        .number({ error: "License number Must be a number" })
        .optional(),
    vehicleInfo: zod_1.default
        .object({
        vehicleType: zod_1.default.enum(driver_interface_1.IVehicleType).optional(),
        vehicleModel: zod_1.default
            .string({ error: "Vehicle Model must be a string" })
            .optional(),
        vehicleNumberPlate: zod_1.default
            .string({ error: "Number Plate must be a string" })
            .optional(),
        vehicleColor: zod_1.default
            .string({ error: "Vehicle color must be a string" })
            .optional(),
        seats: zod_1.default
            .number({ error: "Seats must be a number" })
            .min(1, "At least 1 seat is required.")
            .optional(),
    })
        .optional(),
    isAvailable: zod_1.default.boolean({ error: "isAvailable must be a boolean" }).optional(),
    driverStatus: zod_1.default.enum(driver_interface_1.IDriverStatus).optional(),
    isDeleted: zod_1.default.boolean({ error: "isDeleted must be a boolean" }).optional(),
    rating: zod_1.default.number({ error: "Rating must be a number" }).optional(),
    totalRides: zod_1.default.number({ error: "Total rides must be a number" }).optional(),
    totalEarnings: zod_1.default
        .number({ error: "Total earnings must be a number" })
        .optional(),
    currentLocation: zod_1.default
        .object({
        lat: zod_1.default.number({ error: "Latitude must be a number" }),
        lon: zod_1.default.number({ error: "Longitude must be a number" }),
    })
        .optional(),
});
