import { Types } from "mongoose";
import AppError from "../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { Driver } from "../modules/driver/driver.model";

export const updateDriverAvailability = async (
  driverId: string | Types.ObjectId,
  isAvailable: boolean
): Promise<void> => {
  if (!driverId) return;

  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Driver not found for update available"
    );
  }

  driver.isAvailable = isAvailable;
  await driver.save();
};
