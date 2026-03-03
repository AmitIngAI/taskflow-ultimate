import Task from '../models/Task.js';
import Notification from '../models/Notification.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { projectId, status, priority, assignee } = req.query;

    const filter = {};

    if (projectId) filter.project = projectId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignees = assignee;

    const tasks = await Task.find(filter)
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name color')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name color')
      .populate('comments.user', 'name email avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      createdBy: req.user.id,
    };

    const task = await Task.create(taskData);

    // Populate references
    await task.populate('assignees', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');
    await task.populate('project', 'name color');

    // Create notifications for assignees
    if (task.assignees && task.assignees.length > 0) {
      const notifications = task.assignees.map((assignee) => ({
        user: assignee._id,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned to "${task.title}"`,
        task: task._id,
        project: task.project._id,
      }));

      await Notification.insertMany(notifications);

      // Emit socket event
      req.io.to(task.project._id.toString()).emit('task-created', task);
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Store old status for notification
    const oldStatus = task.status;

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name color');

    // If status changed, create notification
    if (req.body.status && oldStatus !== req.body.status) {
      const notification = await Notification.create({
        user: task.createdBy._id,
        type: 'status_change',
        title: 'Task Status Updated',
        message: `Task "${task.title}" status changed to ${req.body.status}`,
        task: task._id,
        project: task.project._id,
      });
    }

    // Emit socket event
    req.io.to(task.project._id.toString()).emit('task-updated', task);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await task.deleteOne();

    // Emit socket event
    req.io.to(task.project.toString()).emit('task-deleted', { id: task._id });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const comment = {
      text: req.body.comment,
      user: req.user.id,
      createdAt: Date.now(),
    };

    task.comments.push(comment);
    await task.save();

    // Populate the new comment
    await task.populate('comments.user', 'name email avatar');

    // Create notification for task creator
    if (task.createdBy.toString() !== req.user.id) {
      await Notification.create({
        user: task.createdBy,
        type: 'comment',
        title: 'New Comment',
        message: `${req.user.name} commented on "${task.title}"`,
        task: task._id,
        project: task.project,
      });
    }

    // Emit socket event
    req.io.to(task.project.toString()).emit('comment-added', {
      taskId: task._id,
      comment: task.comments[task.comments.length - 1],
    });

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: task.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    task.status = req.body.status;
    await task.save();

    await task.populate('assignees', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');
    await task.populate('project', 'name color');

    // Emit socket event
    req.io.to(task.project._id.toString()).emit('task-status-updated', {
      taskId: task._id,
      status: task.status,
    });

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add time tracking
// @route   POST /api/tasks/:id/time
// @access  Private
export const addTimeTracking = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const timeEntry = {
      duration: req.body.duration,
      startedAt: req.body.startedAt,
      endedAt: req.body.endedAt,
      user: req.user.id,
    };

    task.timeTracking.push(timeEntry);
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Time logged successfully',
      data: task.timeTracking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// @desc    Delete attachment from task
// @route   DELETE /api/tasks/:taskId/attachments/:attachmentId
// @access  Private
export const deleteAttachment = async (req, res) => {
  try {
    const { taskId, attachmentId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Remove attachment from array
    task.attachments = task.attachments.filter(
      (attachment) => attachment._id.toString() !== attachmentId
    );

    await task.save();

    // Emit socket event
    req.io.to(task.project.toString()).emit('attachment-deleted', {
      taskId: task._id,
      attachmentId,
    });

    res.status(200).json({
      success: true,
      message: 'Attachment deleted successfully',
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// @desc    Upload attachment to task
// @route   POST /api/tasks/:taskId/attachments
// @access  Private
export const uploadTaskAttachment = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const attachment = {
      filename: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
      uploadedAt: Date.now(),
    };

    task.attachments.push(attachment);
    await task.save();

    // Emit socket event
    req.io.to(task.project.toString()).emit('attachment-uploaded', {
      taskId: task._id,
      attachment: task.attachments[task.attachments.length - 1],
    });

    res.status(200).json({
      success: true,
      message: 'Attachment uploaded successfully',
      data: task.attachments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};