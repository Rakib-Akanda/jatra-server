import { IVehicleType } from "../driver/driver.interface";

export interface IFareRule {
  vehicleType: IVehicleType;
  baseFare: number;
  perKmFare: number;
  perMinuteFare: number;
  demandMultiplier: number;
  discount?: number;
  effectiveFrom: Date;
  active: boolean;
}
