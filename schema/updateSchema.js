const joi = require("joi");

const updateSchema = joi
  .object({
    title: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required().min(0),
    location: joi.string().required(),
    country: joi.string().required(),
    image: joi.object({
      url: joi.string().allow("", null),
      filename: joi.string().allow("", null),
    }),
  })
  .required();


module.exports = updateSchema;
