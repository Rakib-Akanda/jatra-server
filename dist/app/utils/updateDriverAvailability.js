"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDriverAvailability = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const http_status_codes_1 = require("http-status-codes");
const driver_model_1 = require("../modules/driver/driver.model");
const updateDriverAvailability = async (decodedToken, isAvailable) => {
    if (!decodedToken.userId)
        return;
    const driver = await driver_model_1.Driver.findOne({ userId: decodedToken.userId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver not found for update available");
    }
    driver.isAvailable = isAvailable;
    await driver.save();
};
exports.updateDriverAvailability = updateDriverAvailability;
