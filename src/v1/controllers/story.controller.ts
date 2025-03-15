import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/badRequest.error";
import { Success } from "../responses/http.response";
import path from "path";
import { NotFoundError } from "../errors/notFound.error";
import { Logger } from "../loggers/logger";
import { StoryDAO } from "../dao/story.dao";
import {
    generateStoryEntityObject,
    generateUpdatedStoryEntityObject,
} from "../utilities/story.utility";
import { StoryDTO } from "../dto/story.dto";
import { StorySearchParam } from "../interfaces/storySearchParam.interface";
import { Story } from "../entities/story.entity";
import { StoryRepository } from "../repositories/story.repository";

const storyDao = new StoryDAO();

const createOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createRequest = res.locals.reqBody;
        if (!req.file) {
            throw new BadRequestError(
                "image-not-present",
                "Please provide required story image",
                3013
            );
        }

        createRequest.current_user = res.locals.user;
        createRequest.image = path.join("/uploads/", req.file.filename);

        const storyEntityObj = await generateStoryEntityObject(createRequest);

        const createdStory = await storyDao.save(storyEntityObj);
        const storyDTO = new StoryDTO(createdStory);

        return Success(res, {
            message: "Successfully created impact story",
            data: storyDTO,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "createOne-story-base-error";
        error.message = error.message ? error.message : "createOne-story-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, pageSize, categoryId, location }: StorySearchParam = req.query;
        Logger.debug("query-param %s", req.query);

        if (!page || !pageSize || (pageSize && pageSize > 100)) {
            throw new NotFoundError(
                "story-search-pageSize-more-than-100",
                "story search page or page size not given or page size is more than 100",
                3087
            );
        }

        const queryBuilder = StoryRepository.createQueryBuilder("story")
            .innerJoinAndSelect("story.category", "category")
            .innerJoinAndSelect("story.createdBy", "createdBy");

        if (categoryId) {
            queryBuilder.where("category.id = :categoryId", { categoryId });
        }

        if (location) {
            queryBuilder.andWhere("story.location ILIKE  :location", { location });
        }

        queryBuilder.orderBy("story.updated_at", "DESC");

        const pageNumber = page || 1;
        const itemsPerPage = pageSize || 10;
        const skip = (pageNumber - 1) * itemsPerPage;

        const totalCount = await queryBuilder.getCount();
        queryBuilder.skip(skip).take(pageSize);

        const storyData: Story[] = await queryBuilder.getMany();
        const storyList = storyData.map(story => new StoryDTO(story));

        return Success(res, {
            message: "Stories fetched",
            data: {
                storyList,
                total_count: totalCount,
            },
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "getAll-story-base-error";
        error.message = error.message ? error.message : "getAll-story-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { storyId } = req.params;

        const fetchedStory = await storyDao.findOneById(storyId);
        if (!fetchedStory) {
            throw new NotFoundError(
                "getOne-no-story-with-provided-id",
                "No story found or the story id is invalid",
                3015
            );
        }

        const storyDTO = new StoryDTO(fetchedStory);

        return Success(res, {
            message: "Story detail fetched",
            data: storyDTO,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "getOne-story-base-error";
        error.message = error.message ? error.message : "getOne-story-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateStoryRequestBody = res.locals.reqBody;
        const { storyId } = req.params;

        const targetStory = await storyDao.findOneById(storyId);
        if (!targetStory) {
            throw new NotFoundError(
                "updateOne-no-story-with-provided-id",
                "No story found or the story id is invalid",
                3016
            );
        }

        req.file
            ? (updateStoryRequestBody.image = path.join("/uploads/", req.file.filename))
            : (updateStoryRequestBody.image = targetStory.image);

        const updatedStoryEntityObj = await generateUpdatedStoryEntityObject(
            updateStoryRequestBody,
            targetStory
        );
        const updatedStory = await storyDao.save(updatedStoryEntityObj);

        const storyDTO = new StoryDTO(updatedStory);

        return Success(res, {
            message: "Story details updated",
            data: storyDTO,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "getOne-story-base-error";
        error.message = error.message ? error.message : "getOne-story-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { storyId } = req.params;

        const fetchedStory = await storyDao.findOneById(storyId);
        if (!fetchedStory) {
            throw new NotFoundError(
                "deleteOne-no-story-with-provided-id",
                "No story found or the story id is invalid",
                3016
            );
        }

        await StoryRepository.remove(fetchedStory);

        return Success(res, {
            message: "Story removed successfully",
            data: null,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "deleteOne-story-base-error";
        error.message = error.message ? error.message : "deleteOne-story-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

export const storyController = {
    getAll,
    createOne,
    updateOne,
    getOne,
    deleteOne,
};
