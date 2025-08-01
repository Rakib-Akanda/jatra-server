import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { FareRuleServices } from "./fareRule.service";

const createFareRule = catchAsync(async (req: Request, res: Response) => {
  const fareRule = await FareRuleServices.createFareRule(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "fareRule created Successfully",
    data: fareRule,
  });
});
const updateFareRule = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedFareRule = await FareRuleServices.updateFareRule(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "fareRule updated Successfully",
    data: updatedFareRule,
  });
});
const getSingleFareRule = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const fareRule = await FareRuleServices.getSingleFareRule(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "fareRule Retrieve Successfully",
    data: fareRule,
  });
});
const getFareRule = catchAsync(async (req: Request, res: Response) => {
  const fareRules = await FareRuleServices.getFareRule();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "fareRule Retrieve Successfully",
    data: fareRules,
  });
});

export const FareRuleControllers = {
  createFareRule,
  updateFareRule,
  getSingleFareRule,
  getFareRule,
};
