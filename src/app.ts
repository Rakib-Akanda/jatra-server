import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { envVars } from "./app/config/env";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport.config";
import { notFound } from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // safety for form data
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Jatra",
  });
});

// global error
app.use(globalErrorHandler);
// not found route
app.use(notFound);

export default app;
