const Joi = require("joi");

// Schema validation for campgrounds
module.exports.campgroundSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required().min(0),
  // image: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().required(),
}).required();

// Schema validation for review
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
