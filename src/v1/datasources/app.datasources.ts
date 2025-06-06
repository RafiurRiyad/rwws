import { RwwsDBConfig } from "./../configs/db.config";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { News } from "../entities/news.entity";
import { Category } from "../entities/category.entity";
import { Story } from "../entities/story.entity";
import { Program } from "../entities/program.entity";
import { ProgramLocation } from "../entities/programLocation.entity";
import { ProgramGoal } from "../entities/programGoal.entity";
import { ProgramAchievement } from "../entities/programAchievement.entity";
import { HomeContent } from "../entities/homeContent.entity";
import { HomeAsset } from "../entities/homeAsset.entity";

export const RwwsDataSource = new DataSource({
  type: "mysql",
  host: RwwsDBConfig.host,
  port: RwwsDBConfig.port,
  driver: require("mysql2"),
  username: RwwsDBConfig.username,
  password: RwwsDBConfig.password,
  database: RwwsDBConfig.database,
  synchronize: RwwsDBConfig.synchronize,
  logging: RwwsDBConfig.logging,
  entities: [
    User,
    News,
    Category,
    Story,
    Program,
    ProgramLocation,
    ProgramGoal,
    ProgramAchievement,
    HomeContent,
    HomeAsset,
  ],
});
