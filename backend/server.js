import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Test ruta za proveru rada backend servera
app.get('/test', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'not connected';
    res.status(200).json({ message: '✅ Backend radi!', db: dbStatus });
  } catch (error) {
    res.status(500).json({ message: '❌ Došlo je do greške', error: error.message });
  }
});

app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("🎮 Backend radi! Dobrodošao na GameHub API");
});

app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Konekcija sa MongoDB uspostavljena');
    app.listen(PORT, () => {
      console.log(`🚀 Server radi na portu ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Greška prilikom konekcije sa MongoDB:', err.message);
  });
