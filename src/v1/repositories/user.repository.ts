import { RwwsDataSource } from "../datasources/app.datasources";
import { User } from "../entities/user.entity";

export const UserRepository = RwwsDataSource.getRepository(User);
