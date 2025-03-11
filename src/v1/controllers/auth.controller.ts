import { NextFunction, Request, Response } from "express";
import { Logger } from "../loggers/logger";
import { BadRequestError } from "../errors/badRequest.error";
import { tokenGenerator } from "../helpers/tokenGenerator.helper";
import { UserDAO } from "../dao/user.dao";
import { InternalServerError } from "../errors/internalServer.error";
import { Success } from "../responses/http.response";
import { sanitizeLoginTokenResponse } from "../utilities/user.utility";

const userDAO = new UserDAO();

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

export const authController = {
  signIn,
};
