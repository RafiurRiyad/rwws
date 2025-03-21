import { Router } from "express";
import { Upload } from "../plugins/upload.plugin";
import { VerifyJwtToken } from "../middlewares/verifyJwtToken.middleware";
import { homeController } from "../controllers/home.controller";
import { ValidateHomeContentRequestBody } from "../middlewares/validateHomeContentRequestBody.middleware";
import { homeContentUploadHandler } from "../plugins/homeContentUpload.plugin";

const homeRouter = Router();

homeRouter.get("/", homeController.getHome);
homeRouter.get("/:homeContentId", homeController.getOne);
homeRouter.post(
    "/",
    [VerifyJwtToken, homeContentUploadHandler, ValidateHomeContentRequestBody],
    homeController.createOne
);

homeRouter.put(
    "/:homeContentId",
    [VerifyJwtToken, homeContentUploadHandler, ValidateHomeContentRequestBody],
    homeController.updateOne
);

homeRouter.delete("/:homeContentId", VerifyJwtToken, homeController.deleteOne);

export const HomeRouter = homeRouter;
