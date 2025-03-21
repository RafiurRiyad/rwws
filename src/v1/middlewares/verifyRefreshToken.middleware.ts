import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { AppConfig } from "../configs/app.config";
import { UserDAO } from "../dao/user.dao";

// Middleware to verify refresh token
export const VerifyRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "token-missing",
        "Refresh token is missing",
        4001
      );
    }

    const token = authHeader.split(" ")[1]; // Get the actual token after "Bearer"

    // Verify refresh token using jwt.verify
    const decodedToken = jwt.verify(token, AppConfig.jwtSecret, {
      ignoreExpiration: false,
    });
    res.locals.userId = (decodedToken as JwtPayload).id;
    const iat = (decodedToken as JwtPayload).iat;

    // Find user in DB
    const user = await new UserDAO().findOneById(res.locals.userId);
    if (!user || user.iat !== iat) {
      throw new UnauthorizedError(
        "VerifyRefreshToken-check-user",
        "Invalid token or user does not exist",
        4005
      );
    }

    // Store user in response locals to use in the next controller
    res.locals.user = user;

    next(); // Proceed to the next middleware or route handler
  } catch (error: any) {
    // Handle refresh token errors (invalid token, expired token, etc.)
    if (error.name === "TokenExpiredError") {
      next(
        new UnauthorizedError(
          "refresh-token-expired",
          "Refresh token has expired",
          4002
        )
      );
    } else if (error.name === "JsonWebTokenError") {
      next(
        new UnauthorizedError(
          "refresh-token-invalid",
          "Invalid refresh token",
          4003
        )
      );
    } else {
      next(
        new UnauthorizedError(
          "refresh-token-verification-failed",
          "Invalid refresh token",
          4004
        )
      );
    }
  }
};
