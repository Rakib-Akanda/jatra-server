import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IFareRule } from "./fareRule.interface";
import { FareRule } from "./fareRule.model";

const createFareRule = async (payload: Partial<IFareRule>) => {
  const existFareRule = await FareRule.findOne({
    vehicleType: payload.vehicleType,
  });
  if (existFareRule) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `Fare rule for vehicle type '${payload.vehicleType}' already exists. You can update the existing rule instead.`
    );
  }
  const newFareRule = await FareRule.create(payload);

  return newFareRule;
};
const updateFareRule = async (id: string, payload: Partial<IFareRule>) => {
  if (payload.vehicleType) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `The field 'vehicleType' is not updatable.`
    );
  }
  const existFareRule = await FareRule.findById(id);
  if (!existFareRule) {
    throw new AppError(StatusCodes.NOT_FOUND, "fareRule not found");
  }
  const updatedFareRule = await FareRule.findByIdAndUpdate(
    id,
    {
      $set: payload,
    },
    { new: true, runValidators: true }
  );
  return updatedFareRule;
};
const getSingleFareRule = async (id: string) => {
  const fareRule = await FareRule.findById(id);
  if (!fareRule) {
    throw new AppError(StatusCodes.NOT_FOUND, "fareRule not found");
  }
  return fareRule;
};
const getFareRule = async () => {
  const fareRule = await FareRule.find();
  if (!fareRule) {
    throw new AppError(StatusCodes.NOT_FOUND, "fareRule not found");
  }
  return fareRule;
};

export const FareRuleServices = {
  createFareRule,
  updateFareRule,
  getSingleFareRule,
  getFareRule,
};
