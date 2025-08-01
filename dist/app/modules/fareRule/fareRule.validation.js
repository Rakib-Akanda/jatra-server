"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFareRuleZodSchema = exports.createFareRuleZodSchema = void 0;
const zod_1 = require("zod");
const driver_interface_1 = require("../driver/driver.interface");
exports.createFareRuleZodSchema = zod_1.z.object({
    vehicleType: zod_1.z.enum(driver_interface_1.IVehicleType),
    baseFare: zod_1.z
        .number({ error: "baseFare is required and must be number." })
        .min(0, "baseFare cannot be less than 0"),
    perKmFare: zod_1.z
        .number({ error: "perKmFare is required and must be number." })
        .min(0, "perKmFare cannot be less than 0"),
    perMinuteFare: zod_1.z
        .number({ error: "perMinuteFare is required and must be number." })
        .min(0, "perMinuteFare cannot be less than 0"),
    demandMultiplier: zod_1.z
        .number({ error: "demandMultiplier is required and must be number." })
        .min(1, "demandMultiplier cannot be less than 1")
        .default(1),
    discount: zod_1.z
        .number({ error: "discount is required and must be number." })
        .max(1, "Discount cannot exceed 1. For example, 10% = 0.1, 100% = 1.0")
        .default(0),
    effectiveFrom: zod_1.z
        .preprocess((val) => {
        if (typeof val === "string")
            return new Date(val);
        if (val instanceof Date)
            return val;
        return new Date(Date.now());
    }, zod_1.z.date())
        .optional(),
    active: zod_1.z.boolean({ error: "active must be a boolean" }).optional(),
});
exports.updateFareRuleZodSchema = zod_1.z.object({
    baseFare: zod_1.z
        .number({ error: "baseFare is required and must be number." })
        .min(0, "baseFare cannot be less than 0")
        .optional(),
    perKmFare: zod_1.z
        .number({ error: "perKmFare is required and must be number." })
        .min(0, "perKmFare cannot be less than 0")
        .optional(),
    perMinuteFare: zod_1.z
        .number({ error: "perMinuteFare is required and must be number." })
        .min(0, "perMinuteFare cannot be less than 0")
        .optional(),
    demandMultiplier: zod_1.z
        .number({ error: "demandMultiplier is required and must be number." })
        .min(1, "demandMultiplier cannot be less than 1")
        .optional(),
    discount: zod_1.z
        .number({ error: "discount is required and must be number." })
        .max(1, "Discount cannot exceed 1. For example, 10% = 0.1, 100% = 1.0")
        .optional(),
    effectiveFrom: zod_1.z
        .preprocess((val) => {
        if (typeof val === "string")
            return new Date(val);
        if (val instanceof Date)
            return val;
        return new Date(Date.now());
    }, zod_1.z.date())
        .optional(),
    active: zod_1.z.boolean({ error: "active must be a boolean" }).optional(),
});
