"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const driver_interface_1 = require("../driver/driver.interface");
const rideSchema = new mongoose_1.Schema({
    riderId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    vehicleType: {
        type: String,
        enum: { ...Object.values(driver_interface_1.IVehicleType) },
        required: true,
    },
    pickup: {
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
    },
    destination: {
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
    },
    distance: { type: Number },
    startTime: { type: Date },
    endTime: { type: Date },
    estimatedDuration: { type: Number, default: 0 },
    status: {
        type: String,
        enum: { ...Object.values(ride_interface_1.RIDE_STATUS) },
        default: ride_interface_1.RIDE_STATUS.REQUESTED,
    },
    adminAction: {
        by: { type: mongoose_1.Schema.Types.ObjectId },
        action: {
            type: String,
            enum: { ...Object.values(ride_interface_1.RIDE_STATUS) },
        },
        at: { type: Date },
    },
    cancelledBy: { type: mongoose_1.Schema.Types.ObjectId },
    cancellationReason: { type: String },
    cancellationTime: { type: Date },
    feedbackId: { type: mongoose_1.Schema.Types.ObjectId },
    paymentId: { type: mongoose_1.Schema.Types.ObjectId },
    fare: {
        baseFare: { type: Number },
        distanceFare: { type: Number },
        timeFare: { type: Number },
        platformFee: { type: Number },
        demandFare: { type: Number },
        discount: { type: Number },
        actualFare: { type: Number },
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
