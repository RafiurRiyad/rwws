import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "../enums/role.enum";
import { PasswordUtility } from "./../utilities/password.utility";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id!: bigint;

  @Column({ type: "uuid", unique: true })
  @Index()
  uuid!: string;

  @Column({ type: "varchar", length: 200, unique: true })
  @Index()
  email!: string;

  @Column({ type: "varchar", nullable: true })
  password!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  first_name!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  last_name!: string;

  @Column({ type: "enum", enum: Role })
  role!: Role;

  @Column({ type: "varchar", array: true, nullable: true })
  accesses!: string[];

  @Column({ type: "boolean", nullable: true })
  is_active!: boolean;

  @Column({ type: "boolean", nullable: true })
  is_verified!: boolean;

  @Column({ type: "timestamp", nullable: true })
  first_logged_in!: Date;

  @Column({ type: "timestamp", nullable: true })
  last_logged_in!: Date;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at!: Date;

  async hashPassword(password: string): Promise<string> {
    return PasswordUtility.hashPassword(password);
  }

  async validatePassword(password: string): Promise<boolean> {
    return PasswordUtility.comparePasswords(password, this.password);
  }
}
