import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import {
  IRide,
  IUpdateRideStatusPayload,
  RIDE_STATUS,
} from "../modules/ride/ride.interface";
import { StatusCodes } from "http-status-codes";
import { calculateFare } from "./calculateFare";
import { updateDriverAvailability } from "../utils/updateDriverAvailability";
import { IDriver } from "../modules/driver/driver.interface";
import { Driver } from "../modules/driver/driver.model";

export const handleAdminRideStatus = async (
  ride: IRide,
  payload: IUpdateRideStatusPayload,
  decodedToken: JwtPayload
) => {
  //   if (ride.status === RIDE_STATUS.COMPLETED) {
  //     throw new AppError(
  //       StatusCodes.BAD_REQUEST,
  //       `You cannot update status, this ride at ${ride.status} stage`
  //     );
  //   }
  switch (payload.status) {
    case RIDE_STATUS.CANCELLED:
      ride.status = RIDE_STATUS.CANCELLED;
      ride.cancellationTime = new Date(Date.now());
      ride.cancelledBy = decodedToken.userId;
      ride.cancellationReason =
        payload.cancellationReason ?? "No reason provided";
      ride.adminAction = {
        by: decodedToken.userId,
        action: RIDE_STATUS.CANCELLED,
        at: new Date(Date.now()),
      };
      break;

    case RIDE_STATUS.ACCEPTED:
    case RIDE_STATUS.PICKED_UP:
    case RIDE_STATUS.IN_TRANSIT:
    case RIDE_STATUS.COMPLETED:
      ride.status = payload.status as RIDE_STATUS;

      if (payload.status === RIDE_STATUS.PICKED_UP) {
        ride.startTime = new Date(Date.now());
      }

      if (payload.status === RIDE_STATUS.COMPLETED) {
        ride.endTime = new Date(Date.now());

        if (ride.startTime && ride.endTime) {
          const durationInMs =
            ride.endTime.getTime() - ride.startTime.getTime();
          const durationInMin = Math.ceil(durationInMs / 1000 / 60);
          ride.estimatedDuration = durationInMin;
        } else {
          ride.estimatedDuration = 0;
        }

        ride.fare = await calculateFare(ride);
      }
      ride.adminAction = {
        by: decodedToken.userId,
        action: payload.status as RIDE_STATUS,
        at: new Date(Date.now()),
      };

      break;
    default:
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Invalid value: ${payload.status}`
      );
  }
};

export const handleDriverRideStatus = async (
  driver: IDriver,
  ride: IRide,
  payload: IUpdateRideStatusPayload,
  decodedToken: JwtPayload
) => {
  if (ride.driverId && decodedToken.userId !== ride.driverId?.toString()) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not able to update this ride."
    );
  }
  switch (payload.status) {
    case RIDE_STATUS.CANCELLED:
      if (
        ride.status !== RIDE_STATUS.REQUESTED &&
        ride.status !== RIDE_STATUS.ACCEPTED
      ) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `You cannot cancel this ride at ${ride.status} stage`
        );
      }
      ride.status = RIDE_STATUS.CANCELLED;
      ride.cancellationTime = new Date(Date.now());
      ride.cancelledBy = decodedToken.userId;
      ride.cancellationReason =
        payload.cancellationReason ?? "No reason provided";
      await updateDriverAvailability(decodedToken, true);
      break;
    case RIDE_STATUS.ACCEPTED:
      if (ride.status !== RIDE_STATUS.REQUESTED) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          " Ride is not REQUESTED state"
        );
      }
      if (!driver.isAvailable) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          "You are currently in another ride and not available."
        );
      }
      await updateDriverAvailability(decodedToken, false);
      ride.status = RIDE_STATUS.ACCEPTED;
      ride.driverId = decodedToken.userId;
      break;
    case RIDE_STATUS.PICKED_UP:
      if (ride.status !== RIDE_STATUS.ACCEPTED) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "Ride must be ACCEPTED before pickup"
        );
      }
      ride.status = RIDE_STATUS.PICKED_UP;
      ride.startTime = new Date(Date.now());
      break;
    case RIDE_STATUS.IN_TRANSIT:
      if (ride.status !== RIDE_STATUS.PICKED_UP) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "Ride must be PICKED_UP before going IN_TRANSIT."
        );
      }
      ride.status = RIDE_STATUS.IN_TRANSIT;
      break;
    case RIDE_STATUS.COMPLETED:
      if (ride.status !== RIDE_STATUS.IN_TRANSIT) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "Ride must be IN_TRANSIT before completing."
        );
      }
      ride.status = RIDE_STATUS.COMPLETED;
      ride.endTime = new Date(Date.now());

      // calculate duration in minutes
      if (ride.startTime && ride.endTime) {
        const durationInMs = ride.endTime.getTime() - ride.startTime.getTime();
        const durationInMin = Math.ceil(durationInMs / 1000 / 60);
        ride.estimatedDuration = durationInMin;
      } else {
        ride.estimatedDuration = 0;
      }

      ride.fare = await calculateFare(ride);
      await updateDriverAvailability(decodedToken, true);
      await Driver.findByIdAndUpdate(
        { _id: driver._id },
        {
          $inc: { totalRides: 1 },
        },
        { new: true, runValidators: true }
      );
      break;
    default:
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Invalid value: ${payload.status}`
      );
  }
};

export const handleRiderRideStatus = async (
  ride: IRide,
  payload: IUpdateRideStatusPayload,
  decodedToken: JwtPayload
) => {
  if (decodedToken.userId !== ride.riderId?.toString()) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not able to update this ride."
    );
  }
  if (!(payload.status === RIDE_STATUS.CANCELLED)) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Rider can only update CANCELLED status"
    );
  }
  switch (payload.status) {
    case RIDE_STATUS.CANCELLED: {
      if (
        ride.status &&
        [
          RIDE_STATUS.ACCEPTED,
          RIDE_STATUS.PICKED_UP,
          RIDE_STATUS.IN_TRANSIT,
          RIDE_STATUS.COMPLETED,
        ].includes(ride.status)
      ) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `You cannot cancel this ride because ride status is ${ride.status}`
        );
      }
      ride.status = RIDE_STATUS.CANCELLED;
      ride.cancelledBy = ride.riderId;
      ride.cancellationReason =
        payload.cancellationReason ?? "No reason provided";
      ride.cancellationTime = new Date(Date.now());
      break;
    }
    default:
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Rider can only update CANCELLED status"
      );
  }
};
