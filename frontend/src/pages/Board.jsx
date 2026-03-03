import { useState, useEffect } from 'react';
import { Filter, Users, Calendar, Plus, Loader2 } from 'lucide-react';
import { Button, Loading, EmptyState } from '../components/common';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { useModalStore, useTaskStore, useProjectStore } from '../store/useStore';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import toast from 'react-hot-toast';

const Board = () => {
  const { openTaskModal } = useModalStore();
  const { tasks, setTasks, setSelectedTask } = useTaskStore();
  const { projects, setProjects, selectedProject, setSelectedProject } = useProjectStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksData, projectsData] = await Promise.all([
        taskService.getTasks(selectedProject?._id ? { projectId: selectedProject._id } : {}),
        projectService.getProjects(),
      ]);
      
      setTasks(tasksData);
      setProjects(projectsData);
      
      // Auto-select first project if none selected
      if (!selectedProject && projectsData.length > 0) {
        setSelectedProject(projectsData[0]);
      }
    } catch (error) {
      console.error('❌ Failed to load board data:', error);
      toast.error('Failed to load board');
    } finally {
      setLoading(false);
    }
  };

  const handleNewTask = () => {
    setSelectedTask({
      project: selectedProject?._id,
    });
    openTaskModal();
  };

  if (loading) {
    return <Loading fullScreen text="Loading board..." />;
  }

  // Show message if no projects
  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Project Board
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create a project to start managing tasks
            </p>
          </div>
        </div>
        
        <EmptyState
          title="No projects yet"
          description="Create your first project to start using the Kanban board"
          actionLabel="Create Project"
          onAction={() => window.location.href = '/projects'}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {selectedProject?.name || 'Project Board'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your tasks with drag & drop
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Project Selector */}
          <select
            value={selectedProject?._id || ''}
            onChange={(e) => {
              const project = projects.find(p => p._id === e.target.value);
              setSelectedProject(project);
              // Refetch tasks for new project
              if (project) {
                taskService.getTasks({ projectId: project._id })
                  .then(setTasks)
                  .catch(err => toast.error('Failed to load tasks'));
              }
            }}
            className="input max-w-xs"
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          
          <Button variant="outline" icon={Filter}>
            Filter
          </Button>
          <Button variant="outline" icon={Calendar}>
            Calendar
          </Button>
          <Button onClick={handleNewTask} icon={Plus}>
            New Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard />
    </div>
  );
};

export default Board;