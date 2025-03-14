/**
 * * import necessary modules for winston logger
 */
import { format, createLogger, transports, config } from "winston";
const { combine, timestamp, splat, json } = format;

/**
 * * transporter options for console transporter (no file writing)
 */
const transporterOptions = {
  console: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug", // Use "info" for production, "debug" for development
    handleExceptions: true,
    json: true,
    colorize: true,
  },
};

/**
 * * base logger using winston.createLogger
 * * logs are only written to the console (stdout)
 */
const logger = createLogger({
  levels: config.npm.levels,
  format: combine(timestamp(), splat(), json()),
  transports: [
    new transports.Console(transporterOptions.console), // Only console logging
  ],
  exitOnError: false,
});

export const Logger = logger;
