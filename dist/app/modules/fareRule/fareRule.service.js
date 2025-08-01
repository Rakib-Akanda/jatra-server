"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FareRuleServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const fareRule_model_1 = require("./fareRule.model");
const createFareRule = async (payload) => {
    const existFareRule = await fareRule_model_1.FareRule.findOne({
        vehicleType: payload.vehicleType,
    });
    if (existFareRule) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, `Fare rule for vehicle type '${payload.vehicleType}' already exists. You can update the existing rule instead.`);
    }
    const newFareRule = await fareRule_model_1.FareRule.create(payload);
    return newFareRule;
};
const updateFareRule = async (id, payload) => {
    if (payload.vehicleType) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `The field 'vehicleType' is not updatable.`);
    }
    const existFareRule = await fareRule_model_1.FareRule.findById(id);
    if (!existFareRule) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "fareRule not found");
    }
    const updatedFareRule = await fareRule_model_1.FareRule.findByIdAndUpdate(id, {
        $set: payload,
    }, { new: true, runValidators: true });
    return updatedFareRule;
};
const getSingleFareRule = async (id) => {
    const fareRule = await fareRule_model_1.FareRule.findById(id);
    if (!fareRule) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "fareRule not found");
    }
    return fareRule;
};
const getFareRule = async () => {
    const fareRule = await fareRule_model_1.FareRule.find();
    if (!fareRule) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "fareRule not found");
    }
    return fareRule;
};
exports.FareRuleServices = {
    createFareRule,
    updateFareRule,
    getSingleFareRule,
    getFareRule,
};
