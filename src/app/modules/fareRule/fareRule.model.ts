import { model, Schema } from "mongoose";
import { IFareRule } from "./fareRule.interface";
import { IVehicleType } from "../driver/driver.interface";

const fareRuleSchema = new Schema<IFareRule>(
  {
    vehicleType: {
      type: String,
      enum: { ...Object.values(IVehicleType) },
      required: true,
    },
    baseFare: {
      type: Number,
      min: [0, "Base Fare fare cannot be less than 0."],
      required: true,
    },
    perKmFare: {
      type: Number,
      min: [0, "Per Km fare cannot be less than 0."],
      required: true,
    },
    perMinuteFare: {
      type: Number,
      min: [0, "Per minute fare cannot be less than 0."],
      required: true,
    },
    demandMultiplier: {
      type: Number,
      default: 1,
      min: [1, "Demand multiplier cannot be less than 1."],
    },
    discount: {
      type: Number,
      default: 0,
      max: [1, "Discount cannot exceed 1. For example, 10% = 0.1, 100% = 1.0"],
    },
    effectiveFrom: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const FareRule = model<IFareRule>("FareRule", fareRuleSchema);
