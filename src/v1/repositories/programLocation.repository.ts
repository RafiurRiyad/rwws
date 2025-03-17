import { RwwsDataSource } from "../datasources/app.datasources";
import { ProgramLocation } from "../entities/programLocation.entity";

export const ProgramLocationRepository = RwwsDataSource.getRepository(ProgramLocation);
