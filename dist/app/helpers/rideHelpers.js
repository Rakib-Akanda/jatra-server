"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRiderRideStatus = exports.handleDriverRideStatus = exports.handleAdminRideStatus = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const ride_interface_1 = require("../modules/ride/ride.interface");
const http_status_codes_1 = require("http-status-codes");
const calculateFare_1 = require("./calculateFare");
const updateDriverAvailability_1 = require("../utils/updateDriverAvailability");
const driver_model_1 = require("../modules/driver/driver.model");
const handleAdminRideStatus = async (ride, payload, decodedToken) => {
    //   if (ride.status === RIDE_STATUS.COMPLETED) {
    //     throw new AppError(
    //       StatusCodes.BAD_REQUEST,
    //       `You cannot update status, this ride at ${ride.status} stage`
    //     );
    //   }
    switch (payload.status) {
        case ride_interface_1.RIDE_STATUS.CANCELLED:
            ride.status = ride_interface_1.RIDE_STATUS.CANCELLED;
            ride.cancellationTime = new Date(Date.now());
            ride.cancelledBy = decodedToken.userId;
            ride.cancellationReason =
                payload.cancellationReason ?? "No reason provided";
            ride.adminAction = {
                by: decodedToken.userId,
                action: ride_interface_1.RIDE_STATUS.CANCELLED,
                at: new Date(Date.now()),
            };
            break;
        case ride_interface_1.RIDE_STATUS.ACCEPTED:
        case ride_interface_1.RIDE_STATUS.PICKED_UP:
        case ride_interface_1.RIDE_STATUS.IN_TRANSIT:
        case ride_interface_1.RIDE_STATUS.COMPLETED:
            ride.status = payload.status;
            if (payload.status === ride_interface_1.RIDE_STATUS.PICKED_UP) {
                ride.startTime = new Date(Date.now());
            }
            if (payload.status === ride_interface_1.RIDE_STATUS.COMPLETED) {
                ride.endTime = new Date(Date.now());
                if (ride.startTime && ride.endTime) {
                    const durationInMs = ride.endTime.getTime() - ride.startTime.getTime();
                    const durationInMin = Math.ceil(durationInMs / 1000 / 60);
                    ride.estimatedDuration = durationInMin;
                }
                else {
                    ride.estimatedDuration = 0;
                }
                ride.fare = await (0, calculateFare_1.calculateFare)(ride);
            }
            ride.adminAction = {
                by: decodedToken.userId,
                action: payload.status,
                at: new Date(Date.now()),
            };
            break;
        default:
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Invalid value: ${payload.status}`);
    }
};
exports.handleAdminRideStatus = handleAdminRideStatus;
const handleDriverRideStatus = async (driver, ride, payload, decodedToken) => {
    if (ride.driverId && decodedToken.userId !== ride.driverId?.toString()) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not able to update this ride.");
    }
    switch (payload.status) {
        case ride_interface_1.RIDE_STATUS.CANCELLED:
            if (ride.status !== ride_interface_1.RIDE_STATUS.REQUESTED &&
                ride.status !== ride_interface_1.RIDE_STATUS.ACCEPTED) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `You cannot cancel this ride at ${ride.status} stage`);
            }
            ride.status = ride_interface_1.RIDE_STATUS.CANCELLED;
            ride.cancellationTime = new Date(Date.now());
            ride.cancelledBy = decodedToken.userId;
            ride.cancellationReason =
                payload.cancellationReason ?? "No reason provided";
            await (0, updateDriverAvailability_1.updateDriverAvailability)(decodedToken.userId, true);
            break;
        case ride_interface_1.RIDE_STATUS.ACCEPTED:
            if (ride.status !== ride_interface_1.RIDE_STATUS.REQUESTED) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, " Ride is not REQUESTED state");
            }
            if (!driver.isAvailable) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are currently in another ride and not available.");
            }
            await (0, updateDriverAvailability_1.updateDriverAvailability)(decodedToken.userId, false);
            ride.status = ride_interface_1.RIDE_STATUS.ACCEPTED;
            ride.driverId = decodedToken.userId;
            break;
        case ride_interface_1.RIDE_STATUS.PICKED_UP:
            if (ride.status !== ride_interface_1.RIDE_STATUS.ACCEPTED) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Ride must be ACCEPTED before pickup");
            }
            ride.status = ride_interface_1.RIDE_STATUS.PICKED_UP;
            ride.startTime = new Date(Date.now());
            break;
        case ride_interface_1.RIDE_STATUS.IN_TRANSIT:
            if (ride.status !== ride_interface_1.RIDE_STATUS.PICKED_UP) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Ride must be PICKED_UP before going IN_TRANSIT.");
            }
            ride.status = ride_interface_1.RIDE_STATUS.IN_TRANSIT;
            break;
        case ride_interface_1.RIDE_STATUS.COMPLETED:
            if (ride.status !== ride_interface_1.RIDE_STATUS.IN_TRANSIT) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Ride must be IN_TRANSIT before completing.");
            }
            ride.status = ride_interface_1.RIDE_STATUS.COMPLETED;
            ride.endTime = new Date(Date.now());
            // calculate duration in minutes
            if (ride.startTime && ride.endTime) {
                const durationInMs = ride.endTime.getTime() - ride.startTime.getTime();
                const durationInMin = Math.ceil(durationInMs / 1000 / 60);
                ride.estimatedDuration = durationInMin;
            }
            else {
                ride.estimatedDuration = 0;
            }
            ride.fare = await (0, calculateFare_1.calculateFare)(ride);
            await (0, updateDriverAvailability_1.updateDriverAvailability)(decodedToken.userId, true);
            await driver_model_1.Driver.findByIdAndUpdate({ _id: driver._id }, {
                $inc: { totalRides: 1 },
            }, { new: true, runValidators: true });
            break;
        default:
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Invalid value: ${payload.status}`);
    }
};
exports.handleDriverRideStatus = handleDriverRideStatus;
const handleRiderRideStatus = async (ride, payload, decodedToken) => {
    if (decodedToken.userId !== ride.riderId?.toString()) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not able to update this ride.");
    }
    if (!(payload.status === ride_interface_1.RIDE_STATUS.CANCELLED)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Rider can only update CANCELLED status");
    }
    switch (payload.status) {
        case ride_interface_1.RIDE_STATUS.CANCELLED: {
            if (ride.status &&
                [
                    ride_interface_1.RIDE_STATUS.ACCEPTED,
                    ride_interface_1.RIDE_STATUS.PICKED_UP,
                    ride_interface_1.RIDE_STATUS.IN_TRANSIT,
                    ride_interface_1.RIDE_STATUS.COMPLETED,
                ].includes(ride.status)) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `You cannot cancel this ride because ride status is ${ride.status}`);
            }
            ride.status = ride_interface_1.RIDE_STATUS.CANCELLED;
            ride.cancelledBy = ride.riderId;
            ride.cancellationReason =
                payload.cancellationReason ?? "No reason provided";
            ride.cancellationTime = new Date(Date.now());
            break;
        }
        default:
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Rider can only update CANCELLED status");
    }
};
exports.handleRiderRideStatus = handleRiderRideStatus;
