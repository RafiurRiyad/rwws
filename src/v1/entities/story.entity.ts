import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Category } from "./category.entity";
import { User } from "./user.entity";

@Entity()
export class Story {
    @PrimaryGeneratedColumn()
    id!: bigint;

    @Column({ type: "text" })
    title!: string;

    @Column({ type: "text" })
    excerpt!: string;

    @Column({ type: "text" })
    content!: string;

    @Column({ type: "varchar", nullable: true })
    image!: string;

    @Column({ type: "varchar", nullable: true })
    video!: string;

    @ManyToOne(() => Category, { nullable: false })
    @JoinColumn({ name: "category_id" })
    category!: Category;

    @Column({ type: "varchar", length: 100 })
    location!: string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "created_by" })
    createdBy!: User;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;
}
