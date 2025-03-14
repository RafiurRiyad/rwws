import { NextFunction, Request, Response } from "express";
import { Logger } from "../loggers/logger";
import { BadRequestError } from "../errors/badRequest.error";
import { tokenGenerator } from "../helpers/tokenGenerator.helper";
import { UserDAO } from "../dao/user.dao";
import { Success } from "../responses/http.response";
import {
  generateRandomValidPassword,
  generateUserEntityObject,
  isValidPassword,
  sanitizeLoginTokenResponse,
} from "../utilities/user.utility";
import {
  sendPasswordResetEmail,
  sendSignUpEmail,
} from "../utilities/emailSender.utility";

const userDAO = new UserDAO();

/**
 * * Sign up a new user with provided email and username
 * * Generate a random password and send it via email
 * @function signup
 * @param {Request} req - Express request object containing email and username
 * @param {Response} res - Express response object for sending the result
 * @param {NextFunction} next - Express middleware function for error handling
 */
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    /**
     * * get {email, username} from request body
     */
    const { email, username } = req.body;

    /**
     * * check if email already exists, send 400 BadRequestError
     * @function BadRequestError
     * @param {origin, message, code}
     */
    const existingUser = await userDAO.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestError(
        "signup-email-exists",
        "This email is already registered",
        3001
      );
    }

    /**
     * * generate a random password with 16 characters (characters and numbers only)
     * * as per the password generation rule
     */
    const randomPassword = await generateRandomValidPassword(); // Utility to generate a password

    /**
     * * create a new user in the database
     * * set the temporary password for the user
     * * use hashed password before saving
     */

    const user = generateUserEntityObject(
      email,
      randomPassword,
      username,
      null
    );

    user.password = await user.hashPassword(user.password);
    const newUser = await userDAO.save(user);

    /**
     * * send the generated password to the user's email address
     */
    await sendSignUpEmail(email, username, randomPassword);

    /**
     * * respond with a success message and send only email and username
     */
    return Success(res, {
      message: "User created successfully",
      data: {
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error: any) {
    /**
     * * error handling with origin and default values for error object
     */
    error.origin = error.origin ? error.origin : "signup-base-error";
    error.message = error.message ? error.message : "Signup process failed";
    error.code = error.code ? error.code : 3000;
    next(error);
  }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    /**
     * * get {email, password } form request body
     */
    const { email, password } = req.body;

    /**
     * * check if user email doesn't exists, send 400 BadRequestError
     * @function BadRequestError
     * @param {origin, message, code}
     */
    const userInfo = await userDAO.findOneByEmail(email);
    Logger.debug("userInfo: %s", userInfo);
    if (!userInfo) {
      throw new BadRequestError(
        "signIn-user-not-registered",
        "This email is not registered, SignUp first",
        3000
      );
    }

    /**
     * * compare the request password and db password
     * * if password doesn't match send 400 BadRequestError
     * @function BadRequestError
     * @param {origin, message, code}
     */
    const comparePassword = await userInfo.validatePassword(password);
    Logger.debug("signIn-comparePassword: %s", comparePassword);
    if (!comparePassword) {
      throw new BadRequestError(
        "signIn-wrong-password",
        "Invalid email or password",
        3000
      );
    }

    const tokenResponse = await tokenGenerator(userInfo);

    return Success(res, {
      message: "login successful",
      data: sanitizeLoginTokenResponse(tokenResponse),
    });
  } catch (error: any) {
    error.origin = error.origin ? error.origin : "signIn-base-error";
    error.message = error.message ? error.message : "Sign In send otp error";
    error.code = error.code ? error.code : 3000;
    next(error);
  }
};

// const signOut = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = req.headers["authorization"]?.split(" ")[1]; // Get the token from the Authorization header

//     if (!token) {
//       throw new BadRequestError(
//         "signOut-no-token",
//         "No token provided, please log in",
//         3003
//       );
//     }

//     // Call the invalidateSession method with the token from header
//     const result = await invalidateToken(token, "your-secret-key");

