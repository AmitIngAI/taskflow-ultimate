import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical,
  Folder,
  Users,
  Calendar,
  Star,
  StarOff,
  Archive,
  Trash2,
  Edit,
  Loader2
} from 'lucide-react';
import { 
  Button, 
  Card, 
  Input, 
  Badge, 
  Avatar, 
  Modal,
  Dropdown,
  DropdownItem,
  EmptyState,
  Loading
} from '../components/common';
import { useProjectStore, useTaskStore } from '../store/useStore';
import { projectService } from '../services/projectService';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Projects = () => {
  const { projects, setProjects, addProject, updateProject, deleteProject } = useProjectStore();
  const { tasks } = useTaskStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: '#6366f1',
  });

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      console.log('✅ Projects fetched:', data);
      setProjects(data);
    } catch (error) {
      console.error('❌ Failed to fetch projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filter === 'starred') return matchesSearch && project.isStarred;
    if (filter === 'archived') return matchesSearch && project.isArchived;
    if (filter === 'active') return matchesSearch && !project.isArchived;
    return matchesSearch;
  });

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!newProject.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    setCreating(true);
    
    try {
      const created = await projectService.createProject({
        name: newProject.name.trim(),
        description: newProject.description.trim(),
        color: newProject.color,
      });
      
      console.log('✅ Project created:', created);
      
      // Add to store
      addProject(created);
      
      // Reset form
      setNewProject({ name: '', description: '', color: '#6366f1' });
      setShowCreateModal(false);
      
      toast.success('Project created successfully!');
    } catch (error) {
      console.error('❌ Create project error:', error);
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStar = async (projectId) => {
    try {
      const updated = await projectService.toggleStar(projectId);
      updateProject(projectId, updated);
      toast.success(updated.isStarred ? 'Project starred' : 'Project unstarred');
    } catch (error) {
      toast.error('Failed to update project');
    }
  };

  const handleToggleArchive = async (projectId) => {
    try {
      const updated = await projectService.toggleArchive(projectId);
      updateProject(projectId, updated);
      toast.success(updated.isArchived ? 'Project archived' : 'Project unarchived');
    } catch (error) {
      toast.error('Failed to archive project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure? This will also delete all tasks in this project.')) {
      return;
    }
    
    try {
      await projectService.deleteProject(projectId);
      deleteProject(projectId);
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const getProgress = (projectId) => {
    const projectTasks = tasks.filter(t => t.project?._id === projectId || t.project === projectId);
    if (projectTasks.length === 0) return 0;
    const completed = projectTasks.filter(t => t.status === 'done').length;
    return Math.round((completed / projectTasks.length) * 100);
  };

  const getTaskCount = (projectId) => {
    return tasks.filter(t => t.project?._id === projectId || t.project === projectId).length;
  };

  const colorOptions = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#84cc16'
  ];

  if (loading) {
    return <Loading fullScreen text="Loading projects..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and organize your projects ({projects.length} total)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search projects..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => setShowCreateModal(true)} icon={Plus}>
            New Project
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All Projects' },
          { id: 'active', label: 'Active' },
          { id: 'starred', label: 'Starred' },
          { id: 'archived', label: 'Archived' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={Folder}
          title={filter === 'all' ? "No projects yet" : `No ${filter} projects`}
          description="Create your first project to get started with task management"
          actionLabel="Create Project"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card hoverable className={`relative ${project.isArchived ? 'opacity-60' : ''}`}>
                {/* Color Bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                  style={{ backgroundColor: project.color || '#6366f1' }}
                />

                {/* Header */}
                <div className="flex items-start justify-between mb-4 pt-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: (project.color || '#6366f1') + '20' }}
                    >
                      <Folder className="w-5 h-5" style={{ color: project.color || '#6366f1' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {project.name}
                      </h3>
                      {project.isArchived && (
                        <Badge size="sm" variant="default">Archived</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleStar(project._id)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition-colors"
                    >
                      {project.isStarred ? (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    <Dropdown
                      trigger={
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      }
                      align="right"
                    >
                      <DropdownItem icon={Edit}>Edit</DropdownItem>
                      <DropdownItem icon={Archive} onClick={() => handleToggleArchive(project._id)}>
                        {project.isArchived ? 'Unarchive' : 'Archive'}
                      </DropdownItem>
                      <DropdownItem icon={Trash2} onClick={() => handleDeleteProject(project._id)} danger>
                        Delete
                      </DropdownItem>
                    </Dropdown>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                  {project.description || 'No description'}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium">{getProgress(project._id)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${getProgress(project._id)}%`,
                        backgroundColor: project.color || '#6366f1',
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTaskCount(project._id)} tasks
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-700">
                  <div className="flex -space-x-2">
                    {project.members?.slice(0, 3).map((member, i) => (
                      <Avatar
                        key={i}
                        src={member.user?.avatar}
                        fallback={member.user?.name || 'U'}
                        size="sm"
                        className="ring-2 ring-white dark:ring-dark-800"
                      />
                    ))}
                    {(!project.members || project.members.length === 0) && (
                      <Avatar fallback="Y" size="sm" className="ring-2 ring-white dark:ring-dark-800" />
                    )}
                  </div>

                  {project.deadline && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(project.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => !creating && setShowCreateModal(false)}
        title="Create New Project"
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={() => setShowCreateModal(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProject}
              loading={creating}
            >
              Create Project
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Name *"
            placeholder="Enter project name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            required
            disabled={creating}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              className="input"
              rows={3}
              placeholder="Enter project description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              disabled={creating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="flex gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewProject({ ...newProject, color })}
                  disabled={creating}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                    newProject.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;