import { RwwsDataSource } from "../datasources/app.datasources";
import { ProgramGoal } from "../entities/programGoal.entity";

export const ProgramGoalRepository = RwwsDataSource.getRepository(ProgramGoal);
