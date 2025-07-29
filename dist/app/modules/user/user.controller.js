"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const user_service_1 = require("./user.service");
const createUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await user_service_1.UserServices.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "User Created Successfully",
        data: user,
    });
});
const updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await user_service_1.UserServices.updateUser(userId, payload, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "User Updated Successfully",
        data: user,
    });
});
const getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await user_service_1.UserServices.getAllUsers();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "User Updated Successfully",
        data: result,
        meta: result.meta,
    });
});
exports.UserController = {
    createUser,
    updateUser,
    getAllUsers,
};
