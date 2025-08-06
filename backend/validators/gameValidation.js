import Joi from 'joi';

export const gameSchema = Joi.object({
  title: Joi.string().min(2).required(),
  genre: Joi.string().required(),
  platform: Joi.string().required(),
  releaseDate: Joi.date().required(),
  description: Joi.string().allow(''),
});
