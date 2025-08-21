import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { DriverServices } from "./driver.service";
import { JwtPayload } from "jsonwebtoken";

const createDriver = catchAsync(async (req: Request, res: Response) => {
  const driver = await DriverServices.createDriver(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Driver Created Successfully",
    data: driver,
  });
});

const getDrivers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const drivers = await DriverServices.getDrivers(query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Driver Retrieve Successfully",
    data: drivers,
  });
});
const getSingleDriver = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const decodedToken = req.user as JwtPayload;
  const driver = await DriverServices.getSingleDriver(id, decodedToken);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Drivers Retrieve Successfully",
    data: driver,
  });
});
const approveDriver = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const driver = await DriverServices.approveDriver(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Driver Approved Successfully",
    data: driver,
  });
});

export const DriverControllers = {
  createDriver,
  getDrivers,
  getSingleDriver,
  approveDriver,
};
