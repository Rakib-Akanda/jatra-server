import z from "zod";
import { IGender, IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .refine((val) => typeof val === "string", {
      message: "Name must be a string",
    })
    .min(2, { message: "Name too short. Minimum 2 character long" })
    .max(50, { message: "Name too long" }),
  email: z
    .string()
    .refine((val) => typeof val === "string", {
      message: "Email must be a string",
    })
    .email({ message: "Invalid email format." })
    .min(8, { message: "Email must be at least 8 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." }),
  password: z
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
  gender: z.enum(IGender).refine((val) => typeof val === "string", {
    message: "Gender must be a string",
  }),
  dateOfBirth: z
    .string()
    .refine((val) => typeof val === "string", {
      message: "Date of Birth must be a string",
    })
    .optional(),
  phone: z
    .string()
    .refine((val) => typeof val === "string", {
      message: "Phone must be a string",
    })
    .regex(/^()/, {
      message:
        "Phone number must be valid for Bangladesh. Formate +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  image: z
    .array(
      z.string().refine((val) => typeof val === "string", {
        message: "image url type must be a string",
      })
    )
    .optional(),
  address: z
    .string()
    .refine((val) => typeof val === "string", {
      message: "address must be a string",
    })
    .max(200, { message: "Address cannot exceed 100 characters" })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string()
    .refine((val) => typeof val === "string", {
      message: "Name must be a string",
    })
    .min(2, { message: "Name too short. Minimum 2 character long" })
    .max(50, { message: "Name too long" })
    .optional(),
  gender: z
    .enum(IGender)
    .refine((val) => typeof val === "string", {
      message: "Gender must be a string",
    })
    .optional(),
  dateOfBirth: z
    .string()
    .refine((val) => typeof val === "string", {
      message: "Date of Birth must be a string",
    })
    .optional(),
  phone: z
    .string()
    .refine((val) => typeof val === "string", {
      message: "Phone must be a string",
    })
    .regex(/^()/, {
      message:
        "Phone number must be valid for Bangladesh. Formate +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  image: z
    .array(
      z.string().refine((val) => typeof val === "string", {
        message: "Image url type must be a string",
      })
    )
    .optional(),
  address: z
    .string()
    .refine((val) => typeof val === "string", {
      message: "Address must be a string",
    })
    .max(200, { message: "Address cannot exceed 100 characters" })
    .optional(),
  role: z.enum(Role).optional(),
  isActive: z.enum(IsActive).optional(),
  isDeleted: z
    .boolean()
    .refine((val) => typeof val === "boolean", {
      message: "IsDeleted must be a boolean",
    })
    .optional(),
  isVerified: z
    .boolean()
    .refine((val) => typeof val === "boolean", {
      message: "isVerified must be a boolean",
    })
    .optional(),
});
