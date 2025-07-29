"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const http_status_codes_1 = require("http-status-codes");
const generateToken = (payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn,
    });
    return token;
};
exports.generateToken = generateToken;
const verifyToken = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (err) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid or Expired Token");
    }
};
exports.verifyToken = verifyToken;
