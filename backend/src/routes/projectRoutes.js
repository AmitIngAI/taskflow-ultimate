import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  toggleStar,
  toggleArchive,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:userId', protect, removeMember);
router.patch('/:id/star', protect, toggleStar);
router.patch('/:id/archive', protect, toggleArchive);

export default router;