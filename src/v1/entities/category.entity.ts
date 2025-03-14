import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CategoryType } from "../enums/categoryType.enum";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id!: bigint;

    @Column({ type: "varchar", length: 100, unique: true })
    name!: string;

    @Column({ type: "enum", enum: CategoryType })
    type!: CategoryType;

    @CreateDateColumn()
    created_at!: Date;
}
