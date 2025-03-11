import Joi from "joi";
import { Role } from "../enums/role.enum";

export const SignInRequestBody = Joi.object({
  email: Joi.string().email().max(200).required(),
  password: Joi.string().min(8).max(200).required(),
});

export const SignUpRequestBody = Joi.object({
  email: Joi.string().email().max(200).required(),
  user_type: Joi.string()
    .valid(Role.ADMIN, Role.SUB_ADMIN, Role.MODERATOR)
    .required(),
});
