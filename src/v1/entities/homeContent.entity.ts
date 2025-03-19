import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { HomeAsset } from "./homeAsset.entity";

@Entity()
export class HomeContent {
    @PrimaryGeneratedColumn()
    id!: bigint;

    @Column({ type: "varchar", length: 500 })
    hero_image!: string;

    @Column({ type: "varchar", length: 500, nullable: true })
    hero_video!: string | null;

    @Column({ type: "varchar", length: 255 })
    hero_headline!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    cta_text!: string | null;

    @Column({ type: "varchar", length: 500, nullable: true })
    cta_link!: string | null;

    @Column({ type: "text" })
    mission!: string;

    @Column({ type: "text" })
    vision!: string;

    @OneToMany(() => HomeAsset, asset => asset.home, { cascade: true })
    assets!: HomeAsset[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
