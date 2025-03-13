import Joi from "joi";

export const CreateNewsRequestBody = Joi.object({
    title: Joi.string().required(),
    excerpt: Joi.string().optional().allow(""),
});

export const UpdateNewsRequestBody = Joi.object({
    title: Joi.string().required(),
    excerpt: Joi.string().optional().allow(""),
});
