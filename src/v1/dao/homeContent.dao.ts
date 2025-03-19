import { Repository } from "typeorm";
import { HomeContent } from "../entities/homeContent.entity";
import { HomeContentRepository } from "../repositories/homeContent.repository";

export class HomeContentDAO {
    private homeRepo: Repository<HomeContent>;
    constructor() {
        this.homeRepo = HomeContentRepository;
    }

    async findOneById(id: string): Promise<HomeContent | null> {
        return await this.homeRepo
            .createQueryBuilder("home")
            .leftJoinAndSelect("home.assets", "assets")
            .where("home.id = :id", { id })
            .getOne();
    }

    async save(homeContent: HomeContent): Promise<HomeContent> {
        return await this.homeRepo.save(homeContent);
    }
}
