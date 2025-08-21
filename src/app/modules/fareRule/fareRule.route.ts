import { Router } from "express";
import { FareRuleControllers } from "./fareRule.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validRequest } from "../../middlewares/validRequest";
import {
  createFareRuleZodSchema,
  updateFareRuleZodSchema,
} from "./fareRule.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validRequest(createFareRuleZodSchema),
  FareRuleControllers.createFareRule
);
router.post(
  "/update/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validRequest(updateFareRuleZodSchema),
  FareRuleControllers.updateFareRule
);

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  FareRuleControllers.getSingleFareRule
);
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  FareRuleControllers.getFareRule
);

export const FareRuleRoutes = router;
