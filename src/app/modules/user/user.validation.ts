import z from "zod";
import { IGender, IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ error: "Name must be a string" })
    .min(2, { error: "Name too short. Minimum 2 character long" })
    .max(50, { error: "Name too long" }),
  email: z
    .email({ error: "Invalid email format." })
    .min(8, { error: "Email must be at least 8 characters long." })
    .max(100, { error: "Email cannot exceed 100 characters." }),
  password: z
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
  gender: z.enum(IGender).optional(),
  dateOfBirth: z.string({ error: "Date of Birth must be a string" }).optional(),
  phone: z
    .string({ error: "Phone must be a string" })
    .regex(/^()/, {
      error:
        "Phone number must be valid for Bangladesh. Formate +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  image: z
    .array(z.string({ error: "image url type must be a string" }))
    .optional(),
  address: z
    .string({ error: "address must be a string" })
    .max(200, { error: "Address cannot exceed 100 characters" })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ error: "Name must be a string" })
    .min(2, { error: "Name too short. Minimum 2 character long" })
    .max(50, { error: "Name too long" })
    .optional(),
  gender: z.enum(IGender).optional(),
  dateOfBirth: z.string({ error: "Date of Birth must be a string" }).optional(),
  phone: z
    .string({ error: "Phone must be a string" })
    .regex(/^()/, {
      error:
        "Phone number must be valid for Bangladesh. Formate +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  image: z
    .array(z.string({ error: "image url type must be a string" }))
    .optional(),
  address: z
    .string({ error: "address must be a string" })
    .max(200, { error: "Address cannot exceed 100 characters" })
    .optional(),
  role: z.enum(Role).optional(),
  isActive: z.enum(IsActive).optional(),
  isDeleted: z.boolean({ error: "IsDeleted must be a boolean" }).optional(),
  isVerified: z.boolean({ error: "isVerified must be a boolean" }).optional(),
});
