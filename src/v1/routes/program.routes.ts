import { Router } from "express";
import { Upload } from "../plugins/upload.plugin";
import { VerifyJwtToken } from "../middlewares/verifyJwtToken.middleware";
import { programController } from "../controllers/program.controller";
import { ValidateCreateProgramRequestBody as ValidateProgramRequestBody } from "../middlewares/validateProgramRequestBody.middleware copy";

const programRouter = Router();

programRouter.get("/", programController.getAll);
programRouter.get("/:homeId", programController.getOne);

programRouter.post(
    "/",
    [VerifyJwtToken, Upload.single("image"), ValidateProgramRequestBody],
    programController.createOne
);
programRouter.put(
    "/:homeId",
    [VerifyJwtToken, Upload.single("image"), ValidateProgramRequestBody],
    programController.updateOne
);

programRouter.delete("/:homeId", VerifyJwtToken, programController.deleteOne);

export const ProgramRouter = programRouter;
