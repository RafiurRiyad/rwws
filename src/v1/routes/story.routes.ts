import { Router } from "express";
import { Upload } from "../plugins/upload.plugin";
import { VerifyJwtToken } from "../middlewares/verifyJwtToken.middleware";
import { storyController } from "../controllers/story.controller";
import { ValidateCreateStoryRequestBody as ValidateStoryRequestBody } from "../middlewares/validateStoryRequestBody.middleware";

const storyRouter = Router();

storyRouter.get("/", storyController.getAll);
storyRouter.get("/:storyId", storyController.getOne);

storyRouter.post(
    "/",
    [VerifyJwtToken, Upload.single("image"), ValidateStoryRequestBody],
    storyController.createOne
);
storyRouter.put(
    "/:storyId",
    [VerifyJwtToken, Upload.single("image"), ValidateStoryRequestBody],
    storyController.updateOne
);

storyRouter.delete("/:storyId", VerifyJwtToken, storyController.deleteOne);

export const StoryRouter = storyRouter;
