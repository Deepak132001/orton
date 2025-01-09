// server/src/routes/notification.routes.js
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller.js';

const router = express.Router();

router.use(authenticate); // Protect all notification routes

router.get('/', getNotifications);
router.put('/:notificationId/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);

export default router;