import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Category } from "./category.entity";

@Entity()
export class News {
    @PrimaryGeneratedColumn()
    id!: bigint;

    @Column({ type: "text" })
    title!: string;

    @Column({ type: "text" })
    excerpt!: string;

    @Column({ type: "varchar", length: 500, nullable: true })
    image!: string;

    @Column({ type: "varchar", nullable: true })
    video!: string;

    @ManyToOne(() => Category, { nullable: true })
    @JoinColumn({ name: "category_id" })
    category!: Category;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "created_by" })
    createdBy!: User;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;
}
