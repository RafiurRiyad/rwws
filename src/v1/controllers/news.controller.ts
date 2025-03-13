import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/badRequest.error";
import { Success } from "../responses/http.response";
import { createNewUser } from "../utilities/user.utility";
import { NewsDAO } from "../dao/news.dao";
import { News } from "../entities/news.entity";
import { generateNewsEntityObject } from "../utilities/news.utility";
import path from "path";
import { NotFoundError } from "../errors/notFound.error";
import { NewsRepository } from "../repositories/news.repository";
import { NewsSearchParam } from "../interfaces/newsSearchParam.interface";
import { Logger } from "../loggers/logger";

const newsDao = new NewsDAO();

const createOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createRequest: News = res.locals.reqBody;
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
        return Success(res, {
            message: "Successfully created news",
            data: createdNews,
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
        const { page, pageSize }: NewsSearchParam = req.query;
        Logger.debug("query-param %s", req.query);

        if (!page || !pageSize || (pageSize && pageSize > 100)) {
            throw new NotFoundError(
                "news-search-pageSize-more-than-100",
                "news search page or page size not given or page size is more than 100",
                3087
            );
        }

        const queryBuilder = NewsRepository.createQueryBuilder("news");
        const totalCount = await queryBuilder.getCount();

        const pageNumber = page || 1;
        const itemsPerPage = pageSize || 10;
        const skip = (pageNumber - 1) * itemsPerPage;
        queryBuilder.skip(skip).take(pageSize);

        const newsData: News[] = await queryBuilder.getMany();

        return Success(res, {
            message: "News fetched",
            data: {
                newsData,
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

        return Success(res, {
            message: "News detail fetched",
            data: fetchedNews,
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

        const removedNews = await NewsRepository.remove(fetchedNews);

        return Success(res, {
            message: "News deleted",
            data: removedNews,
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
    getOne,
    deleteOne,
};
