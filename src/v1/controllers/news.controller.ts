import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/badRequest.error";
import { Success } from "../responses/http.response";
// import { createNewUser } from "../utilities/user.utility";
import { NewsDAO } from "../dao/news.dao";
import { News } from "../entities/news.entity";
import {
    generateNewsEntityObject,
    generateUpdatedNewsEntityObject,
} from "../utilities/news.utility";
import path from "path";
import { NotFoundError } from "../errors/notFound.error";
import { NewsRepository } from "../repositories/news.repository";
import { NewsSearchParam } from "../interfaces/newsSearchParam.interface";
import { Logger } from "../loggers/logger";
import { NewsDTO } from "../dto/news.dto";

const newsDao = new NewsDAO();

const createOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createRequest = res.locals.reqBody;
        if (!req.file) {
            throw new BadRequestError(
                "image-not-present",
                "Please provide required news image",
                3013
            );
        }

        createRequest.image = path.join("/uploads/", req.file.filename);
        const newsEntityObj = await generateNewsEntityObject(createRequest);

        const createdNews = await newsDao.save(newsEntityObj);
        const newsDTO = new NewsDTO(createdNews);

        return Success(res, {
            message: "Successfully created news",
            data: newsDTO,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "createOne-news-base-error";
        error.message = error.message ? error.message : "createOne-news-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, pageSize, categoryId, year }: NewsSearchParam = req.query;
        Logger.debug("query-param %s", req.query);

        if (!page || !pageSize || (pageSize && pageSize > 100)) {
            throw new NotFoundError(
                "news-search-pageSize-more-than-100",
                "news search page or page size not given or page size is more than 100",
                3087
            );
        }

        const queryBuilder = NewsRepository.createQueryBuilder("news").innerJoinAndSelect(
            "news.category",
            "category"
        );

        if (categoryId) {
            queryBuilder.where("category.id = :categoryId", { categoryId });
        }

        if (year) {
            queryBuilder.andWhere("EXTRACT(YEAR from news.created_at) = :year", { year });
        }

        queryBuilder.orderBy("news.updated_at", "DESC");

        const pageNumber = page || 1;
        const itemsPerPage = pageSize || 10;
        const skip = (pageNumber - 1) * itemsPerPage;

        const totalCount = await queryBuilder.getCount();
        queryBuilder.skip(skip).take(pageSize);

        const newsData: News[] = await queryBuilder.getMany();
        const newsList = newsData.map(news => new NewsDTO(news));

        return Success(res, {
            message: "News fetched",
            data: {
                newsList,
                total_count: totalCount,
            },
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "getAll-news-base-error";
        error.message = error.message ? error.message : "getAll-news-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { newsId } = req.params;

        const fetchedNews = await newsDao.findOneById(newsId);
        if (!fetchedNews) {
            throw new NotFoundError(
                "getOne-no-news-with-provided-id",
                "No news found or the news id is invalid",
                3015
            );
        }

        const newsDTO = new NewsDTO(fetchedNews);

        return Success(res, {
            message: "News detail fetched",
            data: newsDTO,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "getOne-news-base-error";
        error.message = error.message ? error.message : "getOne-news-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateNewsRequestBody = res.locals.reqBody;
        const { newsId } = req.params;

        const targetNews = await newsDao.findOneById(newsId);
        if (!targetNews) {
            throw new NotFoundError(
                "updateOne-no-news-with-provided-id",
                "No news found or the news id is invalid",
                3016
            );
        }

        req.file
            ? (updateNewsRequestBody.image = path.join("/uploads/", req.file.filename))
            : (updateNewsRequestBody.image = targetNews.image);

        const updatedNewsEntityObj = await generateUpdatedNewsEntityObject(
            updateNewsRequestBody,
            targetNews
        );
        const updatedNews = await newsDao.save(updatedNewsEntityObj);

        const newsDTO = new NewsDTO(updatedNews);

        return Success(res, {
            message: "News details updated",
            data: newsDTO,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "getOne-news-base-error";
        error.message = error.message ? error.message : "getOne-news-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { newsId } = req.params;

        const fetchedNews = await newsDao.findOneById(newsId);
        if (!fetchedNews) {
            throw new NotFoundError(
                "deleteOne-no-news-with-provided-id",
                "No news found or the news id is invalid",
                3016
            );
        }

        await NewsRepository.remove(fetchedNews);

        return Success(res, {
            message: "News removed successfully",
            data: null,
        });
    } catch (error: any) {
        error.origin = error.origin ? error.origin : "deleteOne-news-base-error";
        error.message = error.message ? error.message : "deleteOne-news-error";
        error.code = error.code ? error.code : 3012;
        next(error);
    }
};

export const newsController = {
    getAll,
    createOne,
    updateOne,
    getOne,
    deleteOne,
};
