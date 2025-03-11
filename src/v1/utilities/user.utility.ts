import { TokenProviderResponse } from "../interfaces/tokenProviderResponse.interface";

export const sanitizeLoginTokenResponse = (
  tokenResponse: TokenProviderResponse
) => {
  return {
    access: tokenResponse.data.access_token,
    refresh: tokenResponse.data.refresh_token,
  };
};
