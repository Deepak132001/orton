// server/src/routes/content.routes.js
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { generateContent, getContentSuggestions, generateCustomContent } from '../controllers/content.controller.js';

const router = express.Router();

router.use(authenticate);
router.post('/generate', generateContent);
router.get('/suggestions', getContentSuggestions);
router.post('/generate-custom', generateCustomContent);
// In your routes file
// router.post('/modify', modifyContent);

export default router;