//     return Success(res, {
//       message: "sign out successful",
//       data: null,
//     });
//   } catch (error: any) {
//     error.origin = error.origin ? error.origin : "signOut-base-error";
//     error.message = error.message ? error.message : "SignOut error";
//     error.code = error.code ? error.code : 3004;
//     next(error);
//   }
// };

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    /**
     * * get {oldPassword, newPassword} from request body
     */
    const { oldPassword, newPassword } = req.body;

    /**
     * * get userId from request locals
     */
    const userId = res.locals.userId;

    /**
     * * check if userId exists, if not send 400 BadRequestError
     * @function BadRequestError
     * @param {origin, message, code}
     */
    const userInfo = await userDAO.findOneById(userId);
    Logger.debug("changePassword-userInfo: %s", userInfo);
    if (!userInfo) {
      throw new BadRequestError(
        "changePassword-user-not-found",
        "User not found, please log in again",
        3005
      );
    }

    /**
     * * compare the oldPassword with the current password in the database
     * * if password doesn't match, send 400 BadRequestError
     * @function BadRequestError
     * @param {origin, message, code}
     */
    const isOldPasswordValid = await userInfo.validatePassword(oldPassword);
    Logger.debug("changePassword-oldPasswordValid: %s", isOldPasswordValid);
    if (!isOldPasswordValid) {
      throw new BadRequestError(
        "changePassword-wrong-old-password",
        "Old password is incorrect",
        3006
      );
    }

    /**
     * * validate the newPassword (e.g., check length, complexity)
     * * if not valid, send 400 BadRequestError
     */
    if (!(await isValidPassword(newPassword))) {
      throw new BadRequestError(
        "changePassword-invalid-new-password",
        "New password does not meet the required criteria",
        3007
      );
    }

    /**
     * * update the password in the database
     */
    userInfo.password = await userInfo.hashPassword(newPassword);

    const userSaveResponse = await userDAO.save(userInfo);
    Logger.debug("changePassword-password-updated");

    return Success(res, {
      message: "Password changed successfully",
      data: userSaveResponse,
    });
  } catch (error: any) {
    error.origin = error.origin ? error.origin : "changePassword-base-error";
    error.message = error.message ? error.message : "Error changing password";
    error.code = error.code ? error.code : 3008;
    next(error);
  }
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    /**
     * * get {email} from request body
     */
    const { email } = req.body;

    /**
     * * check if user email exists in the database
     * * if email exists, generate a new valid temporary password and store it in the temp_pass column
     */
    const userInfo = await userDAO.findOneByEmail(email);
    Logger.debug("forgotPassword-userInfo: %s", userInfo);

    if (userInfo) {
      /**
       * * Generate a random valid password:
       * * - 16 characters long
       * * - Contains only uppercase and lowercase letters and numbers
       */
      const tempPassword = await generateRandomValidPassword();
      Logger.debug("forgotPassword-tempPassword: %s", tempPassword);

      /**
       * * Update the user's temp_pass column with the new temporary password
       */
      userInfo.temp_pass = tempPassword;
      await userDAO.save(userInfo);
      Logger.debug("forgotPassword-tempPassword-updated");

      /**
       * * Send an email with the temporary password (simulated here)
       */
      await sendPasswordResetEmail(userInfo.email, tempPassword);
      Logger.debug("forgotPassword-email-sent");
    }

    /**
     * * Always respond with a success message regardless of whether the user exists or not
     */
    return Success(res, {
      message: "Successfully sent a mail for resetting password",
      data: null,
    });
  } catch (error: any) {
    error.origin = error.origin ? error.origin : "forgotPassword-base-error";
    error.message = error.message ? error.message : "Forgot password error";
    error.code = error.code ? error.code : 3009;
    next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    /**
     * * get {email, tempPass} from request body
     */
    const { email, tempPass } = req.body;

    /**
     * * Check if the user with the given email exists
     */
    const userInfo = await userDAO.findOneByEmail(email);
    Logger.debug("resetPassword-userInfo: %s", userInfo);

    if (!userInfo) {
      throw new BadRequestError(
        "resetPassword-email-not-found",
        "Email not registered",
        3010
      );
    }

    /**
     * * Check if tempPass matches the stored temp_pass in the database
     */
    const isTempPassValid = tempPass === userInfo.temp_pass;
    Logger.debug("resetPassword-isTempPassValid: %s", isTempPassValid);

    if (!isTempPassValid) {
      throw new BadRequestError(
        "resetPassword-invalid-temp-pass",
        "Temporary password is not correct",
        3011
      );
    }

    /**
     * * If tempPass is valid, update the user's password with tempPass and set tempPass to null
     */
    userInfo.password = tempPass;
    userInfo.temp_pass = null;
    userInfo.password = await userInfo.hashPassword(userInfo.password);

    await userDAO.save(userInfo);
    Logger.debug("resetPassword-password-updated");

    /**
     * * Respond with success message
     */
    return Success(res, {
      message: "Password has been reset successfully",
      data: null,
    });
  } catch (error: any) {
    error.origin = error.origin ? error.origin : "resetPassword-base-error";
    error.message = error.message ? error.message : "Reset password error";
    error.code = error.code ? error.code : 3012;
    next(error);
  }
};

export const authController = {
  signUp,
  signIn,
  // signOut,
  changePassword,
  forgotPassword,
  resetPassword,
};
