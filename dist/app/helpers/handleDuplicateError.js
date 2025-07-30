"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
const handleDuplicateError = (err) => {
    let message = "Duplicate key error";
    const key = err?.keyValue ? Object.keys(err.keyValue)[0] : null;
    const value = err?.keyValue ? Object.values(err.keyValue)[0] : null;
    if (key && value) {
        message = `${key} (${value}) already exists!`;
    }
    return {
        statusCode: 400,
        message,
    };
};
exports.handleDuplicateError = handleDuplicateError;
