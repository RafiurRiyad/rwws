import * as dotenv from "dotenv";
import { DatabaseType } from "../enums/databaseType.enum";
dotenv.config();

export const parsedEnvironment = {
  // node environment variable
  NODE_ENV: process.env.NODE_ENV as string,

  //app environment variables
  API_PROTOCOL: process.env.API_PROTOCOL as string,
  API_HOST: process.env.API_HOST as string,
  API_PORT: process.env.API_PORT as string,
  API_VERSION: process.env.API_VERSION as string,
  ROUTE_PREFIX: process.env.ROUTE_PREFIX as string,

  // DB environment variables
  DB_TYPE: process.env.DB_TYPE as DatabaseType,
  DB_HOST: process.env.DB_HOST as string,
  DB_PORT: process.env.DB_PORT as string,
  DB_NAME: process.env.DB_NAME as string,
  DB_USER_NAME: process.env.DB_USER_NAME as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_SYNCHRONIZER: process.env.DB_SYNCHRONIZER as string,
  DB_LOGGING: process.env.DB_LOGGING as string,

  // Email variables
  EMAIL_HOST: process.env.EMAIL_HOST as string,
  EMAIL_PORT: process.env.EMAIL_PORT as string,
  EMAIL_SECURE: process.env.EMAIL_SECURE as string,
  EMAIL_USER: process.env.EMAIL_USER as string,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
  EMAIL_FROM: process.env.EMAIL_FROM as string,

  // Internal service environment variables
  BASE_PATH: process.env.BASE_PATH as string,

  // JWT variables
  JWT_SECRET: process.env.JWT_SECRET as string,
};
