// server/src/routes/instagram.routes.js
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  connectInstagram,
  getProfile,
  getInsights,
  disconnectInstagram
} from '../controllers/instagram.controller.js';

const router = express.Router();

// Protected routes - require authentication
router.use(authenticate);

router.post('/connect', connectInstagram);
router.get('/profile', getProfile);
router.get('/insights', getInsights);
router.post('/disconnect', disconnectInstagram);

export default router;