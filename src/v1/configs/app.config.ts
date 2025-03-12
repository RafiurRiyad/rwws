import { environment } from "../environments/index";

const {
  NODE_ENV,
  API_VERSION,
  API_PORT,
  API_HOST,
  API_PROTOCOL,
  ROUTE_PREFIX,
  JWT_SECRET,
} = environment;

export const AppConfig = {
  environment: NODE_ENV,
  version: API_VERSION,
  port: API_PORT,
  host: API_HOST,
  protocol: API_PROTOCOL,
  baseRoute: `${ROUTE_PREFIX}/${API_VERSION}`,
  jwtSecret: JWT_SECRET,
};
