import { StatusCodes } from "http-status-codes";
import AppError from "../errorHelpers/AppError";
import { FareRule } from "../modules/fareRule/fareRule.model";
import { IFare, IRide } from "../modules/ride/ride.interface";

export const calculateFare = async (ride: Partial<IRide>): Promise<IFare> => {
  if (!ride || !ride.vehicleType) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid ride data");
  }
  const fareRule = await FareRule.findOne({ vehicleType: ride.vehicleType });
  if (!fareRule) {
    throw new AppError(StatusCodes.NOT_FOUND, "Fare rule not found");
  }

  const baseFare = Number(fareRule.baseFare.toFixed(2));
  const distanceFare = Number(
    ((ride.distance ?? 0) * fareRule.perKmFare).toFixed(2)
  );
  const timeFare = Number(
    ((ride.estimatedDuration ?? 0) * fareRule.perMinuteFare).toFixed(2)
  );
  const demandMultiplier = fareRule.demandMultiplier ?? 1;
  const discountRate = fareRule.discount ?? 0;

  const initialFare = Number((baseFare + distanceFare + timeFare).toFixed(2));

  // apply demand
  const demandAmount = Number((initialFare * demandMultiplier).toFixed(2));
  const discountAmount = Number((demandAmount * discountRate).toFixed(2));
  const actualFare = Number((demandAmount - discountAmount).toFixed(2));

  const fare: IFare = {
    baseFare,
    distanceFare,
    timeFare,
    demandMultiplier: Number(fareRule.demandMultiplier.toFixed(2)),
    discount: discountAmount,
    actualFare,
  };

  return fare;
};
