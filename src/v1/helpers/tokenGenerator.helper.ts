import * as jwt from "jsonwebtoken";
import { InternalServerError } from "../errors/internalServer.error";
import { AppConfig } from "../configs/app.config";
import { User } from "../entities/user.entity";
import { TokenProviderResponse } from "../interfaces/tokenProviderResponse.interface";

export const tokenGenerator = async (
  user: User
): Promise<TokenProviderResponse> => {
  try {
    const accessToken = jwt.sign(
      {
        id: user.id,
        type: "access",
        payload: "",
      },
      AppConfig.jwtSecret,
      {
        expiresIn: "1h", // Set expiration to 1 hour
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        type: "refresh",
        payload: "",
      },
      AppConfig.jwtSecret,
      {
        expiresIn: "3d", // Set expiration to 3 days
      }
    );

    return {
      success: true,
      message: "Token generated successfully",
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  } catch (error) {
    throw new InternalServerError(
      "token-generation-failed",
      "Token generation failed",
      3000
    );
  }
};

export const getAccessTokenIat = async (
  accessToken: string
): Promise<number | null> => {
  try {
    // Decode the token to extract 'iat'
    const decodedAccessToken = jwt.decode(accessToken) as jwt.JwtPayload;

    // Return the 'iat' value if it exists
    return decodedAccessToken.iat ? decodedAccessToken.iat : null;
  } catch (error) {
    throw new InternalServerError(
      "token-iat-extraction-failed",
      "Failed to extract 'iat' from token",
      3001
    );
  }
};
