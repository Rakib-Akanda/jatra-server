/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import { envVars } from "./app/config/env";
import mongoose from "mongoose";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";

let server: Server;

const bootStrap = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("✅ Connected to DB");

    server = app.listen(Number(envVars.PORT), () => {
      console.log(`✅ Server is running on port ${Number(envVars.PORT)}`);
    });
  } catch (error) {
    console.log(error);
  }
};

// IIFE
(async () => {
  await connectRedis();
  await bootStrap();
  await seedSuperAdmin();
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
