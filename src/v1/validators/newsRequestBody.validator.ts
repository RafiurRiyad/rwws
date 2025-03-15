import Joi from "joi";

export const CreateNewsRequestBody = Joi.object({
    title: Joi.string().required(),
    excerpt: Joi.string().optional().allow(""),
    category_id: Joi.number().positive().required(),
    video: Joi.string().optional().allow(""),
});
