import { HomeAsset } from "../entities/homeAsset.entity";
import { HomeContent } from "../entities/homeContent.entity";

export class HomeContentDTO {
    id: bigint;
    hero_headline: string;
    hero_image: string | null;
    hero_video: string | null;
    cta_text: string | null;
    cta_link: string | null;
    mission: string;
    vision: string;
    images: string[];
    videos: string[];
    created_at: Date;
    updated_at: Date;

    constructor(homeContent: HomeContent, homeAssets: HomeAsset[]) {
        this.id = homeContent.id;
        this.hero_headline = homeContent.hero_headline;
        this.hero_image = homeContent.hero_image;
        this.hero_video = homeContent.hero_video;
        this.cta_text = homeContent.cta_text;
        this.cta_link = homeContent.cta_link;
        this.mission = homeContent.mission;
        this.vision = homeContent.vision;
        this.created_at = homeContent.created_at;
        this.updated_at = homeContent.updated_at;

        this.images = homeAssets.filter(asset => asset.type === "image").map(asset => asset.url);

        this.videos = homeAssets.filter(asset => asset.type === "video").map(asset => asset.url);
    }
}
