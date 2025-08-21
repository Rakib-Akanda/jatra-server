import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { getDistance } from "../../utils/getDistance";
import { IRide, IUpdateRideStatusPayload, RIDE_STATUS } from "./ride.interface";
import { Ride } from "./ride.model";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { IsActive, Role } from "../user/user.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import {
  handleAdminRideStatus,
  handleDriverRideStatus,
  handleRiderRideStatus,
} from "../../helpers/rideHelpers";
import { Driver } from "../driver/driver.model";
import { IDriver } from "../driver/driver.interface";

const requestRide = async (
  payload: Partial<IRide>,
  decodedToken: JwtPayload
) => {
  if (!payload.riderId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Rider id not found");
  }
  if (decodedToken.userId !== payload.riderId) {
    throw new AppError(StatusCodes.FORBIDDEN, "Rider id not match");
  }
  if (!payload.pickup || !payload.destination) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Pickup or Destination not found"
    );
  }
  const distance = getDistance(
    payload.pickup?.lat,
    payload.pickup?.lon,
    payload.destination?.lat,
    payload.destination?.lon
  );
  if (distance <= 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Pickup and Destination cannot be same"
    );
  }
  const rider = await User.findById(payload.riderId).select("-password");
  if (!rider) {
    throw new AppError(StatusCodes.NOT_FOUND, "Rider not found");
  }
  if (rider.isDeleted || rider.isActive !== IsActive.ACTIVE) {
    throw new AppError(StatusCodes.FORBIDDEN, "Rider is not active");
  }

  //  Prevent duplicate concurrent ride Request
  const existingRide = await Ride.findOne({
    riderId: payload.riderId,
    status: {
      $in: [
        RIDE_STATUS.REQUESTED,
        RIDE_STATUS.ACCEPTED,
        RIDE_STATUS.IN_TRANSIT,
      ],
    },
  });
  if (existingRide) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "You already have an ongoing ride request"
    );
  }
  // Rate limiting rider ride request
  const recentRequests = await Ride.countDocuments({
    riderId: payload.riderId,
    createdAt: { $gte: new Date(Date.now() - 60 * 1000) }, // last 1 minute
  });
  if (recentRequests >= 3) {
    throw new AppError(
      StatusCodes.TOO_MANY_REQUESTS,
      "Too many ride requests in short time"
    );
  }

  const requestPayload: Partial<IRide> = {
    ...payload,
    distance: distance,
    status: RIDE_STATUS.REQUESTED,
  };

  const createdRide = await Ride.create(requestPayload);

  await rider.save();
  return createdRide;
};

const updateRideStatus = async (
  id: string,
  payload: IUpdateRideStatusPayload,
  decodedToken: JwtPayload
) => {
  if (!id || !payload || !decodedToken) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Something Went Wrong, in your data"
    );
  }
  const ride = await Ride.findById(id);
  if (!ride) {
    throw new AppError(StatusCodes.NOT_FOUND, "Ride not found");
  }
  if (ride.status === payload.status) {
    throw new AppError(StatusCodes.CONFLICT, "Please provide different status");
  }

  // Rider Section
  if (decodedToken.role === Role.RIDER) {
    await handleRiderRideStatus(ride, payload, decodedToken);
    const updatedRide = await ride.save();
    return updatedRide;
  }
  // Driver Section
  if (decodedToken.role === Role.DRIVER) {
    if (ride.status === RIDE_STATUS.COMPLETED) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "This ride has been completed."
      );
    }

    let driver: IDriver | null = null;

    if (!ride.driverId) {
      if (payload.status !== RIDE_STATUS.ACCEPTED) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "No driver assigned to this ride yet. Please provide first status as accepted."
        );
      }
      driver = await Driver.findOne({ userId: decodedToken.userId });
      if (!driver) {
        throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
      }
    } else {
      driver = await Driver.findOne({ userId: ride.driverId });
      if (!driver) {
        throw new AppError(StatusCodes.NOT_FOUND, "Driver not found");
      }
    }

    await handleDriverRideStatus(driver, ride, payload, decodedToken);

    const updatedRide = await ride.save();
    return updatedRide;
  }
  // admin section
  if (
    decodedToken.role === Role.ADMIN ||
    decodedToken.role === Role.SUPER_ADMIN
  ) {
    await handleAdminRideStatus(ride, payload, decodedToken);
    const updatedRide = await ride.save();
    return updatedRide;
  }
};

const getMe = async (
  query: Record<string, string>,
  decodedToken: JwtPayload
) => {
  const queryBuilder = new QueryBuilder(
    Ride.find({ riderId: decodedToken.userId }),
    query
  );
  const rides = await queryBuilder.filter().sort().fields().paginate();
  const [data, meta] = await Promise.all([
    rides.build(),
    queryBuilder.getMeta(),
  ]);
  return { meta: meta, data: data };
};
const getAllRides = async (
  query: Record<string, string>,
  decodedToken: JwtPayload
) => {
  // Admin/Super Admin Section
  if (decodedToken.role !== Role.DRIVER) {
    const queryBuilder = new QueryBuilder(Ride.find(), query);
    const rides = await queryBuilder.filter().sort().fields().paginate();
    const [data, meta] = await Promise.all([
      rides.build(),
      queryBuilder.getMeta(),
    ]);
    return { meta: meta, data: data };
  }

  // Driver section start
  // ei driver je je ride er
  const queryBuilder = new QueryBuilder(
    Ride.find({ driverId: decodedToken.userId }),
    query
  );
  const rides = await queryBuilder.filter().sort().fields().paginate();
  const [data, meta] = await Promise.all([
    rides.build(),
    queryBuilder.getMeta(),
  ]);
  return { meta: meta, data: data };
  // Driver section end
};

export const RideServices = {
  requestRide,
  updateRideStatus,
  getMe,
  getAllRides,
};
