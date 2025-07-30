"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const driver_service_1 = require("./driver.service");
const createDriver = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const driver = await driver_service_1.DriverServices.createDriver(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "Driver Created Successfully",
        data: driver,
    });
});
const getDrivers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const query = req.query;
    const drivers = await driver_service_1.DriverServices.getDrivers(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Driver Retrieve Successfully",
        data: drivers,
    });
});
const getSingleDriver = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const decodedToken = req.user;
    const driver = await driver_service_1.DriverServices.getSingleDriver(id, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Drivers Retrieve Successfully",
        data: driver,
    });
});
const approveDriver = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    const driver = await driver_service_1.DriverServices.approveDriver(id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "Driver Approved Successfully",
        data: driver,
    });
});
exports.DriverControllers = {
    createDriver,
    getDrivers,
    getSingleDriver,
    approveDriver,
};
