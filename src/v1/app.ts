import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import SwaggerUI from "swagger-ui-express";

import { AuthRoutes, HomeRoutes, NewsRoutes, ProgramRoutes, StoryRoutes } from "./routes";
import { InitiateRwwsDataSourcePluginConnection } from "./plugins/datasource.plugin";
import { HttpLogger } from "./loggers/httpLogger";
import { AppConfig } from "./configs/app.config";
import { ErrorLogger } from "./middlewares/errorLogger.middleware";
import { ErrorHandler } from "./middlewares/errorHandler.middleware";
import { InvalidPath } from "./middlewares/invalidPath.middleware";
import { docs } from "./docs";
import path from "path";

/**
 * * initiate express and express community middleware
 */
const { baseRoute, environment } = AppConfig;
const app = express();
app.use(HttpLogger);
app.use(express.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));
app.use(cors());

/* serve static assets */
app.use(express.static(path.join(__dirname, "../../../public")));

/**
 * * Initialize database connection
 */
InitiateRwwsDataSourcePluginConnection();

/**
 * * A basic health check route above all the routes for checking if the application is running
 */
app.get(`${baseRoute}/health`, (req, res) => {
    res.status(200).json({
        message: "Basic Health Check.",
        environment: process.env.NODE_ENV,
    });
});

/**
 * * Route injection to the app module
 */
app.use(`${baseRoute}/auth`, AuthRoutes);
app.use(`${baseRoute}/news`, NewsRoutes);
app.use(`${baseRoute}/story`, StoryRoutes);
app.use(`${baseRoute}/program`, ProgramRoutes);
app.use(`${baseRoute}/home`, HomeRoutes);

/**
 * * Route injection for swagger documentation
 */
app.use("/v1/docs", SwaggerUI.serve, SwaggerUI.setup(docs));

/**
 * * Error logger middleware
 * * Error handler middleware
 * * Invalid Path middleware
 */
app.use(InvalidPath);
app.use(ErrorHandler);
app.use(ErrorLogger);

export const App = app;
