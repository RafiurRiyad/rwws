import Joi from "joi";

export const CreateStoryRequestBody = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    excerpt: Joi.string().optional().allow(""),
    video: Joi.string().optional().allow(""),
    category_id: Joi.number().positive().required(),
    location: Joi.string().required(),
});
