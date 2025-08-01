import { Router } from "express";
import { RideControllers } from "./ride.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validRequest } from "../../middlewares/validRequest";
import {
  createRideZodSchema,
  updateRideStatusZodSchema,
} from "./ride.validation";

const router = Router();

router.post(
  "/request",
  checkAuth(Role.RIDER),
  validRequest(createRideZodSchema),
  RideControllers.requestRide
);
router.patch(
  "/:id/status",
  checkAuth(...Object.values(Role)),
  validRequest(updateRideStatusZodSchema),
  RideControllers.updateRideStatus
);
router.get("/me", checkAuth(Role.RIDER), RideControllers.getMe);

router.get(
  "/",
  checkAuth(Role.DRIVER, Role.ADMIN, Role.SUPER_ADMIN),
  RideControllers.getAllRides
);

export const RideRoutes = router;
