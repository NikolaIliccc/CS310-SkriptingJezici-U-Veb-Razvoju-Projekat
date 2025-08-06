import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Naziv igre je obavezan'] },
    genre: { type: String, required: [true, 'Zanr igre je obavezan'] },
    platform: { type: String, required: [true, 'Platforma je obavezna'] },
    releaseDate: { type: Date, required: [true, 'Datum izlaska je obavezan'] },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

const Game = mongoose.model('Game', gameSchema);
export default Game;
