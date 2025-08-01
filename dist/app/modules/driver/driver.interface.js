"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDriverStatus = exports.IVehicleType = void 0;
var IVehicleType;
(function (IVehicleType) {
    IVehicleType["BIKE"] = "BIKE";
    IVehicleType["CAR"] = "CAR";
    IVehicleType["CNG"] = "CNG";
})(IVehicleType || (exports.IVehicleType = IVehicleType = {}));
var IDriverStatus;
(function (IDriverStatus) {
    IDriverStatus["APPROVED"] = "APPROVED";
    IDriverStatus["SUSPENDED"] = "SUSPENDED";
    IDriverStatus["PENDING"] = "PENDING";
})(IDriverStatus || (exports.IDriverStatus = IDriverStatus = {}));
