import { Repository } from "typeorm";
import { Story } from "../entities/story.entity";
import { StoryRepository } from "../repositories/story.repository";

export class StoryDAO {
    private storyRepo: Repository<Story>;
    constructor() {
        this.storyRepo = StoryRepository;
    }

    async findOneById(id: string): Promise<Story | null> {
        return await this.storyRepo
            .createQueryBuilder("story")
            .leftJoinAndSelect("story.category", "category")
            .leftJoinAndSelect("story.createdBy", "createdBy")
            .where("story.id = :id", { id })
            .getOne();
    }

    async save(story: Story): Promise<Story> {
        return await this.storyRepo.save(story);
    }
}
