import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  updateTaskStatus,
  addTimeTracking,
  uploadTaskAttachment, // New
  deleteAttachment, // New
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { uploadAttachment } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.post('/:id/comments', protect, addComment);
router.patch('/:id/status', protect, updateTaskStatus);
router.post('/:id/time', protect, addTimeTracking);

// File upload routes
router.post(
  '/:id/attachments', 
  protect, 
  uploadAttachment.single('file'), 
  uploadTaskAttachment
);
router.delete('/:id/attachments/:attachmentId', protect, deleteAttachment);

export default router;