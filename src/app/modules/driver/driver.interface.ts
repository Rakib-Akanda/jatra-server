import { Types } from "mongoose";

// export enum IDriverApproveStatus {
//   APPROVE = "APPROVED",
//   SUSPEND = "SUSPENDED",
// }

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

export interface IDriver {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;

  nationalIdNumber: number;
  licenseNumber: number;
  vehicleInfo: IVehicleInfo;
  isVerified: boolean; // After admin approval true

  rating?: number; // avg(4.7)
  totalRides: number;
  totalEarnings: number;

  currentLocation: {
    lat: number;
    lng: number;
  };
  
  isAvailable: boolean; // true if not in a ride
}
