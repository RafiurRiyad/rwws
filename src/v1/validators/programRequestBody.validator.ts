import Joi from "joi";
import { ProgramStatus } from "../enums/programStatus.enum";

export const CreateProgramRequestBody = Joi.object({
    title: Joi.string().max(400).required(),
    description: Joi.string().required(),
    long_description: Joi.string().required(),
    category_id: Joi.number().positive().required(),
    goals: Joi.array().items(Joi.string().min(5).max(500).required()).min(1).required().messages({
        "array.min": "At least one goal is required.",
        "any.required": "Goals are required.",
    }),

    achievements: Joi.array()
        .items(Joi.string().min(5).max(500).required())
        .min(1)
        .required()
        .messages({
            "array.min": "At least one achievement is required.",
        }),

    locations: Joi.array()
        .items(Joi.string().min(3).max(255).required())
        .min(1)
        .required()
        .messages({
            "array.min": "At least one location is required.",
        }),
    status: Joi.string()
        .valid(ProgramStatus.PROPOSED, ProgramStatus.ONGOING, ProgramStatus.COMPLETED)
        .required(),
    video: Joi.string().optional().allow(""),
    start_date: Joi.date().optional().allow(null),
});
