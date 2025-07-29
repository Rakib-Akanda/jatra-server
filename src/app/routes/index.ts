import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRouts } from "../modules/auth/auth.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRouts,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
