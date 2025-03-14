import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";

export class UserDAO {
  private userRepository: Repository<User>;
  constructor() {
    this.userRepository = UserRepository;
  }

  async findOneById(id: bigint): Promise<User | null> {
    return await this.userRepository.findOneBy({
      id: id,
    });
  }

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({
      email: email,
    });
  }
}
