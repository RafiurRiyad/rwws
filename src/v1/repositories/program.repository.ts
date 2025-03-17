import { RwwsDataSource } from "../datasources/app.datasources";
import { Program } from "../entities/program.entity";

export const ProgramRepository = RwwsDataSource.getRepository(Program);
