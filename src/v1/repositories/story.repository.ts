import { RwwsDataSource } from "../datasources/app.datasources";
import { Story } from "../entities/story.entity";

export const StoryRepository = RwwsDataSource.getRepository(Story);
