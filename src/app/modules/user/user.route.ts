import { Router } from "express";
import { UserController } from "./user.controller";
import { validRequest } from "../../middlewares/validRequest";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validRequest(createUserZodSchema),
  UserController.createUser
);

export const UserRoutes = router;
