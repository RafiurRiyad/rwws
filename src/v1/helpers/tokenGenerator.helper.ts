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
        // expiresIn: '1m'
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
        // expiresIn: '7d'
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
