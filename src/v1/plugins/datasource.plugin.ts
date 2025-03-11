import { RwwsDataSource } from "../datasources/app.datasources";
import { Logger } from "../loggers/logger";

const rwwsDataSourceInitiatedSuccessCallback = () => {
  Logger.debug(
    "rwws-data-source-init-success: %s",
    "Rwws data Source initiation success"
  );
};
const rwwsDataSourceInitiatedErrorCallback = (err: Error) => {
  Logger.error("rwws-data-source-init-error:", err);
  DestroyRwwsDataSourcePluginConnection();
  process.exit(0);
};
const rwwsDataSourceDestroyedSuccessCallback = () => {
  Logger.debug(
    "rwws-data-source-destroy-success: %s",
    "Rwws data Source destroy success"
  );
};
const rwwsDataSourceDestroyedErrorCallback = (err: Error) => {
  Logger.error("rwws-data-source-destroy-error:", err);
};

export const InitiateRwwsDataSourcePluginConnection = () => {
  if (!RwwsDataSource.isInitialized) {
    RwwsDataSource.initialize()
      .then(async () => {
        await RwwsDataSource.runMigrations();
        rwwsDataSourceInitiatedSuccessCallback();
      })
      .catch(rwwsDataSourceInitiatedErrorCallback);
  }
};
export const DestroyRwwsDataSourcePluginConnection = () => {
  if (RwwsDataSource.isInitialized) {
    Logger.debug("Destroying rwws-data-source plugin connection...");
    RwwsDataSource.destroy()
      .then(rwwsDataSourceDestroyedSuccessCallback)
      .catch(rwwsDataSourceDestroyedErrorCallback);
  }
};
