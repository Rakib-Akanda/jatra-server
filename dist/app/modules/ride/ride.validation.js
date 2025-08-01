"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRideStatusZodSchema = exports.updateRideZodSchema = exports.createRideZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const ride_interface_1 = require("./ride.interface");
exports.createRideZodSchema = zod_1.default.object({
    riderId: zod_1.default.string({ error: "Rider id is required and must be a string." }),
    vehicleType: zod_1.default.string({
        error: "vehicleType is required and must be a string",
    }),
    pickup: zod_1.default.object({
        lat: zod_1.default.number({
            error: "Pickup latitude is required and must be a number.",
        }),
        lon: zod_1.default.number({
            error: "Pickup longitude is required and must be a number.",
        }),
    }),
    destination: zod_1.default.object({
        lat: zod_1.default.number({
            error: "Destination Latitude is required and must be a number.",
        }),
        lon: zod_1.default.number({
            error: "Destination longitude is required and must be a number.",
        }),
    }),
});
exports.updateRideZodSchema = zod_1.default.object({
    riderId: zod_1.default
        .string({ error: "Rider id is required and must be a string." })
        .optional(),
    driverId: zod_1.default.string({ error: "Driver id must be a string." }).optional(),
    feedbackId: zod_1.default.string({ error: "Feedback id must be a string." }).optional(),
    paymentId: zod_1.default.string({ error: "Payment id must be a string." }).optional(),
    vehicleType: zod_1.default
        .string({
        error: "vehicleType is required and must be a string",
    })
        .optional(),
    pickup: zod_1.default
        .object({
        lat: zod_1.default.number({
            error: "Pickup latitude is required and must be a number.",
        }),
        lon: zod_1.default.number({
            error: "Pickup longitude is required and must be a number.",
        }),
    })
        .optional(),
    destination: zod_1.default
        .object({
        lat: zod_1.default.number({
            error: "Destination Latitude is required and must be a number.",
        }),
        lon: zod_1.default.number({
            error: "Destination longitude is required and must be a number.",
        }),
    })
        .optional(),
    distance: zod_1.default
        .number({
        error: "distance must be a number.",
    })
        .optional(),
    startTime: zod_1.default
        .preprocess((val) => {
        if (typeof val === "string")
            return new Date(val);
        if (val instanceof Date)
            return val;
    }, zod_1.default.date())
        .optional(),
    endTime: zod_1.default
        .preprocess((val) => {
        if (typeof val === "string")
            return new Date(val);
        if (val instanceof Date)
            return val;
    }, zod_1.default.date())
        .optional(),
    estimatedDuration: zod_1.default
        .number({
        error: "estimatedDuration must be a number.",
    })
        .optional(),
    status: zod_1.default.enum(ride_interface_1.RIDE_STATUS).optional(),
    cancelledBy: zod_1.default
        .string({ error: "cancelledBy must be a objectId in string" })
        .optional(),
    cancellationReason: zod_1.default
        .string({
        error: "cancellationReason must be a string.",
    })
        .optional(),
    cancellationTime: zod_1.default
        .preprocess((val) => {
        if (typeof val === "string")
            return new Date(val);
        if (val instanceof Date)
            return val;
    }, zod_1.default.date())
        .optional(),
    fare: zod_1.default
        .object({
        baseFare: zod_1.default.number({
            error: "baseFare is required and must be a number.",
        }),
        distanceFare: zod_1.default.number({
            error: "distanceFare is required and must be a number.",
        }),
        timeFare: zod_1.default.number({
            error: "timeFare is required and must be a number.",
        }),
        platformFee: zod_1.default.number({
            error: "platformFee is required and must be a number.",
        }),
        demandFare: zod_1.default.number({
            error: "demandFare is required and must be a number.",
        }),
        discount: zod_1.default.number({
            error: "discount is required and must be a number.",
        }),
        actualFare: zod_1.default.number({
            error: "actualFare is required and must be a number.",
        }),
    })
        .optional(),
});
exports.updateRideStatusZodSchema = zod_1.default.object({
    status: zod_1.default.enum(ride_interface_1.RIDE_STATUS),
    cancellationReason: zod_1.default
        .string({
        error: "cancellationReason is required and must be a string.",
    })
        .optional(),
});
