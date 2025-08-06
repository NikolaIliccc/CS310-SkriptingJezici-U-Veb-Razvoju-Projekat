import Game from '../models/gameModel.js';
import { gameSchema } from '../validators/gameValidation.js';

export const getGames = async (req, res) => {
  const games = await Game.find();
  res.json(games);
};

export const getGameById = async (req, res) => {
  const game = await Game.findById(req.params.id);
  if (!game) return res.status(404).json({ message: 'Igra nije pronadjena' });
  res.json(game);
};

export const createGame = async (req, res) => {
  const { error } = gameSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const game = new Game(req.body);
  const createdGame = await game.save();
  res.status(201).json(createdGame);
};

export const updateGame = async (req, res) => {
  const { error } = gameSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const game = await Game.findById(req.params.id);
  if (!game) return res.status(404).json({ message: 'Igra nije pronadjena' });

  Object.assign(game, req.body);
  const updatedGame = await game.save();
  res.json(updatedGame);
};

export const deleteGame = async (req, res) => {
  const game = await Game.findById(req.params.id);
  if (!game) return res.status(404).json({ message: 'Igra nije pronadjena' });

  await Game.deleteOne({ _id: req.params.id });
  res.json({ message: 'Igra je obrisana' });
};
