import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  uploadUserAvatar,
} from '../controllers/authController.js';
import { protect, project } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);
router.post('/upload-avatar', protect, uploadAvatar.single('avatar'), uploadUserAvatar);

export default router;