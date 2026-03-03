import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '../../.env') });

import OpenAI from 'openai';

// Debug log
console.log('🔍 AI Service - Checking API key...');
console.log('🔑 Key present:', !!process.env.OPENAI_API_KEY);
console.log('🔑 Key preview:', process.env.OPENAI_API_KEY?.substring(0, 20) + '...');

let openai = null;

// Only initialize if API key exists
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI initialized successfully');
  } catch (error) {
    console.error('❌ OpenAI initialization error:', error.message);
  }
} else {
  console.log('⚠️ OpenAI API key not found - AI features disabled');
}

export const aiService = {
  // Break down large task into subtasks
  breakdownTask: async (taskTitle, taskDescription) => {
    if (!openai) {
      return [{ title: 'Subtask 1', estimatedTime: '1 hour' }];
    }

    try {
      const prompt = `You are a project management assistant. Break down this task into 4-6 actionable subtasks:

Task: ${taskTitle}
Description: ${taskDescription || 'No description'}

Return ONLY a JSON array of subtasks with this format:
[
  {"title": "Subtask 1", "estimatedTime": "2 hours"},
  {"title": "Subtask 2", "estimatedTime": "3 hours"}
]`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      });

      const content = response.choices[0].message.content;
      const subtasks = JSON.parse(content);
      
      return subtasks;
    } catch (error) {
      console.error('AI Breakdown error:', error);
      throw new Error('Failed to breakdown task');
    }
  },

  // Estimate task completion time
  estimateTime: async (taskTitle, taskDescription, taskPriority) => {
    if (!openai) {
      return { hours: 4, confidence: 'medium', reasoning: 'AI not configured' };
    }

    try {
      const prompt = `Estimate completion time for this task in hours. Consider the priority level.

Task: ${taskTitle}
Description: ${taskDescription || 'No description'}
Priority: ${taskPriority}

Return ONLY a JSON object:
{
  "hours": 4,
  "confidence": "high",
  "reasoning": "Brief explanation"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 200,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI Estimation error:', error);
      throw new Error('Failed to estimate time');
    }
  },

  // Generate task description from title
  generateDescription: async (taskTitle) => {
    if (!openai) {
      return 'Task description not available - AI not configured';
    }

    try {
      const prompt = `Generate a professional task description for: "${taskTitle}"
Keep it concise (2-3 sentences) and actionable.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 150,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('AI Description error:', error);
      throw new Error('Failed to generate description');
    }
  },

  // Suggest task labels/tags
  suggestLabels: async (taskTitle, taskDescription) => {
    if (!openai) {
      return ['bug', 'feature', 'improvement'];
    }

    try {
      const prompt = `Suggest 3-5 relevant labels/tags for this task:

Task: ${taskTitle}
Description: ${taskDescription || ''}

Return ONLY a JSON array of strings: ["label1", "label2", "label3"]`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        max_tokens: 100,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI Labels error:', error);
      return ['bug', 'feature', 'improvement'];
    }
  },

  // Analyze team sentiment from comments
  analyzeSentiment: async (comments) => {
    if (!openai) {
      return { sentiment: 'neutral', score: 0.5, insights: 'AI not configured' };
    }

    try {
      const commentsText = comments.map(c => c.text).join('\n');
      
      const prompt = `Analyze the team sentiment from these comments:

${commentsText}

Return ONLY a JSON object:
{
  "sentiment": "positive|neutral|negative",
  "score": 0.75,
  "insights": "Brief insight"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 150,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI Sentiment error:', error);
      return { sentiment: 'neutral', score: 0.5, insights: 'Unable to analyze' };
    }
  },
};