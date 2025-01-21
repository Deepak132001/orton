// // src/routes/youtube.routes.js
// import express from 'express';
// import { authenticate } from '../middleware/auth.middleware.js';
// import {
//   connectYouTube,
//   getProfile,
//   getVideoMetadata,
//   generateTranscription,
//   generateVideoScript,
//   disconnectYouTube,
//   checkTrialStatus,
//   getSubscriptionStatus,
//   getChannelInfo,
//   generateContentIdeas
// } from '../controllers/youtube.controller.js';

// const router = express.Router();

// // Apply authentication middleware to all routes
// router.use(authenticate);

// router.post('/connect', connectYouTube);
// router.get('/profile', getProfile);
// router.get('/videos/:channelId', getVideoMetadata);
// router.post('/transcribe', generateTranscription);
// router.post('/generate-script', generateVideoScript);
// router.post('/disconnect', disconnectYouTube);
// router.get('/trial-status', checkTrialStatus);
// router.get('/subscription-status', getSubscriptionStatus);
// router.get('/channel/:channelId', getChannelInfo);
// router.post('/generate-ideas', generateContentIdeas);

// export default router;

// src/routes/youtube.routes.js
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  connectYouTube,
  getProfile,
  getVideoMetadata,
  generateTranscription,
  generateVideoScript,
  disconnectYouTube,
  checkTrialStatus,
  getSubscriptionStatus,
  getChannelInfo,
  getChannelAnalytics,
  getUploadTiming,
  generateContentIdeas,
  getBestTimes
} from '../controllers/youtube.controller.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Connection routes
router.post('/connect', connectYouTube);
router.get('/profile', getProfile);
router.post('/disconnect', disconnectYouTube);

// Analytics routes
router.get('/analytics', getChannelAnalytics);
router.get('/channel/:channelId', getChannelInfo);
router.get('/best-times', getUploadTiming);

// Content routes
router.get('/videos/:channelId', getVideoMetadata);
router.post('/transcribe', generateTranscription);
router.post('/generate-script', generateVideoScript);
router.post('/generate-ideas', generateContentIdeas);

// Subscription routes
router.get('/trial-status', checkTrialStatus);
router.get('/subscription-status', getSubscriptionStatus);
router.get('/best-times', getBestTimes);

export default router;