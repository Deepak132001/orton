
// // server/src/app.js
// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import helmet from 'helmet';
// import morgan from 'morgan';

// import authRoutes from './routes/auth.routes.js';
// import instagramRoutes from './routes/instagram.routes.js';
// import userRoutes from './routes/user.routes.js';
// import postingRoutes from './routes/posting.routes.js';
// import contentRoutes from './routes/content.routes.js';
// import initializeCronJobs from './services/cron.service.js';
// import notificationRoutes from './routes/notification.routes.js';

// import { errorHandler } from './middleware/error.middleware.js';

// dotenv.config();

// // Validate required environment variables
// const requiredEnvVars = [
//   'MONGODB_URI', 
//   'JWT_SECRET',
//   'FACEBOOK_APP_ID',
//   'FACEBOOK_APP_SECRET',
//   'PORT'
// ];

// const missingVars = requiredEnvVars.filter(key => !process.env[key]);
// if (missingVars.length > 0) {
//   console.error('Missing required environment variables:', missingVars.join(', '));
//   process.exit(1);
// }

// const app = express();

// // Security headers
// app.use(helmet({
//   contentSecurityPolicy: false,
//   crossOriginEmbedderPolicy: false
// }));

// // CORS configuration
// const allowedOrigins = [
//   'https://ortonai.com',
//   'http://localhost:3000',
//   'http://localhost:5173'
// ];

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true
// }));

// // Logging
// if (process.env.NODE_ENV !== 'production') {
//   app.use(morgan('dev'));
// }

// // Parse incoming JSON requests
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/instagram', instagramRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/posting', postingRoutes);
// app.use('/api/content', contentRoutes);
// app.use('/api/notifications', notificationRoutes);

// // Error handling middleware
// app.use(errorHandler);

// // Handle undefined routes
// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// // Function to drop old indexes
// const dropOldIndexes = async () => {
//   try {
//     // Ensure connection is established first
//     if (mongoose.connection.readyState !== 1) {
//       console.log('Waiting for MongoDB connection before dropping indexes...');
//       return;
//     }

//     const indexes = await mongoose.connection.collection('users').listIndexes().toArray();
//     const usernameIndex = indexes.find(index => index.key.username === 1);
    
//     if (usernameIndex) {
//       await mongoose.connection.collection('users').dropIndex('username_1');
//       console.log('Dropped username index');
//     }
//   } catch (error) {
//     console.error('Error handling indexes:', error);
//     // Don't throw error, just log it
//   }
// };

// // MongoDB connection
// const connectDB = async (retries = 5) => {
//   try {
//     const mongooseOpts = {
//       serverSelectionTimeoutMS: 30000,
//       socketTimeoutMS: 45000,
//       connectTimeoutMS: 30000,
//     };

//     console.log('Connecting to MongoDB...');
//     await mongoose.connect(process.env.MONGODB_URI, mongooseOpts);
//     console.log('Connected to MongoDB');

//     mongoose.connection.on('error', (err) => {
//       console.error('MongoDB connection error:', err);
//       if (retries > 0) {
//         console.log(`Attempting to reconnect... (${retries} retries left)`);
//         setTimeout(() => connectDB(retries - 1), 5000);
//       }
//     });

//     mongoose.connection.on('disconnected', () => {
//       console.log('MongoDB disconnected. Attempting to reconnect...');
//       if (retries > 0) {
//         setTimeout(() => connectDB(retries - 1), 5000);
//       }
//     });

//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     if (retries > 0) {
//       console.log(`Retrying connection... (${retries} attempts left)`);
//       setTimeout(() => connectDB(retries - 1), 5000);
//     } else {
//       console.error('Failed to connect to MongoDB after all retries');
//       process.exit(1);
//     }
//   }
// };

// // Start server function
// const startServer = async () => {
//   try {
//     await connectDB();

//     initializeCronJobs();
//     await dropOldIndexes();
    
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, '0.0.0.0', () => {
//       console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };

// // Health check route
// app.get('/health', (req, res) => {
//   res.status(200).json({ 
//     status: 'ok',
//     mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
//   });
// });

// // Graceful shutdown
// const gracefulShutdown = async (signal) => {
//   console.log(`${signal} received. Starting graceful shutdown...`);
//   try {
//     if (server) {
//       await new Promise((resolve) => server.close(resolve));
//       console.log('HTTP server closed');
//     }
    
//     if (mongoose.connection.readyState !== 0) {
//       await mongoose.connection.close();
//       console.log('MongoDB connection closed');
//     }
    
//     console.log('Graceful shutdown completed');
//     process.exit(0);
//   } catch (error) {
//     console.error('Error during graceful shutdown:', error);
//     process.exit(1);
//   }
// };

// // Handle shutdown signals
// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// process.on('uncaughtException', (error) => {
//   console.error('Uncaught Exception:', error);
//   gracefulShutdown('uncaughtException');
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason);
//   gracefulShutdown('unhandledRejection');
// });

// // Start the server
// startServer();

// server/src/app.js
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
import notificationRoutes from './routes/notification.routes.js';
import initializeCronJobs from './services/cron.service.js';
import { initializeNotificationJobs } from './services/notification.service.js';

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

// Declare server variable at module level
let server = null;

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const allowedOrigins = [
  'https://ortonai.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
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
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use(errorHandler);

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const manageIndexes = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log('MongoDB not connected, skipping index management');
    return;
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      
      if (collections.find(coll => coll.name === 'users')) {
        const userCollection = db.collection('users');
        
        // Get existing indexes
        const indexes = await userCollection.indexInformation();
        
        // Check if username index exists
        if (indexes['username_1']) {
          await userCollection.dropIndex('username_1');
          console.log('Successfully dropped username index');
        }
      }
    });
  } catch (error) {
    console.error('Error managing indexes:', error);
    // Continue even if index management fails
  } finally {
    await session.endSession();
  }
};

// MongoDB connection
const connectDB = async (retries = 5) => {
  try {
    const mongooseOpts = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      bufferCommands: false,
      autoIndex: false, // Disable automatic indexing
      maxPoolSize: 10,
      minPoolSize: 5,
    };

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, mongooseOpts);
    console.log('Connected to MongoDB');

    // Handle index management after ensuring connection is ready
    mongoose.connection.once('open', async () => {
      // Wait for connection to be fully established
      await new Promise(resolve => setTimeout(resolve, 2000));
      await manageIndexes();
    });

    // Connection event handlers
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

// Start server function
const startServer = async () => {
  try {
    await connectDB();
    initializeCronJobs();
    initializeNotificationJobs();
    
    const PORT = process.env.PORT || 5000;
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Starting graceful shutdown...`);
  
  try {
    // First, stop accepting new requests
    if (server && server.listening) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            console.error('Error closing HTTP server:', err);
            reject(err);
          } else {
            console.log('HTTP server closed');
            resolve();
          }
        });
      });
    }

    // Then close MongoDB connection if it's open
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close(false);
      console.log('MongoDB connection closed gracefully');
    }

    console.log('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Signal handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Start the server
startServer();