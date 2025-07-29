/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../modules/user/user.model";
import { StatusCodes } from "http-status-codes";
import { IsActive } from "../modules/user/user.interface";
import AppError from "../errorHelpers/AppError";
import bcryptjs from "bcryptjs";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist!");
        }
        if (!isUserExist.isVerified) {
          throw new AppError(StatusCodes.BAD_REQUEST, " User is not verified");
        }
        if (
          isUserExist.isActive === IsActive.BLOCKED ||
          isUserExist.isActive === IsActive.INACTIVE
        ) {
          throw new AppError(
            StatusCodes.BAD_REQUEST,
            `User is ${isUserExist.isActive}`
          );
        }
        if (isUserExist.isDeleted) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted");
        }
        const isGoogleAuthenticated = isUserExist?.auths.some(
          (providerObject) =>
            providerObject.provider?.toLocaleLowerCase() === "google"
        );
        if (!isUserExist.password && isGoogleAuthenticated) {
          return done(null, false, {
            message:
              "Your account is linked with Google. Please log in with Google first and set a password to enable email login.",
          });
        }
        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isUserExist.password as string
        );
        if (!isPasswordMatched) {
          return done(null, false, { message: "Password does not match" });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: pass, ...userWithoutPassword } =
          isUserExist.toObject();
        return done(null, userWithoutPassword);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    if (user) delete user.password;
    done(null, user);
  } catch (error) {
    done(error);
  }
});
