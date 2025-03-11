import { RwwsDBConfig } from "./../configs/db.config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";

export const RwwsDataSource = new DataSource({
  type: RwwsDBConfig.type,
  host: RwwsDBConfig.host,
  port: RwwsDBConfig.port,
  username: RwwsDBConfig.username,
  password: RwwsDBConfig.password,
  database: RwwsDBConfig.database,
  synchronize: RwwsDBConfig.synchronize,
  logging: RwwsDBConfig.logging,
  entities: [User],
  subscribers: [],
});
