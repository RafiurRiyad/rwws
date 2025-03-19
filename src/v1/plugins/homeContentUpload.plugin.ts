import { Upload } from "./upload.plugin";

export const homeContentUploadHandler = Upload.fields([
    { name: "hero_image", maxCount: 1 },
    { name: "images", maxCount: 5 },
]);
