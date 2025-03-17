import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Program } from "./program.entity";

@Entity()
export class ProgramLocation {
    @PrimaryGeneratedColumn()
    id!: bigint;

    @ManyToOne(() => Program, program => program.locations, { nullable: false })
    @JoinColumn({ name: "program_id" })
    program!: Program;

    @Column({ type: "text" })
    location!: string;
}
