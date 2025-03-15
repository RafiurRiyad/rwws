import { Story } from "../entities/story.entity";

export class StoryDTO {
    id: bigint;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    video: string;
    created_by: string;
    category_id: bigint;
    category_name: string;
    location: string;
    created_at: Date;
    updated_at: Date;

    constructor(story: Story) {
        this.id = story.id;
        this.category_id = story.category.id;
        this.category_name = story.category.name;
        this.title = story.title;
        this.excerpt = story.excerpt;
        this.content = story.content;
        this.image = story.image;
        this.video = story.video;
        this.location = story.location;
        this.created_by = story.createdBy ? story.createdBy.username : "";
        this.created_at = story.created_at;
        this.updated_at = story.updated_at;
    }
}
