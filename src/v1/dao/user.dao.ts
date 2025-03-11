import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { Role } from '../enums/role.enum';

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

  async findOneByUUID(uuid: string): Promise<User | null> {
    return await this.userRepository.findOneBy({
      uuid: uuid,
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

  async findOneByEmailAndRole(email: string, role: Role): Promise<User | null> {
    return await this.userRepository.findOneBy({
      email: email,
      role: role,
    });
  }
}
