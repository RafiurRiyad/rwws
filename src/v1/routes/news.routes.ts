import { Router } from "express";
import { newsController } from "../controllers/news.controller";
import { Upload } from "../plugins/upload.plugin";
import { ValidateCreateNewsRequestBody as ValidateNewsRequestBody } from "../middlewares/validateNewsRequestBody.middleware";
import { VerifyJwtToken } from "../middlewares/verifyJwtToken.middleware";

const newsRouter = Router();

newsRouter.get("/", VerifyJwtToken, newsController.getAll);
newsRouter.post(
    "/",
    [VerifyJwtToken, Upload.single("image"), ValidateNewsRequestBody],
    newsController.createOne
);
newsRouter.put(
    "/:newsId",
    [VerifyJwtToken, Upload.single("image"), ValidateNewsRequestBody],
    newsController.updateOne
);

newsRouter.get("/:newsId", VerifyJwtToken, newsController.getOne);
newsRouter.delete("/:newsId", VerifyJwtToken, newsController.deleteOne);

export const NewsRouter = newsRouter;
