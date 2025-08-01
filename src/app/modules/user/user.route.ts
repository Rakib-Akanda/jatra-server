import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validRequest } from "../../middlewares/validRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validRequest(createUserZodSchema),
  UserControllers.createUser
);
router.post(
  "/block/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.blockUser
);
router.post(
  "/unblock/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.unblockUser
);

router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getSingleUser
);
router.patch(
  "/:id",
  validRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

export const UserRoutes = router;
