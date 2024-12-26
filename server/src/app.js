// // server/src/app.js
// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import authRoutes from './routes/auth.routes.js';
// import instagramRoutes from './routes/instagram.routes.js';
// import userRoutes from './routes/user.routes.js';
// import { errorHandler } from './middleware/error.middleware.js';
// import postingRoutes from './routes/posting.routes.js';
// import contentRoutes from './routes/content.routes.js';

// dotenv.config();

// const app = express();

// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? 'https://ortonai.com'
//     : 'http://localhost:3000',
//   credentials: true
// }));

// app.use(express.json());

// // Health check route
// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'ok' });
// });

// // API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/instagram', instagramRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/posting', postingRoutes);
// app.use('/api/content', contentRoutes);

// // Error handling
// app.use(errorHandler);

// // Handle undefined routes
// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// // // Database connection with retry logic
// // const connectDB = async (retries = 5) => {
// //   try {
// //     await mongoose.connect(process.env.MONGODB_URI);
// //     console.log('Connected to MongoDB');
// //   } catch (error) {
// //     if (retries > 0) {
// //       console.log(`MongoDB connection failed. Retrying... (${retries} attempts left)`);
// //       setTimeout(() => connectDB(retries - 1), 5000);
// //     } else {
// //       console.error('MongoDB connection failed after all retries:', error);
// //       process.exit(1);
// //     }
// //   }
// // };

// // connectDB();

// // const PORT = process.env.PORT || 5000;
// const PORT = process.env.PORT || 5000;
// const MONGODB_URI = process.env.NODE_ENV === 'production'
//   ? process.env.MONGODB_PRODUCTION_URI
//   : process.env.MONGODB_URI;

// mongoose.connect(MONGODB_URI);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import instagramRoutes from './routes/instagram.routes.js';
import userRoutes from './routes/user.routes.js';
import postingRoutes from './routes/posting.routes.js';
import contentRoutes from './routes/content.routes.js';

import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'PORT'];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Environment variable ${key} is not set`);
    process.exit(1);
  }
});

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://ortonai.com'
    : 'http://localhost:3000',
  credentials: true,
}));

// Logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Parse incoming JSON requests
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

// Error handling middleware
app.use(errorHandler);

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// MongoDB connection with retry logic
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    if (retries > 0) {
      console.warn(`MongoDB connection failed. Retrying... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('MongoDB connection failed after all retries:', error);
      process.exit(1);
    }
  }
};

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB
connectDB();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('Shutting down server...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
