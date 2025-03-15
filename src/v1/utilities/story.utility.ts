import { Story } from "../entities/story.entity";
import { CategoryType } from "../enums/categoryType.enum";
import { BadRequestError } from "../errors/badRequest.error";
import { CategoryRepository } from "../repositories/category.repository";

export const generateStoryEntityObject = async (requestBodyObj: any): Promise<Story> => {
    const category = await CategoryRepository.findOneBy({
        id: requestBodyObj.category_id,
        type: CategoryType.STORY,
    });
    if (!category) {
        throw new BadRequestError(
            "generateStoryEntityObject-for-create-story",
            "Story category not found",
            3015
        );
    }

    const story = new Story();
    story.title = requestBodyObj.title;
    story.excerpt = requestBodyObj.excerpt;
    story.content = requestBodyObj.content;
    story.image = requestBodyObj.image;
    story.video = requestBodyObj.video;
    story.createdBy = requestBodyObj.current_user;
    story.category = category;
    story.location = requestBodyObj.location;

    return story;
};

export const generateUpdatedStoryEntityObject = async (
    updatedRequestBody: any,
    story: Story
): Promise<Story> => {
    const category = await CategoryRepository.findOneBy({
        id: updatedRequestBody.category_id,
        type: CategoryType.STORY,
    });
    if (!category) {
        throw new BadRequestError(
            "generateUpdatedStoryEntityObject-for-create-story",
            "Story category not found",
            3015
        );
    }

    story.title = updatedRequestBody.title;
    story.excerpt = updatedRequestBody.excerpt;
    story.content = updatedRequestBody.content;
    story.image = updatedRequestBody.image;
    story.video = updatedRequestBody.video;
    story.category = category;
    story.location = updatedRequestBody.location;

    return story;
};
