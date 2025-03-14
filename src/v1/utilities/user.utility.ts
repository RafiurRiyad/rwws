import { TokenProviderResponse } from "../interfaces/tokenProviderResponse.interface";

export const sanitizeLoginTokenResponse = (
  tokenResponse: TokenProviderResponse
) => {
  return {
    access: tokenResponse.data.access_token,
    refresh: tokenResponse.data.refresh_token,
  };
};

/**
 * * Validate the new password asynchronously:
 * * The password must meet the following criteria:
 * * - At least 8 characters long
 * * - Contains at least one lowercase letter
 * * - Contains at least one uppercase letter
 * * - Contains at least one special character (e.g., !@#$%^&*)
 * * - Contains at least one number
 * @function isValidPassword
 * @param {string} password - Password to be validated
 * @returns {Promise<boolean>} - Promise that resolves to true if the password is valid, false otherwise
 */
export const isValidPassword = (password: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    resolve(passwordRegex.test(password));
  });
};

/**
 * * Generate a random valid password asynchronously
 * * The password will follow the rule:
 * * at least 8 characters long, one capital letter, one small letter, one special character, one number
 * @function generateRandomValidPassword
 * @returns {Promise<string>} - Randomly generated valid password
 */
export const generateRandomValidPassword = (): Promise<string> => {
  return new Promise((resolve) => {
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

    /**
     * * Ensure the password is at least 8 characters long by adding random characters
     */
    while (password.length < 8) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join(""); // shuffle to avoid predictable pattern
  });
};

// export const createNewUser = async () => {
//     const userDAO = new UserDAO();
//     const user = new User();
//     user.email = `test@example.com`;
//     user.password = await user.hashPassword(`123456`); // Hash the password
//     user.username = `asif`;
//     user.temp_pass = null;
//     user.created_at = new Date();

//     userDAO.save(user);
// };
