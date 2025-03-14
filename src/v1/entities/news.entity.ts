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
import { User } from "./user.entity";
import { Category } from "./category.entity";

@Entity()
export class News {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "text" })
    title!: string;

    @Column({ type: "text" })
    excerpt!: string;

    @Column({ type: "varchar", length: 500, nullable: true })
    image!: string;

    @ManyToOne(() => Category, { nullable: true })
    @JoinColumn({ name: "category_id" })
    category!: Category;

    @Column({ type: "bigint", nullable: false })
    created_by!: bigint;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;
}
