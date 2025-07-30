"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentLocationWithIP = void 0;
const getClientIP_1 = require("./getClientIP");
const axios_1 = __importDefault(require("axios"));
const getCurrentLocationWithIP = async (req) => {
    const ip = (0, getClientIP_1.getClientIp)(req);
    const { data } = await axios_1.default.get(`http://ip-api.com/json/${ip}`);
    //   console.log("Geo location", data);
    let currentLocation;
    if (data.status === "success") {
        currentLocation = {
            lat: data?.lat,
            lon: data?.lon,
        };
        return {
            status: true,
            currentLocation,
        };
    }
    else {
        return { status: false, currentLocation: null };
    }
};
exports.getCurrentLocationWithIP = getCurrentLocationWithIP;
