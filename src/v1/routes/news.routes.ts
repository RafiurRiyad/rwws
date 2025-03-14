import { Router } from "express";
import { newsController } from "../controllers/news.controller";
import { Upload } from "../plugins/upload.plugin";
import { ValidateCreateNewsRequestBody as ValidateNewsRequestBody } from "../middlewares/validateNewsRequestBody.middleware";

const newsRouter = Router();

newsRouter.get("/", [], newsController.getAll);
newsRouter.post("/", [Upload.single("image"), ValidateNewsRequestBody], newsController.createOne);
newsRouter.put(
    "/:newsId",
    [Upload.single("image"), ValidateNewsRequestBody],
    newsController.updateOne
);

newsRouter.get("/:newsId", [], newsController.getOne);
newsRouter.delete("/:newsId", [], newsController.deleteOne);

export const NewsRouter = newsRouter;
