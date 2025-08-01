import { Types } from "mongoose";
import { IVehicleType } from "../driver/driver.interface";

export enum RIDE_STATUS {
  REQUESTED = "REQUESTED",
  CANCELLED = "CANCELLED",
  ACCEPTED = "ACCEPTED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
}

export interface IFare {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  demandMultiplier: number;
  discount: number;
  actualFare: number;
}

export interface IRide {
  _id?: string;
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId; // Assign হয় পরে (match হলে)
  feedbackId?: Types.ObjectId; // Complete হলে হয় feedback
  paymentId?: Types.ObjectId; //Ride শেষে generate/payment হলে

  vehicleType: IVehicleType;
  pickup: {
    lat: number;
    lon: number;
  };
  destination: {
    lat: number;
    lon: number;
  };
  distance?: number;

  startTime?: Date;
  endTime?: Date;

  estimatedDuration?: number;

  status?: RIDE_STATUS;
  adminAction?: {
    by: Types.ObjectId | string;
    action: RIDE_STATUS;
    at: Date;
  };

  cancelledBy?: Types.ObjectId;
  cancellationReason?: string;
  cancellationTime?: Date;

  fare?: IFare;
}

export interface IUpdateRideStatusPayload {
  status: string;
  cancellationReason?: string;
}
