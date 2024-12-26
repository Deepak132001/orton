// server/src/routes/content.routes.js
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { generateContent, getContentSuggestions } from '../controllers/content.controller.js';

const router = express.Router();

router.use(authenticate);
router.post('/generate', generateContent);
router.get('/suggestions', getContentSuggestions);

export default router;