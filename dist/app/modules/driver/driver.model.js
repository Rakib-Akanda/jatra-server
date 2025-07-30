"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const driver_interface_1 = require("./driver.interface");
const vehicleSchema = new mongoose_1.Schema({
    vehicleType: {
        type: String,
        enum: Object.values(driver_interface_1.IVehicleType),
        required: true,
    },
    vehicleModel: { type: String, required: true },
    vehicleNumberPlate: { type: String, required: true },
    vehicleColor: { type: String },
    seats: { type: Number },
}, {
    versionKey: false,
    _id: false,
});
const driverSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true,
    },
    name: { type: String },
    email: { type: String },
    NIDNumber: { type: Number, required: true, unique: true },
    licenseNumber: { type: Number, required: true, unique: true },
    vehicleInfo: vehicleSchema,
    isAvailable: { type: Boolean, default: false },
    driverStatus: {
        type: String,
        enum: Object.values(driver_interface_1.IDriverStatus),
        default: driver_interface_1.IDriverStatus.PENDING,
    },
    isDeleted: { type: Boolean, default: false },
    rating: { type: Number },
    totalRides: { type: Number },
    totalEarnings: { type: Number },
    currentLocation: {
        lat: { type: Number },
        lng: { type: Number },
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.Driver = (0, mongoose_1.model)("Driver", driverSchema);
