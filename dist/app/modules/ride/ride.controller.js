"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const createRide = (0, catchAsync_1.catchAsync)(async (req, res) => {
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Ride request Successfully",
        data: {},
    });
});
exports.RideControllers = {
    createRide,
};
