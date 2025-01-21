// server/src/routes/user.routes.js
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes - require authentication
router.use(authenticate);

// Get user profile
router.get('/profile', (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      instagramBusinessId: req.user.instagramBusinessId,
    }
  });
});

export default router;