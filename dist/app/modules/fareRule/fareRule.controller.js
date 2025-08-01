"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FareRuleControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const fareRule_service_1 = require("./fareRule.service");
const createFareRule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const fareRule = await fareRule_service_1.FareRuleServices.createFareRule(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "fareRule created Successfully",
        data: fareRule,
    });
});
const updateFareRule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const updatedFareRule = await fareRule_service_1.FareRuleServices.updateFareRule(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "fareRule updated Successfully",
        data: updatedFareRule,
    });
});
const getSingleFareRule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const fareRule = await fareRule_service_1.FareRuleServices.getSingleFareRule(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "fareRule Retrieve Successfully",
        data: fareRule,
    });
});
const getFareRule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const fareRules = await fareRule_service_1.FareRuleServices.getFareRule();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "fareRule Retrieve Successfully",
        data: fareRules,
    });
});
exports.FareRuleControllers = {
    createFareRule,
    updateFareRule,
    getSingleFareRule,
    getFareRule,
};
