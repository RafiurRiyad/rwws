import { RwwsDataSource } from "../datasources/app.datasources";
import { Category } from "../entities/category.entity";

export const CategoryRepository = RwwsDataSource.getRepository(Category);
