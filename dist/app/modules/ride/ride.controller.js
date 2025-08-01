"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const ride_service_1 = require("./ride.service");
const requestRide = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const rideRequest = await ride_service_1.RideServices.requestRide(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "Ride request Successfully",
        data: rideRequest,
    });
});
const updateRideStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const decodedToken = req.user;
    const updatedRideRequest = await ride_service_1.RideServices.updateRideStatus(id, req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Ride Updated Successfully",
        data: updatedRideRequest,
    });
});
const getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const query = req.query;
    const rides = await ride_service_1.RideServices.getMe(query, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Ride Retrieve Successfully",
        data: rides,
    });
});
const getAllRides = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const query = req.query;
    const rides = await ride_service_1.RideServices.getAllRides(query, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Ride Retrieve Successfully",
        data: rides,
    });
});
exports.RideControllers = {
    requestRide,
    updateRideStatus,
    getMe,
    getAllRides,
};
