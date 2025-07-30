/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import { getClientIp } from "./getClientIP";
import axios from "axios";
import { ILocation } from "../interfaces/location.type";

export const getCurrentLocationWithIP = async (req: Request) => {
  const ip = getClientIp(req);
  const { data }: any = await axios.get(`http://ip-api.com/json/${ip}`);
  //   console.log("Geo location", data);
  let currentLocation: ILocation;

  if (data.status === "success") {
    currentLocation = {
      lat: data?.lat,
      lon: data?.lon,
    };
    return {
      status: true,
      currentLocation,
    };
  } else {
    return { status: false, currentLocation: null };
  }
};
