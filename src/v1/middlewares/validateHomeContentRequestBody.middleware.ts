import { NextFunction, Request, Response } from "express";
import { Logger } from "../loggers/logger";
import { BadRequestError } from "../errors/badRequest.error";
import { CreateHomeContentRequestBody } from "../validators/homeContentRequestBody.validator";

export const ValidateHomeContentRequestBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const reqBodyFromFormData = JSON.parse(req.body.jsonData);
        Logger.debug("home-content-create-request-body: %s", reqBodyFromFormData);

        const result = await CreateHomeContentRequestBody.validateAsync(reqBodyFromFormData);
        Logger.debug("homeContent-create-request-body-validation-result: %s", result);

        res.locals.reqBody = result;
        next();
    } catch (error: any) {
        const origin = error.origin ? error.origin : "ValidateHomeContentRequestBody-base-error";
        const code = error.code ? error.code : 3000;
        const message = error.message
            ? error.message
            : "`Any of these fields {headline, mission, vision, cta_text, cta_link. ${error.details[0].message}`";
        error = new BadRequestError(origin, message, code);
        next(error);
    }
};
