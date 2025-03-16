import { RwwsDBConfig } from "./../configs/db.config";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { News } from "../entities/news.entity";
import { Category } from "../entities/category.entity";
import { Story } from "../entities/story.entity";

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
    entities: [User, News, Category, Story],
    // ssl: {
    //   rejectUnauthorized: false, // Set to true if you have a trusted certificate
    // },
});
