import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.send('🎮 Backend radi! Dobrodošao na GameHub API');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Konekcija sa MongoDB uspostavljena');
    app.listen(PORT, () => {
      console.log(`🚀 Server radi na portu ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Greška prilikom konekcije sa MongoDB:', err.message);
  });
