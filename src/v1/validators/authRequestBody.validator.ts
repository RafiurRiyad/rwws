import Joi from "joi";

export const SignupRequestBody = Joi.object({
  email: Joi.string().email().max(200).required(),
  username: Joi.string().max(200).required(),
});

export const SignInRequestBody = Joi.object({
  email: Joi.string().email().max(200).required(),
  password: Joi.string().min(8).max(200).required(),
});

export const ChangePasswordRequestBody = Joi.object({
  oldPassword: Joi.string().min(8).max(200).required(),

  newPassword: Joi.string().min(8).max(200).required(),
});

export const ForgotPasswordRequestBody = Joi.object({
  email: Joi.string().email().max(200).required(),
});

export const ResetPasswordRequestBody = Joi.object({
  email: Joi.string().email().max(200).required(),
  tempPass: Joi.string().min(8).max(200).required(),
});
