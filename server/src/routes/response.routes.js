// Backend: Response Routes (src/routes/response.routes.js)
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { 
  saveResponse, 
  getUserResponses, 
  deleteResponse 
} from '../controllers/response.controller.js';

const router = express.Router();

router.use(authenticate);
router.post('/', saveResponse);
router.get('/', getUserResponses);
router.delete('/:id', deleteResponse);

export default router;