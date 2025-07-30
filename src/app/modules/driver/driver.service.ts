import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IDriver, IDriverStatus } from "./driver.interface";
import { Driver } from "./driver.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../user/user.interface";

const createDriver = async (payload: Partial<IDriver>) => {
  const existingDriverPromise = Driver.findOne({ userId: payload.userId });
  const userPromise = User.findById({ _id: payload.userId }).select(
    "-password"
  );
  const [existingDriver, user] = await Promise.all([
    existingDriverPromise,
    userPromise,
  ]);
  if (existingDriver) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Driver already exist with this user ID."
    );
  }
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User ID not found.");
  }
  const driverPayload = {
    ...payload,
    name: user.name,
    email: user.email,
  };
  const driver = await Driver.create(driverPayload);
  return driver;
};
const getDrivers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Driver.find(), query);

  const drivers = await queryBuilder.filter().sort().fields().paginate();

  const [data, meta] = await Promise.all([
    drivers.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};
const getSingleDriver = async (id: string, decodedToken: JwtPayload) => {
  const driver = await Driver.findById(id);
  if (!driver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Driver not found.");
  }
  if (driver.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "Driver is deleted");
  }
  if (decodedToken.role === Role.DRIVER || decodedToken.role === Role.RIDER) {
    if (decodedToken.userId !== driver.userId.toString()) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not permitted.");
    }
    return driver;
  }
  if (
    decodedToken.role === Role.ADMIN ||
    decodedToken.role === Role.SUPER_ADMIN
  ) {
    return driver;
  }
  throw new AppError(StatusCodes.FORBIDDEN, "Invalid role access");
};
const approveDriver = async (id: string, payload: Partial<IDriver>) => {
  const session = await Driver.startSession();
  session.startTransaction();
  try {
    const driver = await Driver.findById(id);
    if (!driver) {
      throw new AppError(StatusCodes.NOT_FOUND, "Diver request not found");
    }
    if (driver.isDeleted) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted");
    }
    if (
      driver.driverStatus === payload.driverStatus ||
      driver.isAvailable === payload.isAvailable
    ) {
      throw new AppError(
        StatusCodes.CONFLICT,
        "Please provide different data."
      );
    }
    let deletedDriver;
    let user;
    if (payload.isDeleted) {
      deletedDriver = await Driver.findByIdAndUpdate(
        id,
        {
          isDeleted: payload.isDeleted,
        },
        { new: true, runValidators: true, session }
      );
      user = await User.findByIdAndUpdate(
        { _id: driver.userId },
        {
          role: Role.RIDER,
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      ).select("_id name email role");

      await session.commitTransaction();
      session.endSession();
      return { deletedDriver, user };
    }
    const approvedDriver = await Driver.findByIdAndUpdate(
      id,
      {
        driverStatus: payload.driverStatus,
        isAvailable: payload.isAvailable,
      },
      { new: true, runValidators: true, session }
    );

    if (payload.driverStatus === IDriverStatus.APPROVED) {
      user = await User.findByIdAndUpdate(
        { _id: driver.userId },
        {
          //   role: Role.DRIVER,
          role: Role.DRIVER,
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      ).select("_id name email role");
    }
    await session.commitTransaction();
    session.endSession();
    return user ? { approvedDriver, user } : approvedDriver;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const DriverServices = {
  createDriver,
  getDrivers,
  getSingleDriver,
  approveDriver,
};
