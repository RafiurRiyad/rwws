import { RwwsDBConfig } from "./../configs/db.config";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { News } from "../entities/news.entity";
import { Category } from "../entities/category.entity";
import { Story } from "../entities/story.entity";

export const RwwsDataSource = new DataSource({
  type: "postgres",
  host: RwwsDBConfig.host,
  port: RwwsDBConfig.port,
  username: RwwsDBConfig.username,
  password: RwwsDBConfig.password,
  database: RwwsDBConfig.database,
  synchronize: RwwsDBConfig.synchronize,
  logging: RwwsDBConfig.logging,
  entities: [User, News, Category, Story],
  //   ssl: {
  //     rejectUnauthorized: false, // Set to true if you have a trusted certificate
  //   },
});
