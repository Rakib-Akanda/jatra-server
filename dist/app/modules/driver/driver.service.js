"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const driver_interface_1 = require("./driver.interface");
const driver_model_1 = require("./driver.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_interface_1 = require("../user/user.interface");
const createDriver = async (payload) => {
    const existingDriverPromise = driver_model_1.Driver.findOne({ userId: payload.userId });
    const userPromise = user_model_1.User.findById({ _id: payload.userId }).select("-password");
    const [existingDriver, user] = await Promise.all([
        existingDriverPromise,
        userPromise,
    ]);
    if (existingDriver) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Driver already exist with this user ID.");
    }
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User ID not found.");
    }
    const driverPayload = {
        ...payload,
        name: user.name,
        email: user.email,
    };
    const driver = await driver_model_1.Driver.create(driverPayload);
    return driver;
};
const getDrivers = async (query) => {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(driver_model_1.Driver.find(), query);
    const drivers = await queryBuilder.filter().sort().fields().paginate();
    const [data, meta] = await Promise.all([
        drivers.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
};
const getSingleDriver = async (id, decodedToken) => {
    const driver = await driver_model_1.Driver.findById(id);
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Driver not found.");
    }
    if (decodedToken.role === user_interface_1.Role.DRIVER || decodedToken.role === user_interface_1.Role.RIDER) {
        if (decodedToken.userId !== driver.userId.toString()) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not permitted.");
        }
        return driver;
    }
    if (decodedToken.role === user_interface_1.Role.ADMIN ||
        decodedToken.role === user_interface_1.Role.SUPER_ADMIN) {
        return driver;
    }
    throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Invalid role access");
};
const approveDriver = async (id, payload) => {
    const session = await driver_model_1.Driver.startSession();
    session.startTransaction();
    try {
        const driver = await driver_model_1.Driver.findById(id);
        if (!driver) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Diver request not found");
        }
        if (driver.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is deleted");
        }
        if (driver.driverStatus === payload.driverStatus ||
            driver.isAvailable === payload.isAvailable) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Please provide different data.");
        }
        let deletedDriver;
        let user;
        if (payload.isDeleted) {
            deletedDriver = await driver_model_1.Driver.findByIdAndDelete(id, { new: true });
            user = await user_model_1.User.findByIdAndUpdate({ _id: driver.userId }, {
                role: user_interface_1.Role.RIDER,
            }, {
                new: true,
                runValidators: true,
                session,
            }).select("_id, name email role");
            await session.commitTransaction();
            session.endSession();
            return { deletedDriver, user };
        }
        const approvedDriver = await driver_model_1.Driver.findByIdAndUpdate(id, {
            driverStatus: payload.driverStatus,
            isAvailable: payload.isAvailable,
        }, { new: true, runValidators: true, session });
        if (payload.driverStatus === driver_interface_1.IDriverStatus.APPROVED) {
            user = await user_model_1.User.findByIdAndUpdate({ _id: driver.userId }, {
                //   role: Role.DRIVER,
                role: user_interface_1.Role.DRIVER,
            }, {
                new: true,
                runValidators: true,
                session,
            }).select("_id, name email role");
        }
        await session.commitTransaction();
        session.endSession();
        return user ? { approvedDriver, user } : approvedDriver;
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};
exports.DriverServices = {
    createDriver,
    getDrivers,
    getSingleDriver,
    approveDriver,
};
