import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { ValidateSignInRequestBody } from "../middlewares/validateSignInRequestBody.middleware";
import { verifyJwtToken } from "../middlewares/verifyJwtToken.middleware";

const authRouter = Router();

authRouter.post("/signup", authController.signUp);

/**
 * * user sign in route
 */
authRouter.post("/signin", [ValidateSignInRequestBody], authController.signIn);
authRouter.post(
  "/change-password",
  [verifyJwtToken],
  authController.changePassword
);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);

export const AuthRouter = authRouter;
