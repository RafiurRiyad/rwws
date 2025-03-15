import { UserDAO } from "../dao/user.dao";
import { News } from "../entities/news.entity";
import { CategoryType } from "../enums/categoryType.enum";
import { BadRequestError } from "../errors/badRequest.error";
import { CategoryRepository } from "../repositories/category.repository";

export const generateNewsEntityObject = async (requestBodyObj: any): Promise<News> => {
    const category = await CategoryRepository.findOneBy({
        id: requestBodyObj.category_id,
        type: CategoryType.NEWS,
    });
    if (!category) {
        throw new BadRequestError(
            "generateNewsEntityObject-for-create-news",
            "News category not found",
            3015
        );
    }

    const news = new News();
    news.title = requestBodyObj.title;
    news.excerpt = requestBodyObj.excerpt;
    news.image = requestBodyObj.image;
    news.video = requestBodyObj.video;
    news.createdBy = requestBodyObj.current_user;
    news.category = category;

    return news;
};

export const generateUpdatedNewsEntityObject = async (
    updatedRequestBody: any,
    news: News
): Promise<News> => {
    const category = await CategoryRepository.findOneBy({
        id: updatedRequestBody.category_id,
        type: CategoryType.NEWS,
    });
    if (!category) {
        throw new BadRequestError(
            "generateNewsEntityObject-for-create-news",
            "News category not found",
            3015
        );
    }

    news.title = updatedRequestBody.title;
    news.excerpt = updatedRequestBody.excerpt;
    news.image = updatedRequestBody.image;
    news.video = updatedRequestBody.video;
    news.category = category;

    return news;
};
