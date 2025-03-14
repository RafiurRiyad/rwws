import { News } from "../entities/news.entity";

export class NewsDTO {
    id: string;
    title: string;
    excerpt: string;
    image: string;
    created_by: string;
    category_id: bigint;
    category_name: string;
    created_at: Date;
    updated_at: Date;

    constructor(news: News) {
        this.id = news.id;
        this.category_id = news.category.id;
        this.category_name = news.category.name;
        this.title = news.title;
        this.excerpt = news.excerpt;
        this.image = news.image;
        this.created_by = news.createdBy ? news.createdBy.username : "";
        this.created_at = news.created_at;
        this.updated_at = news.updated_at;
    }
}
