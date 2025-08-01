import { z } from "zod";
import { IVehicleType } from "../driver/driver.interface";

export const createFareRuleZodSchema = z.object({
  vehicleType: z.enum(IVehicleType),

  baseFare: z
    .number({ error: "baseFare is required and must be number." })
    .min(0, "baseFare cannot be less than 0"),

  perKmFare: z
    .number({ error: "perKmFare is required and must be number." })
    .min(0, "perKmFare cannot be less than 0"),

  perMinuteFare: z
    .number({ error: "perMinuteFare is required and must be number." })
    .min(0, "perMinuteFare cannot be less than 0"),

  demandMultiplier: z
    .number({ error: "demandMultiplier is required and must be number." })
    .min(1, "demandMultiplier cannot be less than 1")
    .default(1),

  discount: z
    .number({ error: "discount is required and must be number." })
    .max(1, "Discount cannot exceed 1. For example, 10% = 0.1, 100% = 1.0")
    .default(0),

  effectiveFrom: z
    .preprocess((val) => {
      if (typeof val === "string") return new Date(val);
      if (val instanceof Date) return val;
      return new Date(Date.now());
    }, z.date())
    .optional(),

  active: z.boolean({ error: "active must be a boolean" }).optional(),
});

export const updateFareRuleZodSchema = z.object({
  baseFare: z
    .number({ error: "baseFare is required and must be number." })
    .min(0, "baseFare cannot be less than 0")
    .optional(),

  perKmFare: z
    .number({ error: "perKmFare is required and must be number." })
    .min(0, "perKmFare cannot be less than 0")
    .optional(),

  perMinuteFare: z
    .number({ error: "perMinuteFare is required and must be number." })
    .min(0, "perMinuteFare cannot be less than 0")
    .optional(),

  demandMultiplier: z
    .number({ error: "demandMultiplier is required and must be number." })
    .min(1, "demandMultiplier cannot be less than 1")
    .optional(),

  discount: z
    .number({ error: "discount is required and must be number." })
    .max(1, "Discount cannot exceed 1. For example, 10% = 0.1, 100% = 1.0")
    .optional(),

  effectiveFrom: z
    .preprocess((val) => {
      if (typeof val === "string") return new Date(val);
      if (val instanceof Date) return val;
      return new Date(Date.now());
    }, z.date())
    .optional(),

  active: z.boolean({ error: "active must be a boolean" }).optional(),
});
