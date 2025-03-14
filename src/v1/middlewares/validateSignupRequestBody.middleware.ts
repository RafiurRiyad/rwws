import { NextFunction, Request, Response } from "express";
import { Logger } from "../loggers/logger";
import { BadRequestError } from "../errors/badRequest.error";
import {
  SignInRequestBody,
  SignupRequestBody,
} from "../validators/authRequestBody.validator";

export const ValidateSignUpRequestBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    Logger.debug("sign-up-request-body: %s", req.body);
    const result = await SignupRequestBody.validateAsync(req.body);
    Logger.debug("sign-up-request-body-validation-result: %s", result);
    next();
  } catch (error: any) {
    const origin = error.origin
      ? error.origin
      : "ValidateSignUpRequestBody-base-error";
    const code = error.code ? error.code : 3000;
    const message = error.message
      ? error.message
      : "`Any of these fields {email, password, username} not provided or in incorrect format. ${error.details[0].message}`";
    error = new BadRequestError(origin, message, code);
    next(error);
  }
};
