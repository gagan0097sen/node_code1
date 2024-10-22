const schema = await Joi.object({
    name: Joi.string().required().messages({
      "string.empty": `name is a required field.`,
      "string.name": `please enter name.`,
    }),
    email: Joi.string().email().required().messages({
      "string.empty": `email is a required field.`,
      "string.email": `please enter valid email.`,
    }),
    password: Joi.string().min(6).max(16).required().messages({
      "string.empty": `Password is a required field.`,
      "string.min": `Password must be at least 6 characters long.`,
      "string.max": `Password must be at least 16 characters short.`,
    }),
    // new_password: joi.string().required(),
    confirm_password: joi
    .string()
    .valid(joi.ref("new_password"))
    .required()
    .messages({
      "any.only": "Confirm new passwords do not match with new password",
      "any.required": "Confirm password is required",
    }),
    // image: joi
    // .object()
    // .custom(validateImageExtension)
    // .messages(error_image_message),
    image: joi.object().custom(validateImageExtension).messages({
        "any.required": "Profile image is required",
        "any.invalid":
          "Invalid file format. Only JPG, JPEG, PNG files are allowed.",
        "object.base": "Only 1 image allowed",
      }),
  })
  .options({ abortEarly: false });
//   .options({ abortEarly: false, stripUnknown: true });

  
//   const validation = schema.validate({
//     name:name,
//     email: email,
//     password: password,
//   });
//   console.log("validation", validation);

//   if (validation.error) {
//     return res.status(422).send({
//       status: 422,
//       message: validation.error.details,
//     });
//   }
