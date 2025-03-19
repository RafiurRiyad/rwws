import { environment } from "../environments/index";

const {
  NODE_ENV,
  API_VERSION,
  API_PORT,
  API_HOST,
  API_PROTOCOL,
  ROUTE_PREFIX,
  JWT_SECRET,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_FROM,
  FILE_SIZE,
} = environment;

export const AppConfig = {
  environment: NODE_ENV,
  version: API_VERSION,
  port: API_PORT,
  host: API_HOST,
  protocol: API_PROTOCOL,
  baseRoute: `${ROUTE_PREFIX}/${API_VERSION}`,
  jwtSecret: JWT_SECRET,
  emailHost: EMAIL_HOST,
  emailPort: EMAIL_PORT,
  emailSecure: EMAIL_SECURE,
  emailUser: EMAIL_USER,
  emailPassword: EMAIL_PASSWORD,
  emailFrom: EMAIL_FROM,
  fileSize: FILE_SIZE,
};
