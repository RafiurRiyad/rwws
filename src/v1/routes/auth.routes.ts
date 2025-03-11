import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { ValidateSignInRequestBody } from "../middlewares/validateSignInRequestBody.middleware";

const authRouter = Router();

/**
 * * user sign in route
 */
authRouter.post("/signin", [ValidateSignInRequestBody], authController.signIn);

export const AuthRouter = authRouter;
