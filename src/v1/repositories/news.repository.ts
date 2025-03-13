import { RwwsDataSource } from "../datasources/app.datasources";
import { News } from "../entities/news.entity";

export const NewsRepository = RwwsDataSource.getRepository(News);
