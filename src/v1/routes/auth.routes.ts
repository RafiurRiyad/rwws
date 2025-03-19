import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { ValidateSignInRequestBody } from "../middlewares/validateSignInRequestBody.middleware";
import { VerifyJwtToken } from "../middlewares/verifyJwtToken.middleware";
import { ValidateChangePasswordRequestBody } from "../middlewares/validateChangePasswordRequestBody.middleware";
import { ValidateForgotPasswordRequestBody } from "../middlewares/validateForgotPasswordRequestBody.middleware";
import { ValidateSignUpRequestBody } from "../middlewares/validateSignupRequestBody.middleware";
import { ValidateResetPasswordRequestBody } from "../middlewares/validateResetPasswordRequestBody.middleware";
import { VerifyRefreshToken } from "../middlewares/verifyRefreshToken.middleware";

const authRouter = Router();

/**
 * * user sign up route
 */
authRouter.post("/signup", [ValidateSignUpRequestBody], authController.signUp);

/**
 * * user sign in route
 */
authRouter.post("/signin", [ValidateSignInRequestBody], authController.signIn);

/**
 * * user logout route
 */
authRouter.post("/logout", [VerifyJwtToken], authController.signOut);

/**
 * * user change password route (requires JWT token)
 */
authRouter.post(
  "/change-password",
  [VerifyJwtToken],
  [ValidateChangePasswordRequestBody],
  authController.changePassword
);

/**
 * * user forgot password route
 */
authRouter.post(
  "/forgot-password",
  [ValidateForgotPasswordRequestBody],
  authController.forgotPassword
);

/**
 * * user reset password route
 */
authRouter.post(
  "/reset-password",
  [ValidateResetPasswordRequestBody],
  authController.resetPassword
);

/**
 * * user refresh token route
 */
authRouter.post(
  "/refresh-token",
  [VerifyRefreshToken],
  authController.refreshToken
);
export const AuthRouter = authRouter;
