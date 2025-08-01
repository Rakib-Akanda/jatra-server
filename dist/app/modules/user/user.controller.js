"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
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
    const query = req.query;
    const result = await user_service_1.UserServices.getAllUsers(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "All Users Retrieve Successfully",
        data: result,
    });
});
const getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const result = await user_service_1.UserServices.getMe(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "User Retrieve Successfully",
        data: result,
    });
});
const getSingleUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.params.id;
    const result = await user_service_1.UserServices.getSingleUser(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "User Retrieve Successfully",
        data: result,
    });
});
const blockUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.params.id;
    const decodedToken = req.user;
    const result = await user_service_1.UserServices.blockUser(userId, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "User Blocked Successfully",
        data: result,
    });
});
const unblockUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.params.id;
    const decodedToken = req.user;
    const result = await user_service_1.UserServices.unblockUser(userId, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "User Retrieve Successfully",
        data: result,
    });
});
exports.UserControllers = {
    createUser,
    updateUser,
    getAllUsers,
    getMe,
    getSingleUser,
    blockUser,
    unblockUser,
};
