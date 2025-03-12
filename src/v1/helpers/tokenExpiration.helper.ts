import * as jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/badRequest.error";
import { AppConfig } from "../configs/app.config";

export const invalidateToken = async (token: string, secretKey: string) => {
  try {
    // Check if the token is provided
    if (!token) {
      throw new BadRequestError(
        "invalidateToken-no-token",
        "No token provided",
        4001
      );
    }

    // Verify the JWT token
    const { userId } = jwt.verify(token, AppConfig.jwtSecret) as {
      userId: string;
    };

    return { success: true, userId };
  } catch (error: any) {
    throw new BadRequestError(
      "invalidateToken-error",
      error.message || "Error invalidating session",
      4002
    );
  }
};
