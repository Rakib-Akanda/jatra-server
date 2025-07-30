import z from "zod";
import { IDriverStatus, IVehicleType } from "./driver.interface";

export const createDriverZodValidation = z.object({
  userId: z.string({ error: "User ID must be a string" }),

  NIDNumber: z
    .number({ error: "NID number must be a number" })
    .min(1000000000, { message: "NID must be at least 10 digits" }) // 10-digit
    .max(999999999999999, { message: "NID must not exceed 15 digits" }), // 15-digit
  licenseNumber: z.number({ error: "License number Must be a number" }),

  vehicleInfo: z.object({
    vehicleType: z.enum(IVehicleType),
    vehicleModel: z.string({ error: "Vehicle Model must be a string" }),
    vehicleNumberPlate: z.string({ error: "Number Plate must be a string" }),
    vehicleColor: z
      .string({ error: "Vehicle color must be a string" })
      .optional(),
    seats: z
      .number({ error: "Seats must be a number" })
      .min(1, "At least 1 seat is required.")
      .optional(),
  }),
});

export const updateDriverZodValidation = z.object({
  NIDNumber: z
    .number({ error: "NID number must be a number" })
    .min(1000000000, { message: "NID must be at least 10 digits" }) // 10-digit
    .max(999999999999999, { message: "NID must not exceed 15 digits" }) // 15-digit
    .optional(),
  name: z
    .string({ error: "Name must be a string" })
    .min(2, { error: "Name too short. Minimum 2 character long" })
    .max(50, { error: "Name too long" })
    .optional(),
  email: z
    .email({ error: "Invalid email format." })
    .min(8, { error: "Email must be at least 8 characters long." })
    .max(100, { error: "Email cannot exceed 100 characters." })
    .optional(),
  licenseNumber: z
    .number({ error: "License number Must be a number" })
    .optional(),

  vehicleInfo: z
    .object({
      vehicleType: z.enum(IVehicleType).optional(),
      vehicleModel: z
        .string({ error: "Vehicle Model must be a string" })
        .optional(),
      vehicleNumberPlate: z
        .string({ error: "Number Plate must be a string" })
        .optional(),
      vehicleColor: z
        .string({ error: "Vehicle color must be a string" })
        .optional(),
      seats: z
        .number({ error: "Seats must be a number" })
        .min(1, "At least 1 seat is required.")
        .optional(),
    })
    .optional(),

  isAvailable: z.boolean({ error: "isAvailable must be a boolean" }).optional(),
  driverStatus: z.enum(IDriverStatus).optional(),
  isDeleted: z.boolean({ error: "isDeleted must be a boolean" }).optional(),

  rating: z.number({ error: "Rating must be a number" }).optional(),
  totalRides: z.number({ error: "Total rides must be a number" }).optional(),
  totalEarnings: z
    .number({ error: "Total earnings must be a number" })
    .optional(),

  currentLocation: z
    .object({
      lat: z.number({ error: "Latitude must be a number" }),
      lan: z.number({ error: "Longitude must be a number" }),
    })
    .optional(),
});
