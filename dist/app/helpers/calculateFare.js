"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFare = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const fareRule_model_1 = require("../modules/fareRule/fareRule.model");
const calculateFare = async (ride) => {
    if (!ride || !ride.vehicleType) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid ride data");
    }
    const fareRule = await fareRule_model_1.FareRule.findOne({ vehicleType: ride.vehicleType });
    if (!fareRule) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Fare rule not found");
    }
    const baseFare = Number(fareRule.baseFare.toFixed(2));
    const distanceFare = Number(((ride.distance ?? 0) * fareRule.perKmFare).toFixed(2));
    const timeFare = Number(((ride.estimatedDuration ?? 0) * fareRule.perMinuteFare).toFixed(2));
    const demandMultiplier = fareRule.demandMultiplier ?? 1;
    const discountRate = fareRule.discount ?? 0;
    const initialFare = Number((baseFare + distanceFare + timeFare).toFixed(2));
    // apply demand
    const demandAmount = Number((initialFare * demandMultiplier).toFixed(2));
    const discountAmount = Number((demandAmount * discountRate).toFixed(2));
    const actualFare = Number((demandAmount - discountAmount).toFixed(2));
    const fare = {
        baseFare,
        distanceFare,
        timeFare,
        demandMultiplier: Number(fareRule.demandMultiplier.toFixed(2)),
        discount: discountAmount,
        actualFare,
    };
    return fare;
};
exports.calculateFare = calculateFare;
