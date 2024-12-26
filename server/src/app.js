// server/src/app.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import instagramRoutes from './routes/instagram.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import postingRoutes from './routes/posting.routes.js';
import contentRoutes from './routes/content.routes.js';

dotenv.config();

const app = express();

// Middleware
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   credentials: true
// }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://ortonai.com'
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posting', postingRoutes);
app.use('/api/content', contentRoutes);

// Error handling
app.use(errorHandler);

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// // Database connection with retry logic
// const connectDB = async (retries = 5) => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     if (retries > 0) {
//       console.log(`MongoDB connection failed. Retrying... (${retries} attempts left)`);
//       setTimeout(() => connectDB(retries - 1), 5000);
//     } else {
//       console.error('MongoDB connection failed after all retries:', error);
//       process.exit(1);
//     }
//   }
// };

// connectDB();

// const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.NODE_ENV === 'production'
  ? process.env.MONGODB_PRODUCTION_URI
  : process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});