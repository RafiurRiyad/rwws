import Joi from "joi";

export const CreateHomeContentRequestBody = Joi.object({
    hero_headline: Joi.string().max(255).required(),
    hero_video: Joi.string().uri().optional(),
    mission: Joi.string().required().messages({
        "string.base": "Mission must be a string.",
        "any.required": "Mission is required.",
    }),
    video_urls: Joi.array()
        .items(
            Joi.string().uri().messages({
                "string.uri": "Each video URL must be a valid URL.",
            })
        )
        .required()
        .messages({
            "array.base": "video_urls must be an array of valid URLs.",
        }),
    vision: Joi.string().required().messages({
        "string.base": "Vision must be a string.",
        "any.required": "Vision is required.",
    }),
    cta_text: Joi.string().max(100).optional().allow("").messages({
        "string.base": "CTA text must be a string.",
        "string.max": "CTA text cannot exceed 100 characters.",
    }),
    cta_link: Joi.string().optional().allow(""),
});
