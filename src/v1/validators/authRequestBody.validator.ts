import Joi from "joi";

export const SignInRequestBody = Joi.object({
  email: Joi.string().email().max(200).required(),
  password: Joi.string().min(8).max(200).required(),
});

export const ChangePasswordRequestBody = Joi.object({
  oldPassword: Joi.string()
    .min(8)
    .max(200)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required(),

  newPassword: Joi.string()
    .min(8)
    .max(200)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required(),
});
