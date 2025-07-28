import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(async (req: Request, res: Response) => {

    sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User create successfully",
    data: null,
  });
});

export const UserController = {
  createUser,
};
