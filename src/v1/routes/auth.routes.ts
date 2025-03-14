import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { ValidateSignInRequestBody } from "../middlewares/validateSignInRequestBody.middleware";
import { verifyJwtToken } from "../middlewares/verifyJwtToken.middleware";

const authRouter = Router();

/**
 * * user sign up route
 */
authRouter.post("/signup", authController.signUp);

/**
 * * user sign in route
 */
authRouter.post("/signin", [ValidateSignInRequestBody], authController.signIn);

/**
 * * user change password route (requires JWT token)
 */
authRouter.post(
  "/change-password",
  [verifyJwtToken],
  authController.changePassword
);

/**
 * * user forgot password route
 */
authRouter.post("/forgot-password", authController.forgotPassword);

/**
 * * user reset password route
 */
authRouter.post("/reset-password", authController.resetPassword);

export const AuthRouter = authRouter;
