import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../responses/http.response";

export const InvalidPath = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * * if the path is invalid send 400 BadRequestError response
   *@function BadRequest(res,payload)
   */
  return BadRequest(res, {
    message: "This path is not valid.",
  });
};
