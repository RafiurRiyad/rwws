import { Router } from "express";
import { newsController } from "../controllers/news.controller";
import { Upload } from "../plugins/upload.plugin";
import { ValidateCreateNewsRequestBody } from "../middlewares/validateNewsRequestBody.middleware";

const newsRouter = Router();

newsRouter.get("/", [], newsController.getAll)
newsRouter.post(
    "/",
    [Upload.single("image"), ValidateCreateNewsRequestBody],
    newsController.createOne
);

newsRouter.get("/:newsId", [], newsController.getOne);
newsRouter.delete("/:newsId", [], newsController.deleteOne);

export const NewsRouter = newsRouter;
