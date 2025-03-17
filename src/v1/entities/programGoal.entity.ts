import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Program } from "./program.entity";

@Entity()
export class ProgramGoal {
    @PrimaryGeneratedColumn()
    id!: bigint;

    @ManyToOne(() => Program, program => program.goals, { nullable: false })
    @JoinColumn({ name: "program_id" })
    program!: Program;

    @Column({ type: "text" })
    goal!: string;
}
