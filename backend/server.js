import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
const app = express();

app.set('trust proxy', 1);


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

app.get('/', (req, res) => {
  res.send('🎮 Backend radi! Dobrodošao na GameHub API');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Konekcija sa MongoDB uspostavljena');
    app.listen(PORT, () => {
      console.log(`🚀 Server radi na portu ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Greska prilikom konekcije sa MongoDB:', err.message);
  });
