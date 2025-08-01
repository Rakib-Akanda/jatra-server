import { model, Schema } from "mongoose";
import { IRide, RIDE_STATUS } from "./ride.interface";
import { IVehicleType } from "../driver/driver.interface";

const rideSchema = new Schema<IRide>(
  {
    riderId: { type: Schema.Types.ObjectId, required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "User" },

    vehicleType: {
      type: String,
      enum: { ...Object.values(IVehicleType) },
      required: true,
    },
    pickup: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    destination: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    distance: { type: Number },

    startTime: { type: Date },
    endTime: { type: Date },

    estimatedDuration: { type: Number, default: 0 },

    status: {
      type: String,
      enum: { ...Object.values(RIDE_STATUS) },
      default: RIDE_STATUS.REQUESTED,
    },
    adminAction: {
      by: { type: Schema.Types.ObjectId },
      action: {
        type: String,
        enum: { ...Object.values(RIDE_STATUS) },
      },
      at: { type: Date },
    },

    cancelledBy: { type: Schema.Types.ObjectId },
    cancellationReason: { type: String },
    cancellationTime: { type: Date },

    feedbackId: { type: Schema.Types.ObjectId },

    paymentId: { type: Schema.Types.ObjectId },

    fare: {
      baseFare: { type: Number },
      distanceFare: { type: Number },
      timeFare: { type: Number },
      platformFee: { type: Number },
      demandFare: { type: Number },
      discount: { type: Number },
      actualFare: { type: Number },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Ride = model<IRide>("Ride", rideSchema);
