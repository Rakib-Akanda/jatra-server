import AppError from "../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { Driver } from "../modules/driver/driver.model";
import { JwtPayload } from "jsonwebtoken";

export const updateDriverAvailability = async (
  decodedToken: JwtPayload,
  isAvailable: boolean
): Promise<void> => {
  if (!decodedToken.userId) return;

  const driver = await Driver.findOne({ userId: decodedToken.userId });
  if (!driver) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Driver not found for update available"
    );
  }

  driver.isAvailable = isAvailable;
  await driver.save();
};
