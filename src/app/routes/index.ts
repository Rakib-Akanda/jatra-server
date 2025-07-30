import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRouts } from "../modules/auth/auth.route";
import { OTPRoutes } from "../modules/otp/otp.route";
import { DriverRoutes } from "../modules/driver/driver.route";

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
  {
    path: "/otp",
    route: OTPRoutes,
  },
  {
    path: "/driver",
    route: DriverRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
