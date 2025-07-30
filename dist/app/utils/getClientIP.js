"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientIp = void 0;
const getClientIp = (req) => {
    let ip = typeof req.headers["x-forwarded-for"] === "string"
        ? req.headers["x-forwarded-for"].split(",")[0]
        : req.socket?.remoteAddress || "";
    if (ip.startsWith("::ffff:")) {
        ip = ip.replace("::ffff:", "");
        ip = ip.trim().replace(/^\[|]$/g, "");
    }
    return ip;
};
exports.getClientIp = getClientIp;
