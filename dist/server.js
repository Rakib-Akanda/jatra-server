"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const mongoose_1 = __importDefault(require("mongoose"));
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
const redis_config_1 = require("./app/config/redis.config");
let server;
const bootStrap = async () => {
    try {
        await mongoose_1.default.connect(env_1.envVars.DB_URL);
        console.log("✅ Connected to DB");
        server = app_1.default.listen(Number(env_1.envVars.PORT), () => {
            console.log(`✅ Server is running on port ${Number(env_1.envVars.PORT)}`);
        });
    }
    catch (error) {
        console.log(error);
    }
};
// IIFE
(async () => {
    await (0, redis_config_1.connectRedis)();
    await bootStrap();
    await (0, seedSuperAdmin_1.seedSuperAdmin)();
})();
process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection Detected. Server Shutting Down...", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception Detected. Server Shutting Down...", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received. Server shutting down...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGINT", () => {
    console.log("SIGINT signal received. Server shutting down...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
