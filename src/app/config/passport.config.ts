/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../modules/user/user.model";
import { StatusCodes } from "http-status-codes";
import { IsActive, Role } from "../modules/user/user.interface";
import AppError from "../errorHelpers/AppError";
import bcryptjs from "bcryptjs";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
// Local Strategy
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

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_OAUTH.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_OAUTH.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_OAUTH.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No email found" });
        }
        let isUserExist = await User.findOne({ email });
        if (isUserExist && !isUserExist.isVerified) {
          return done(null, false, { message: "User is not verified" });
        }
        if (
          isUserExist &&
          (isUserExist.isActive === IsActive.BLOCKED ||
            isUserExist.isActive === IsActive.INACTIVE)
        ) {
          return done(`User is ${isUserExist.isActive}`);
        }
        if (isUserExist && isUserExist.isDeleted) {
          return done(null, false, { message: " User is deleted" });
        }
        if (!isUserExist) {
          isUserExist = await User.create({
            email,
            name: profile.displayName,
            image: profile.photos?.[0].value,
            role: Role.RIDER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log("❌ Google Strategy Error", error);
        return done(error);
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
