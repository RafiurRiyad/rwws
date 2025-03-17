import { Repository } from "typeorm";
import { Program } from "../entities/program.entity";
import { ProgramRepository } from "../repositories/program.repository";

export class ProgramDAO {
    private programRepo: Repository<Program>;
    constructor() {
        this.programRepo = ProgramRepository;
    }

    async findOneById(id: string): Promise<Program | null> {
        return await this.programRepo
            .createQueryBuilder("program")
            .leftJoinAndSelect("program.category", "category")
            .leftJoinAndSelect("program.goals", "goals")
            .leftJoinAndSelect("program.achievements", "achievements")
            .leftJoinAndSelect("program.locations", "locations")
            .where("program.id = :id", { id })
            .getOne();
    }

    async save(program: Program): Promise<Program> {
        return await this.programRepo.save(program);
    }
}
