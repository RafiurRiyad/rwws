import { NextFunction, Request, Response } from "express";
import { Logger } from "../loggers/logger";
import { BadRequestError } from "../errors/badRequest.error";
import { CreateStoryRequestBody } from "../validators/storyRequestBody.validator";

export const ValidateCreateStoryRequestBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const reqBodyFromFormData = JSON.parse(req.body.jsonData);
        Logger.debug("story-create-request-body: %s", reqBodyFromFormData);
        const result = await CreateStoryRequestBody.validateAsync(reqBodyFromFormData);
        Logger.debug("story-create-request-body-validation-result: %s", result);

        res.locals.reqBody = result;
        next();
    } catch (error: any) {
        const origin = error.origin ? error.origin : "ValidateCreateStoryRequestBody-base-error";
        const code = error.code ? error.code : 3000;
        const message = error.message
            ? error.message
            : "`Any of these fields {title, excerpt, content, category, location} not provided or in incorrect format. ${error.details[0].message}`";
        error = new BadRequestError(origin, message, code);
        next(error);
    }
};
