import express from 'express';
import {
  getUsers,
  getUser,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/:id', protect, getUser);
router.get('/notifications', protect, getNotifications);
router.patch('/notifications/:id/read', protect, markNotificationRead);
router.patch('/notifications/read-all', protect, markAllNotificationsRead);
router.delete('/notifications/:id', protect, deleteNotification);

export default router;