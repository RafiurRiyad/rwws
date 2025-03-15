import { App } from "./src/v1/app";
import { AppConfig } from "./src/v1/configs/app.config";
import { Logger } from "./src/v1/loggers/logger";
import { DestroyRwwsDataSourcePluginConnection } from "./src/v1/plugins/datasource.plugin";

const { port, host, environment } = AppConfig;

/**
 * * Export the Express app directly for Vercel to handle
 */
export default App;

/**
 * * create express server with port and host imported from app.config
 * * This will only run when deployed in environments where Vercel is not handling the server (local environments).
 */
if (process.env.NODE_ENV !== "production") {
  App.listen(Number(port), host, () => {
    Logger.debug("Express is running on →");
    console.table({
      host: host,
      port: port,
      environment: environment,
    });
  });
}

/**
 * * this method is for gracefully closing the express server(node.js process)
 * @function graceFullyCloseServerAndPluginConnections(exitCode)
 * * this function will first close the http server and then close MongoDB and Redis plugin connections
 * * and then proceed with process.exit(exitCode)
 */
const graceFullyCloseServerAndPluginConnections = (exitCode: number) => {
  const server = App.listen();
  server.close(() => {
    Logger.debug("Closing the Server...");
    DestroyRwwsDataSourcePluginConnection();
    Logger.debug(`Closing the main process with exitCode: ${exitCode}`);
    process.exit(exitCode);
  });
};
/**
 * * Handle various process events for graceful shutdown
 */
[`SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((event) => {
  process.on(event, () => {
    Logger.debug("Process event type: %s", event);
    graceFullyCloseServerAndPluginConnections(0);
  });
});

process.on("uncaughtException", (error) => {
  Logger.error("uncaughtException-error:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  Logger.error("unhandledRejection-at %s, %s", promise, `reason: ${reason}`);
  process.exit(1);
});

process.on("beforeExit", (code) => {
  Logger.debug(`Process beforeExit event with code: ${code}`);
});

process.on("exit", (code) => {
  Logger.debug(`Process exit event with code: ${code}`);
});
