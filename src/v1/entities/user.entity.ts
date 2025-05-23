import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PasswordUtility } from "./../utilities/password.utility";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id!: bigint;

  @Column({ type: "varchar", length: 200, unique: true })
  email!: string;

  @Column({ type: "varchar", nullable: true })
  password!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  username!: string;

  @Column({ type: "varchar", nullable: true })
  temp_pass!: string | null;

  @Column({ type: "int", nullable: true })
  iat!: number | null;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  async hashPassword(password: string): Promise<string> {
    return PasswordUtility.hashPassword(password);
  }

  async validatePassword(password: string): Promise<boolean> {
    return PasswordUtility.comparePasswords(password, this.password);
  }
}
