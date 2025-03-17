import { Program } from "../entities/program.entity";

export class ProgramDTO {
    id: bigint;
    title: string;
    description: string;
    longDescription: string;
    image: string;
    video: string;
    category_id: bigint;
    category_name: string;
    goals: string[];
    achievements: string[];
    locations: string[];
    status: string;
    start_date: Date | null;
    created_at: Date;
    updated_at: Date;

    constructor(program: Program) {
        this.id = program.id;
        this.category_id = program.category.id;
        this.category_name = program.category.name;
        this.title = program.title;
        this.description = program.description;
        this.longDescription = program.longDescription;
        this.image = program.image;
        this.video = program.video;
        this.goals = program.goals?.map(goal => goal.goal) || [];
        this.locations = program.locations?.map(location => location.location) || [];
        this.achievements = program.achievements?.map(achievement => achievement.achievement) || [];
        this.status = program.status;
        this.start_date = program.start_date;
        this.created_at = program.created_at;
        this.updated_at = program.updated_at;
    }
}
