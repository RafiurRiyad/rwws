import { RwwsDataSource } from "../datasources/app.datasources";
import { HomeContent } from "../entities/homeContent.entity";

export const HomeContentRepository = RwwsDataSource.getRepository(HomeContent);
