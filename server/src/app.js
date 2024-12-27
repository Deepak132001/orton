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

// server/app.js

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
const requiredEnvVars = [
  'MONGODB_URI', 
  'JWT_SECRET',
  'FACEBOOK_APP_ID',
  'FACEBOOK_APP_SECRET',
  'PORT'
];

const missingVars = requiredEnvVars.filter(key => !process.env[key]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const allowedOrigins = [
  'https://ortonai.com',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Parse incoming JSON requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
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

// MongoDB connection with improved retry logic
const connectDB = async (retries = 5) => {
  try {
    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 60000,
      keepAlive: true,
      keepAliveInitialDelay: 300000
    };

    await mongoose.connect(process.env.MONGODB_URI, mongooseOpts);
    console.log('Connected to MongoDB');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      if (retries > 0) {
        console.log(`Attempting to reconnect... (${retries} retries left)`);
        setTimeout(() => connectDB(retries - 1), 5000);
      }
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      if (retries > 0) {
        setTimeout(() => connectDB(retries - 1), 5000);
      }
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('Failed to connect to MongoDB after all retries');
      process.exit(1);
    }
  }
};

// Start the server
const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Starting graceful shutdown...`);
  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.log('HTTP server closed');
    }
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
    
    console.log('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});