import fs from "fs/promises";
import { HomeAsset } from "../entities/homeAsset.entity";
import { HomeContent } from "../entities/homeContent.entity";
import path from "path";

// const homeContentRepo = new HomeContentDAO();

export const generateHomeContentEntityObject = async (
  requestBodyObj: any
): Promise<HomeContent> => {
  const homeContent = new HomeContent();
  const uploadedAssets: HomeAsset[] = [];

  homeContent.hero_image = requestBodyObj.hero_image;
  homeContent.hero_video = requestBodyObj.hero;
  homeContent.hero_headline = requestBodyObj.hero_headline;
  homeContent.cta_text = requestBodyObj.cta_text;
  homeContent.cta_link = requestBodyObj.cta_link;
  homeContent.mission = requestBodyObj.mission;
  homeContent.vision = requestBodyObj.vision;

  if (
    Array.isArray(requestBodyObj.video_urls) &&
    requestBodyObj.video_urls.length
  ) {
    requestBodyObj.video_urls.forEach((video: string) => {
      const videoAsset = new HomeAsset();
      videoAsset.type = "video";
      videoAsset.url = video;
      videoAsset.home = homeContent;

      uploadedAssets.push(videoAsset);
    });
  }

  if (Array.isArray(requestBodyObj.images) && requestBodyObj.images.length) {
    requestBodyObj.images.forEach((image: string) => {
      const imageAsset = new HomeAsset();
      imageAsset.type = "image";
      imageAsset.url = image;
      imageAsset.home = homeContent;

      uploadedAssets.push(imageAsset);
    });
  }

  homeContent.assets = uploadedAssets;

  return homeContent;
};

export const generateHomeContentEntityUpdateObject = (
  updateRequest: any,
  homeContent: HomeContent
): HomeContent => {
  homeContent.hero_headline = updateRequest.hero_headline;
  homeContent.hero_video = updateRequest.hero_video;
  homeContent.hero_image = updateRequest.hero_image;
  homeContent.cta_text = updateRequest.cta_text;
  homeContent.cta_link = updateRequest.cta_link;
  homeContent.mission = updateRequest.mission;
  homeContent.vision = updateRequest.vision;
  homeContent.assets = updateRequest.newHomeAssets || homeContent.assets;

  return homeContent;
};

export const unlinkImageAsset = async (imageFile: string) => {
  const oldImagePath = path.join(__dirname, "../../../../public", imageFile);
  try {
    await fs.unlink(oldImagePath);
    console.log(`Deleted asset: ${oldImagePath}`);
  } catch (err) {}
};
