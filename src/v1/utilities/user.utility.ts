import { TokenProviderResponse } from "../interfaces/tokenProviderResponse.interface";

export const sanitizeLoginTokenResponse = (
  tokenResponse: TokenProviderResponse
) => {
  return {
    access: tokenResponse.data.access_token,
    refresh: tokenResponse.data.refresh_token,
  };
};

export const isValidPassword = (password: string): boolean => {
  /**
   * * Validate the new password:
   * * The password must meet the following criteria:
   * * - At least 8 characters long
   * * - Contains at least one lowercase letter
   * * - Contains at least one uppercase letter
   * * - Contains at least one special character (e.g., !@#$%^&*)
   * * - Contains at least one number
   */
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Utility function to generate a random valid password
 * - At least 8 characters long
 * - Contains at least one lowercase letter
 * - Contains at least one uppercase letter
 * - Contains at least one special character
 * - Contains at least one number
 */
export const generateRandomValidPassword = (): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";

  let password = "";
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  const allChars = lowercase + uppercase + numbers + specialChars;
  while (password.length < 8) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join(""); // shuffle to avoid predictable pattern
};
