/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";

let server: Server;

const bootStrap = async () => {
  try {
    server = app.listen(5000, () => {
      console.log(`✅ Server is running on port ${5000}`);
    });
  } catch (error) {
    console.log(error);
  }
};

// IIFE
(async () => {
  await bootStrap();
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
