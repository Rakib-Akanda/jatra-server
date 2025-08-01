"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const getDistance_1 = require("../../utils/getDistance");
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const rideHelpers_1 = require("../../helpers/rideHelpers");
const driver_model_1 = require("../driver/driver.model");
const requestRide = async (payload, decodedToken) => {
    if (!payload.riderId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Rider id not found");
    }
    if (decodedToken.userId !== payload.riderId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Rider id not match");
    }
    if (!payload.pickup || !payload.destination) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Pickup or Destination not found");
    }
    const distance = (0, getDistance_1.getDistance)(payload.pickup?.lat, payload.pickup?.lon, payload.destination?.lat, payload.destination?.lon);
    if (distance <= 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Pickup and Destination cannot be same");
    }
    const rider = await user_model_1.User.findById(payload.riderId).select("-password");
    if (!rider) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Rider not found");
    }
    if (rider.isDeleted || rider.isActive !== user_interface_1.IsActive.ACTIVE) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Rider is not active");
    }
    //  Prevent duplicate concurrent ride Request
    const existingRide = await ride_model_1.Ride.findOne({
        riderId: payload.riderId,
        status: {
            $in: [
                ride_interface_1.RIDE_STATUS.REQUESTED,
                ride_interface_1.RIDE_STATUS.ACCEPTED,
                ride_interface_1.RIDE_STATUS.IN_TRANSIT,
            ],
        },
    });
    if (existingRide) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "You already have an ongoing ride request");
    }
    // Rate limiting rider ride request
    const recentRequests = await ride_model_1.Ride.countDocuments({
        riderId: payload.riderId,
        createdAt: { $gte: new Date(Date.now() - 60 * 1000) }, // last 1 minute
    });
    if (recentRequests >= 3) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.TOO_MANY_REQUESTS, "Too many ride requests in short time");
    }
    const requestPayload = {
        ...payload,
        distance: distance,
        status: ride_interface_1.RIDE_STATUS.REQUESTED,
    };
    const createdRide = await ride_model_1.Ride.create(requestPayload);
    await rider.save();
    return createdRide;
};
const updateRideStatus = async (id, payload, decodedToken) => {
    if (!id || !payload || !decodedToken) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Something Went Wrong, in your data");
    }
    const ride = await ride_model_1.Ride.findById(id);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Ride not found");
    }
    if (ride.status === payload.status) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Please provide different status");
    }
    // Rider Section
    if (decodedToken.role === user_interface_1.Role.RIDER) {
        await (0, rideHelpers_1.handleRiderRideStatus)(ride, payload, decodedToken);
        const updatedRide = await ride.save();
        return updatedRide;
    }
    // Driver Section
    if (decodedToken.role === user_interface_1.Role.DRIVER) {
        if (ride.status === ride_interface_1.RIDE_STATUS.COMPLETED) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This ride has been completed.");
        }
        let driver = null;
        if (!ride.driverId) {
            if (payload.status !== ride_interface_1.RIDE_STATUS.ACCEPTED) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No driver assigned to this ride yet. Please provide first status as accepted.");
            }
            driver = await driver_model_1.Driver.findOne({ userId: decodedToken.userId });
            if (!driver) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver not found");
            }
        }
        else {
            driver = await driver_model_1.Driver.findOne({ userId: ride.driverId });
            if (!driver) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver not found");
            }
        }
        await (0, rideHelpers_1.handleDriverRideStatus)(driver, ride, payload, decodedToken);
        const updatedRide = await ride.save();
        return updatedRide;
    }
    // admin section
    if (decodedToken.role === user_interface_1.Role.ADMIN ||
        decodedToken.role === user_interface_1.Role.SUPER_ADMIN) {
        await (0, rideHelpers_1.handleAdminRideStatus)(ride, payload, decodedToken);
        const updatedRide = await ride.save();
        return updatedRide;
    }
};
const getMe = async (query, decodedToken) => {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(ride_model_1.Ride.find({ riderId: decodedToken.userId }), query);
    const rides = await queryBuilder.filter().sort().fields().paginate();
    const [data, meta] = await Promise.all([
        rides.build(),
        queryBuilder.getMeta(),
    ]);
    return { meta: meta, data: data };
};
const getAllRides = async (query, decodedToken) => {
    // Admin/Super Admin Section
    if (decodedToken.role !== user_interface_1.Role.DRIVER) {
        const queryBuilder = new QueryBuilder_1.QueryBuilder(ride_model_1.Ride.find(), query);
        const rides = await queryBuilder.filter().sort().fields().paginate();
        const [data, meta] = await Promise.all([
            rides.build(),
            queryBuilder.getMeta(),
        ]);
        return { meta: meta, data: data };
    }
    // Driver section start
    // ei driver je je ride er
    const queryBuilder = new QueryBuilder_1.QueryBuilder(ride_model_1.Ride.find({ driverId: decodedToken.userId }), query);
    const rides = await queryBuilder.filter().sort().fields().paginate();
    const [data, meta] = await Promise.all([
        rides.build(),
        queryBuilder.getMeta(),
    ]);
    return { meta: meta, data: data };
    // Driver section end
};
exports.RideServices = {
    requestRide,
    updateRideStatus,
    getMe,
    getAllRides,
};
