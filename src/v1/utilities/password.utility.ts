import { compare, hash } from "bcryptjs";

export class PasswordUtility {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return hash(password, saltRounds);
  }

  static async comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return compare(plainPassword, hashedPassword);
  }
}
