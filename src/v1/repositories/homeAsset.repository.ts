import { RwwsDataSource } from "../datasources/app.datasources";
import { HomeAsset } from "../entities/homeAsset.entity";

export const HomeAssetRepository = RwwsDataSource.getRepository(HomeAsset);
