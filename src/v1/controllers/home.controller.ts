import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/badRequest.error";
import { Success } from "../responses/http.response";
import path from "path";
import { NotFoundError } from "../errors/notFound.error";
import {
    generateHomeContentEntityObject,
    generateHomeContentEntityUpdateObject,
    unlinkImageAsset,
} from "../utilities/homeContent.utility";
import { HomeContentDAO } from "../dao/homeContent.dao";
import { HomeContentDTO } from "../dto/homeContent.dto";
import { HomeContentRepository } from "../repositories/homeContent.repository";
import { HomeContent } from "../entities/homeContent.entity";
import { HomeAssetRepository } from "../repositories/homeAsset.repository";
import { HomeContentSearchParam } from "../interfaces/homeContentSearchParam.interface";
import { HomeAsset } from "../entities/homeAsset.entity";

const homeContentDao = new HomeContentDAO();

const createOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createRequest = res.locals.reqBody;

        if (req.files && !(req.files as any)["hero_image"]) {
            throw new BadRequestError(
                "image-not-present",
                "Please provide required hero image",
                3013
            );
        }

        const heroBannerImage = (req.files as any)["hero_image"][0];

        createRequest.hero_image = path.join("/uploads/", heroBannerImage.filename);

        if (req.files && (req.files as any)["images"]) {
            const assetImages = (req.files as any)["images"];
            createRequest.images = assetImages.map((img: any) =>
                path.join("/uploads/", img.filename)
            );
        }

        const homeContentEntityObj = await generateHomeContentEntityObject(createRequest);
        const createdContent = await homeContentDao.save(homeContentEntityObj);

        const contentDTO = new HomeContentDTO(createdContent, createdContent.assets);

        return Success(res, {
            message: "Successfully created home content",
            data: contentDTO,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "createOne-home-content-base-error";
        error.message = error.message ? error.message : "createOne-home-content-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

const getHome = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, pageSize }: HomeContentSearchParam = req.query;
        if (!page || !pageSize || (pageSize && pageSize > 100)) {
            throw new NotFoundError(
                "home-content-search-pageSize-more-than-100",
                "Home content search page or page size not given or page size is more than 100",
                3087
            );
        }

        const queryBuilder = HomeContentRepository.createQueryBuilder("home").innerJoinAndSelect(
            "home.assets",
            "assets"
        );

        queryBuilder.orderBy("home.updated_at", "DESC");

        const pageNumber = page || 1;
        const itemsPerPage = pageSize || 10;
        const skip = (pageNumber - 1) * itemsPerPage;

        const totalCount = await queryBuilder.getCount();
        queryBuilder.skip(skip).take(pageSize);

        const homeContentData: HomeContent[] = await queryBuilder.getMany();
        const homeContentList = homeContentData.map(home => new HomeContentDTO(home, home.assets));
        return Success(res, {
            message: "Home Contents fetched",
            data: {
                content: homeContentList,
                total_count: totalCount,
            },
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "getAll-home-content-base-error";
        error.message = error.message ? error.message : "getAll-home-content-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { homeContentId: homeId } = req.params;
        const fetchedHomeContent = await homeContentDao.findOneById(homeId);

        if (!fetchedHomeContent) {
            throw new NotFoundError(
                "getOne-no-home-content-with-provided-id",
                "No home content found or the home content id is invalid",
                3015
            );
        }
        const homeContentDTO = new HomeContentDTO(fetchedHomeContent, fetchedHomeContent.assets);
        return Success(res, {
            message: "Home content details fetched",
            data: homeContentDTO,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "getAll-home-content-base-error";
        error.message = error.message ? error.message : "getAll-home-content-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

export const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { homeContentId } = req.params;
        const updateRequest = res.locals.reqBody;

        const homeContent = await homeContentDao.findOneById(homeContentId);

        if (!homeContent) {
            throw new NotFoundError(
                "home-content-not-found",
                "No Home Content exists to update.",
                404
            );
        }

        if (req.files && (req.files as any)["hero_image"]) {
            const heroImageFile = (req.files as any)["hero_image"][0];

            unlinkImageAsset(homeContent.hero_image);
            updateRequest.hero_image = path.join("/uploads/", heroImageFile.filename);
        } else {
            updateRequest.hero_image = homeContent.hero_image;
        }

        const newHomeAssets: HomeAsset[] = [];

        if (req.files && (req.files as any)["images"]) {
            const oldImagesPath = (homeContent.assets || [])
                .filter(asset => asset && asset.type === "image" && asset.url)
                .map(asset => asset.url);

            oldImagesPath.forEach(unlinkImageAsset);
            await HomeAssetRepository.delete({ home: homeContent, type: "image" });

            const newImages = (req.files as any)["images"];
            newImages.forEach((img: any) => {
                const imageHomeAsset = HomeAssetRepository.create({
                    home: homeContent,
                    url: path.join("/uploads/", img.filename),
                    type: "image",
                });

                newHomeAssets.push(imageHomeAsset);
            });
        } else {
            newHomeAssets.push(...homeContent.assets.filter(asset => asset.type === "image"));
        }

        if (updateRequest.video_urls) {
            await HomeAssetRepository.delete({ home: homeContent, type: "video" });

            if (updateRequest.video_urls.length > 0) {
                updateRequest.video_urls.forEach((video: string) => {
                    const newVideoEntities = HomeAssetRepository.create({
                        home: homeContent,
                        url: video,
                        type: "video",
                    });

                    newHomeAssets.push(newVideoEntities);
                });
            }
        } else {
            newHomeAssets.push(...homeContent.assets.filter(asset => asset.type === "video"));
        }

        updateRequest.newHomeAssets = newHomeAssets;

        const updatedHomeContentObject = generateHomeContentEntityUpdateObject(
            updateRequest,
            homeContent
        );

        const updatedHomeContent = await homeContentDao.save(updatedHomeContentObject);

        const contentDTO = new HomeContentDTO(updatedHomeContent!, updatedHomeContent!.assets);
        return Success(res, {
            message: "Successfully updated home content",
            data: contentDTO,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "update-home-content-base-error";
        error.message = error.message ? error.message : "update-home-content-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { homeContentId: homeId } = req.params;
        const fetchedHomeContent = await homeContentDao.findOneById(homeId);

        if (!fetchedHomeContent) {
            throw new NotFoundError(
                "deleteOne-no-home-content-with-provided-id",
                "No home content found or the home content id is invalid",
                3016
            );
        }

        if (fetchedHomeContent.assets && fetchedHomeContent.assets.length > 0) {
            await HomeAssetRepository.remove(fetchedHomeContent.assets);
        }

        await HomeContentRepository.remove(fetchedHomeContent);

        return Success(res, {
            message: "Home content removed successfully",
            data: null,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "deleteOne-home-content-base-error";
        error.message = error.message ? error.message : "deleteOne-home-content-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

export const homeController = {
    createOne,
    getHome,
    getOne,
    updateOne,
    deleteOne,
};
