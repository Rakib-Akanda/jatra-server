import { Request } from "express";

export const getClientIp = (req: Request): string => {
  let ip =
    typeof req.headers["x-forwarded-for"] === "string"
      ? req.headers["x-forwarded-for"].split(",")[0]
      : req.socket?.remoteAddress || "";

  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
    ip = ip.trim().replace(/^\[|]$/g, "");
  }

  return ip;
};
