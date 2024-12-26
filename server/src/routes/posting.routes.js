import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getBestPostingTimes } from '../controllers/posting.controller.js';

const router = express.Router();

router.use(authenticate);
router.get('/best-times', getBestPostingTimes);

export default router;