import express from 'express';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { q, type, status, priority } = req.query;
    
    const searchRegex = new RegExp(q, 'i');
    const results = {};

    // Search tasks
    if (!type || type === 'all' || type === 'tasks') {
      const taskQuery = {
        $or: [
          { title: searchRegex },
          { description: searchRegex },
        ],
      };
      
      if (status) taskQuery.status = status;
      if (priority) taskQuery.priority = priority;

      results.tasks = await Task.find(taskQuery)
        .limit(10)
        .populate('assignees', 'name avatar')
        .populate('project', 'name');
    }

    // Search projects
    if (!type || type === 'all' || type === 'projects') {
      results.projects = await Project.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
        ],
      })
        .limit(10)
        .populate('owner', 'name avatar');
    }

    // Search users
    if (!type || type === 'all' || type === 'users') {
      results.users = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
        ],
      })
        .select('name email avatar')
        .limit(10);
    }

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;