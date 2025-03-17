import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Category } from "./category.entity";
import { ProgramGoal } from "./programGoal.entity";
import { ProgramLocation } from "./programLocation.entity";
import { ProgramAchievement } from "./programAchievement.entity";
import { ProgramStatus } from "../enums/programStatus.enum";

@Entity()
export class Program {
    @PrimaryGeneratedColumn()
    id!: bigint;

    @Column({ type: "varchar", length: "255" })
    title!: string;

    @Column({ type: "varchar", length: "400" })
    description!: string;

    @Column({ type: "text" })
    longDescription!: string;

    @ManyToOne(type => Category)
    @JoinColumn({ name: "category_id" })
    category!: Category;

    @OneToMany(() => ProgramGoal, goal => goal.program, { cascade: true })
    goals!: ProgramGoal[];

    @OneToMany(() => ProgramLocation, location => location.program, { cascade: true })
    locations!: ProgramLocation[];

    @OneToMany(() => ProgramAchievement, achievement => achievement.program, { cascade: true })
    achievements!: ProgramAchievement[];

    @Column({ type: "enum", enum: ProgramStatus, default: ProgramStatus.ONGOING })
    status!: ProgramStatus;

    @Column({ type: "varchar", length: 500, nullable: true })
    image!: string;

    @Column({ type: "varchar", length: 500, nullable: true })
    video!: string;

    @Column({ type: Date, nullable: true })
    start_date!: Date | null;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
