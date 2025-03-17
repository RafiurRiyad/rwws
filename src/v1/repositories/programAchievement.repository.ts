import { RwwsDataSource } from "../datasources/app.datasources";
import { ProgramAchievement } from "../entities/programAchievement.entity";

export const ProgramAchivementRepository = RwwsDataSource.getRepository(ProgramAchievement);
