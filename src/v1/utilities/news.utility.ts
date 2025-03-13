import { UserDAO } from "../dao/user.dao";
import { News } from "../entities/news.entity";
import { BadRequestError } from "../errors/badRequest.error";

const userDAO = new UserDAO();

export const generateNewsEntityObject = async (requestBodyObj: News): Promise<News> => {
    const user = await userDAO.findOneByEmail("test@example.com");
    if (!user) {
        throw new BadRequestError(
            "generateNewsEntityObject-for-create-news",
            "User not found",
            3014
        );
    }
    const news = new News();
    news.title = requestBodyObj.title;
    news.excerpt = requestBodyObj.excerpt;
    news.image = requestBodyObj.image;
    news.created_by = user.id;

    return news;
};
