import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { RideServices } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";

const requestRide = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const rideRequest = await RideServices.requestRide(req.body, decodedToken);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Ride request Successfully",
    data: rideRequest,
  });
});
const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const decodedToken = req.user as JwtPayload;

  const updatedRideRequest = await RideServices.updateRideStatus(
    id,
    req.body,
    decodedToken
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Ride Updated Successfully",
    data: updatedRideRequest,
  });
});
const getMe = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const query = req.query as Record<string, string>;
  const rides = await RideServices.getMe(query, decodedToken);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Ride Retrieve Successfully",
    data: rides,
  });
});
const getAllRides = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const query = req.query as Record<string, string>;
  const rides = await RideServices.getAllRides(query, decodedToken);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Ride Retrieve Successfully",
    data: rides,
  });
});

export const RideControllers = {
  requestRide,
  updateRideStatus,
  getMe,
  getAllRides,
};
