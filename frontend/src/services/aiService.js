import { TASK_PRIORITY, TASK_STATUS } from '../constants/config';
import api from './api';

// Mock AI service (production mein OpenAI API use karo)
export const aiService = {
  // Smart Task Suggestions
  suggestTasks: async (projectContext) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        title: 'Set up CI/CD pipeline',
        description: 'Configure automated testing and deployment',
        priority: TASK_PRIORITY.HIGH,
        estimatedTime: '4 hours',
        reasoning: 'Based on your project setup, this will improve deployment efficiency',
      },
      {
        title: 'Implement error logging',
        description: 'Add Sentry or similar error tracking',
        priority: TASK_PRIORITY.MEDIUM,
        estimatedTime: '2 hours',
        reasoning: 'Will help identify and fix bugs faster',
      },
      {
        title: 'Add unit tests for auth module',
        description: 'Write comprehensive tests for authentication',
        priority: TASK_PRIORITY.HIGH,
        estimatedTime: '3 hours',
        reasoning: 'Critical for security and stability',
      },
    ];
  },

  // Smart Time Estimation
  estimateTaskTime: async (task) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const baseTime = Math.floor(Math.random() * 8) + 1; // 1-8 hours
    const complexity = task.description?.length > 100 ? 1.5 : 1;
    const priority = task.priority === TASK_PRIORITY.URGENT ? 1.2 : 1;
    
    return {
      estimate: Math.round(baseTime * complexity * priority),
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
      breakdown: {
        planning: '30min',
        implementation: `${baseTime}h`,
        testing: '1h',
        review: '30min',
      },
    };
  },

  // Auto-assign based on workload and skills
  suggestAssignee: async (task, teamMembers) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock logic - in production, use ML model
    const available = teamMembers.filter(m => m.status === 'online');
    if (available.length === 0) return teamMembers[0];
    
    return available[Math.floor(Math.random() * available.length)];
  },

  // Detect potential blockers
  detectBlockers: async (tasks) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        type: 'dependency',
        severity: 'high',
        message: 'Task "Backend API" is blocking 3 frontend tasks',
        affectedTasks: 3,
      },
      {
        type: 'overdue',
        severity: 'medium',
        message: '5 tasks are overdue and may impact sprint goals',
        affectedTasks: 5,
      },
      {
        type: 'workload',
        severity: 'low',
        message: 'Michael Chen has 12 active tasks (recommend redistribution)',
        affectedTasks: 12,
      },
    ];
  },

  // Smart task breakdown
  breakdownTask: async (taskTitle, taskDescription) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        title: 'Research and planning',
        description: 'Gather requirements and create technical specification',
        estimatedTime: '1-2 hours',
      },
      {
        title: 'Implementation',
        description: 'Core development work',
        estimatedTime: '4-6 hours',
      },
      {
        title: 'Testing',
        description: 'Write and run tests',
        estimatedTime: '1-2 hours',
      },
      {
        title: 'Code review and refinement',
        description: 'Peer review and address feedback',
        estimatedTime: '1 hour',
      },
    ];
  },

  // Sentiment analysis on comments
  analyzeSentiment: async (comments) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sentiments = ['positive', 'neutral', 'negative'];
    const random = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    return {
      overall: random,
      score: Math.random(),
      insights: random === 'negative' 
        ? 'Team morale seems low. Consider a team check-in.'
        : random === 'positive'
        ? 'Great team collaboration!'
        : 'Team communication is steady.',
    };
  },

  // Predict task completion
  predictCompletion: async (task, historicalData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const daysRemaining = Math.floor(Math.random() * 5) + 1;
    const probability = Math.floor(Math.random() * 30) + 70; // 70-100%
    
    return {
      estimatedCompletionDate: new Date(Date.now() + daysRemaining * 86400000).toISOString(),
      probability,
      risks: probability < 80 ? [
        'Task complexity higher than average',
        'Assignee has multiple high-priority tasks',
      ] : [],
    };
  },

  // Generate task description from title
  generateDescription: async (title) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const templates = [
      `Implement ${title.toLowerCase()} with proper error handling and logging. Ensure all edge cases are covered.`,
      `Create ${title.toLowerCase()} following best practices. Include unit tests and documentation.`,
      `Develop ${title.toLowerCase()} feature with focus on performance and user experience.`,
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  },

  // ------------------- NEW API-BASED FUNCTIONS -------------------
  breakdownTaskAPI: async (title, description) => {
    const { data } = await api.post('/ai/breakdown', { title, description });
    return data.data;
  },

  estimateTimeAPI: async (title, description, priority) => {
    const { data } = await api.post('/ai/estimate', { title, description, priority });
    return data.data;
  },

  generateDescriptionAPI: async (title) => {
    const { data } = await api.post('/ai/generate-description', { title });
    return data.data.description;
  },

  suggestLabelsAPI: async (title, description) => {
    const { data } = await api.post('/ai/suggest-labels', { title, description });
    return data.data;
  },
};