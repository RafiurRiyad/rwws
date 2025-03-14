import { Repository } from "typeorm";
import { News } from "../entities/news.entity";
import { NewsRepository } from "../repositories/news.repository";

export class NewsDAO {
    private newsRepo: Repository<News>;
    constructor() {
        this.newsRepo = NewsRepository;
    }

    async findOneById(id: string): Promise<News | null> {
        return await this.newsRepo
            .createQueryBuilder("news")
            .leftJoinAndSelect("news.category", "category")
            .leftJoinAndSelect("news.createdBy", "createdBy")
            .where("news.id = :id", { id })
            .getOne();
    }

    async save(news: News): Promise<News> {
        return await this.newsRepo.save(news);
    }
}
