import express from 'express';
import { protect } from '../middleware/auth.js';
import { aiService } from '../services/aiService.js';

const router = express.Router();

// Breakdown task
router.post('/breakdown', protect, async (req, res) => {
  try {
    const { title, description } = req.body;
    const subtasks = await aiService.breakdownTask(title, description);
    res.json({ success: true, data: subtasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Estimate time
router.post('/estimate', protect, async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const estimate = await aiService.estimateTime(title, description, priority);
    res.json({ success: true, data: estimate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Generate description
router.post('/generate-description', protect, async (req, res) => {
  try {
    const { title } = req.body;
    const description = await aiService.generateDescription(title);
    res.json({ success: true, data: { description } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Suggest labels
router.post('/suggest-labels', protect, async (req, res) => {
  try {
    const { title, description } = req.body;
    const labels = await aiService.suggestLabels(title, description);
    res.json({ success: true, data: labels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;