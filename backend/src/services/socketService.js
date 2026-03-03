export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    // Join user's personal room
    socket.on('join-user', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined personal room`);
    });

    // Join project room
    socket.on('join-project', (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`User joined project ${projectId}`);
    });

    // Leave project room
    socket.on('leave-project', (projectId) => {
      socket.leave(`project:${projectId}`);
    });

    // Send notification
    socket.on('send-notification', (data) => {
      io.to(`user:${data.userId}`).emit('notification', data);
    });

    // Task updated
    socket.on('task-updated', (data) => {
      socket.to(`project:${data.projectId}`).emit('task-update', data);
    });

    // User typing
    socket.on('typing', (data) => {
      socket.to(`project:${data.projectId}`).emit('user-typing', {
        userId: data.userId,
        userName: data.userName,
        taskId: data.taskId,
      });
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });
};