import z from "zod";
import { RIDE_STATUS } from "./ride.interface";

export const createRideZodSchema = z.object({
  riderId: z.string({ error: "Rider id is required and must be a string." }),
  vehicleType: z.string({
    error: "vehicleType is required and must be a string",
  }),

  pickup: z.object({
    lat: z.number({
      error: "Pickup latitude is required and must be a number.",
    }),
    lon: z.number({
      error: "Pickup longitude is required and must be a number.",
    }),
  }),

  destination: z.object({
    lat: z.number({
      error: "Destination Latitude is required and must be a number.",
    }),
    lon: z.number({
      error: "Destination longitude is required and must be a number.",
    }),
  }),
});

export const updateRideZodSchema = z.object({
  riderId: z
    .string({ error: "Rider id is required and must be a string." })
    .optional(),
  driverId: z.string({ error: "Driver id must be a string." }).optional(),
  feedbackId: z.string({ error: "Feedback id must be a string." }).optional(),
  paymentId: z.string({ error: "Payment id must be a string." }).optional(),

  vehicleType: z
    .string({
      error: "vehicleType is required and must be a string",
    })
    .optional(),
  pickup: z
    .object({
      lat: z.number({
        error: "Pickup latitude is required and must be a number.",
      }),
      lon: z.number({
        error: "Pickup longitude is required and must be a number.",
      }),
    })
    .optional(),

  destination: z
    .object({
      lat: z.number({
        error: "Destination Latitude is required and must be a number.",
      }),
      lon: z.number({
        error: "Destination longitude is required and must be a number.",
      }),
    })
    .optional(),

  distance: z
    .number({
      error: "distance must be a number.",
    })
    .optional(),

  startTime: z
    .preprocess((val) => {
      if (typeof val === "string") return new Date(val);
      if (val instanceof Date) return val;
    }, z.date())
    .optional(),

  endTime: z
    .preprocess((val) => {
      if (typeof val === "string") return new Date(val);
      if (val instanceof Date) return val;
    }, z.date())
    .optional(),

  estimatedDuration: z
    .number({
      error: "estimatedDuration must be a number.",
    })
    .optional(),

  status: z.enum(RIDE_STATUS).optional(),

  cancelledBy: z
    .string({ error: "cancelledBy must be a objectId in string" })
    .optional(),
  cancellationReason: z
    .string({
      error: "cancellationReason must be a string.",
    })
    .optional(),
  cancellationTime: z
    .preprocess((val) => {
      if (typeof val === "string") return new Date(val);
      if (val instanceof Date) return val;
    }, z.date())
    .optional(),

  fare: z
    .object({
      baseFare: z.number({
        error: "baseFare is required and must be a number.",
      }),
      distanceFare: z.number({
        error: "distanceFare is required and must be a number.",
      }),
      timeFare: z.number({
        error: "timeFare is required and must be a number.",
      }),
      platformFee: z.number({
        error: "platformFee is required and must be a number.",
      }),
      demandFare: z.number({
        error: "demandFare is required and must be a number.",
      }),
      discount: z.number({
        error: "discount is required and must be a number.",
      }),
      actualFare: z.number({
        error: "actualFare is required and must be a number.",
      }),
    })
    .optional(),
});

export const updateRideStatusZodSchema = z.object({
  status: z.enum(RIDE_STATUS),
  cancellationReason: z
    .string({
      error: "cancellationReason is required and must be a string.",
    })
    .optional(),
});
