import { Types } from "mongoose";

export enum IVehicleType {
  BIKE = "BIKE",
  CAR = "CAR",
  AUTO = "AUTO",
  OTHERS = "OTHERS",
}

export interface IVehicleInfo {
  vehicleType: IVehicleType;
  vehicleModel: string;
  vehicleNumberPlate: string;
  vehicleColor?: string;
  seats?: number;
}
export enum IDriverStatus {
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
  PENDING = "PENDING",
}
export interface IDriver {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  name?: string;
  email?: string;

  NIDNumber: number;
  licenseNumber: number;
  vehicleInfo: IVehicleInfo;

  isAvailable?: boolean; // true if not in a ride
  driverStatus?: IDriverStatus;
  isDeleted?: boolean;

  rating?: number; // avg(4.7)
  totalRides?: number;
  totalEarnings?: number;

  currentLocation?: {
    lat: number;
    lon: number;
  };
}
