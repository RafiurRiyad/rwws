import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { HomeContent } from "./homeContent.entity";

@Entity()
export class HomeAsset {
    @PrimaryGeneratedColumn()
    id!: string;

    @ManyToOne(() => HomeContent, home => home.assets, { nullable: false })
    @JoinColumn({ name: "home_id" })
    home!: HomeContent;

    @Column({ type: "varchar", length: 500 })
    url!: string;

    @Column({ type: "varchar", length: 20 })
    type!: "image" | "video";
}
