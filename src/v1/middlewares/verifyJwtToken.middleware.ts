import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { AppConfig } from "../configs/app.config";

// Middleware to verify JWT token
export const verifyJwtToken = (
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
        "Authorization token is missing",
        4001
      );
    }

    const token = authHeader.split(" ")[1]; // Get the actual token after "Bearer"

    // Verify token using jwt.verify
    const decodedToken = jwt.verify(token, AppConfig.jwtSecret as string);
    // req.user = decodedToken; // Attach the decoded token to the request object

    next(); // Proceed to the next middleware or route handler
  } catch (error: any) {
    // Handle token errors (invalid token, expired token, etc.)
    if (error.name === "TokenExpiredError") {
      next(
        new UnauthorizedError("token-expired", "JWT token has expired", 4002)
      );
    } else if (error.name === "JsonWebTokenError") {
      next(new UnauthorizedError("token-invalid", "Invalid JWT token", 4003));
    } else {
      next(
        new UnauthorizedError(
          "token-verification-failed",
          "Token verification failed",
          4004
        )
      );
    }
  }
};
