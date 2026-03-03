import Project from '../models/Project.js';
import Task from '../models/Task.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
  try {
    console.log('📝 Getting projects for user:', req.user.id);
    
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id },
      ],
    })
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .sort({ createdAt: -1 });

    console.log('✅ Found projects:', projects.length);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error('❌ Get projects error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Get project tasks
    const tasks = await Task.find({ project: project._id })
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.status(200).json({
      success: true,
      data: {
        project,
        tasks,
      },
    });
  } catch (error) {
    console.error('❌ Get project error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    console.log('📝 Creating project:', req.body);
    console.log('👤 User:', req.user.id);

    const projectData = {
      ...req.body,
      owner: req.user.id,
      members: [
        {
          user: req.user.id,
          role: 'admin',
        },
      ],
    };

    const project = await Project.create(projectData);

    // Populate the response
    await project.populate('owner', 'name email avatar');
    await project.populate('members.user', 'name email avatar');

    console.log('✅ Project created:', project.name);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    console.error('❌ Create project error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is owner or admin
    const isMember = project.members.find(
      (m) => m.user.toString() === req.user.id && m.role === 'admin'
    );

    if (project.owner.toString() !== req.user.id && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project',
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    console.error('❌ Update project error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Only owner can delete
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project',
      });
    }

    // Delete all tasks in the project
    await Task.deleteMany({ project: project._id });

    await project.deleteOne();

    console.log('✅ Project deleted:', project.name);

    res.status(200).json({
      success: true,
      message: 'Project and associated tasks deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('❌ Delete project error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle project star
// @route   PATCH /api/projects/:id/star
// @access  Private
export const toggleStar = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    project.isStarred = !project.isStarred;
    await project.save();

    await project.populate('owner', 'name email avatar');
    await project.populate('members.user', 'name email avatar');

    res.status(200).json({
      success: true,
      message: project.isStarred ? 'Project starred' : 'Project unstarred',
      data: project,
    });
  } catch (error) {
    console.error('❌ Toggle star error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle project archive
// @route   PATCH /api/projects/:id/archive
// @access  Private
export const toggleArchive = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    project.isArchived = !project.isArchived;
    await project.save();

    await project.populate('owner', 'name email avatar');
    await project.populate('members.user', 'name email avatar');

    res.status(200).json({
      success: true,
      message: project.isArchived ? 'Project archived' : 'Project unarchived',
      data: project,
    });
  } catch (error) {
    console.error('❌ Toggle archive error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
export const addMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const { userId, role } = req.body;

    // Check if user already a member
    const exists = project.members.find((m) => m.user.toString() === userId);

    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member',
      });
    }

    project.members.push({
      user: userId,
      role: role || 'member',
    });

    await project.save();
    await project.populate('members.user', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      data: project,
    });
  } catch (error) {
    console.error('❌ Add member error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
export const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== req.params.userId
    );

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: project,
    });
  } catch (error) {
    console.error('❌ Remove member error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};