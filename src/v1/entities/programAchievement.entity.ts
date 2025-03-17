import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Program } from "./program.entity";

@Entity()
export class ProgramAchievement {
    @PrimaryGeneratedColumn()
    id!: bigint;

    @ManyToOne(() => Program, program => program.achievements, { nullable: false })
    @JoinColumn({ name: "program_id" })
    program!: Program;

    @Column({ type: "text" })
    achievement!: string;
}
