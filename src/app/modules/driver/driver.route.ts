import { Router } from "express";
import { DriverControllers } from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validRequest } from "../../middlewares/validRequest";
import {
  createDriverZodValidation,
  updateDriverZodValidation,
} from "./driver.validation";

const router = Router();

router.post(
  "/apply",
  checkAuth(Role.RIDER),
  validRequest(createDriverZodValidation),
  DriverControllers.createDriver
);
router.post(
  "/approve/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validRequest(updateDriverZodValidation),
  DriverControllers.approveDriver
);

router.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  DriverControllers.getSingleDriver
);
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DriverControllers.getDrivers
);

export const DriverRoutes = router;
