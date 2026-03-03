import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './src/config/db.js';
import errorHandler from './src/middleware/errorHandler.js';
import { initializeSocket } from './src/services/socketService.js';

// 🔒 Security imports
import {
  helmetConfig,
  limiter,
  authLimiter,
  sanitizeData,
  preventXSS,
  preventHPP,
  corsOptions,
} from './src/middleware/security.js';

// Routes
import authRoutes from './src/routes/authRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

// 🔥 IMPORTANT: CORS for production
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// 🔒 Security Middleware (FIRST)
app.use(helmetConfig);
app.use(cors(corsOptions));
app.use(sanitizeData);
app.use(preventXSS);
app.use(preventHPP);

// Rate limiting
app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Socket.io setup
const io = new Server(httpServer, {
  cors: corsOptions,
});

initializeSocket(io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'TaskFlow API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Socket.io events
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('join-project', (projectId) => {
    socket.join(projectId);
    console.log(`User ${socket.id} joined project ${projectId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 TaskFlow API Server Running     ║
║   📡 Port: ${PORT}                       ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}      ║
║   🔗 Health: http://localhost:${PORT}/api/health
╚═══════════════════════════════════════╝
  `);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});