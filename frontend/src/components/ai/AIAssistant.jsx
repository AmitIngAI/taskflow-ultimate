import { useState } from 'react';
import { Sparkles, Wand2, Loader2 } from 'lucide-react';
import { Button } from '../common';
import { aiService } from '../../services/aiService';
import toast from 'react-hot-toast';

const AIAssistant = ({ taskData, onSuggestion }) => {
  const [loading, setLoading] = useState(false);

  const handleBreakdown = async () => {
    if (!taskData.title) {
      toast.error('Please enter a task title first');
      return;
    }

    setLoading(true);
    try {
      const subtasks = await aiService.breakdownTask(
        taskData.title,
        taskData.description
      );
      
      onSuggestion({ subtasks });
      toast.success('AI breakdown complete! ✨');
    } catch (error) {
      toast.error('AI failed to breakdown task');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!taskData.title) {
      toast.error('Please enter a task title first');
      return;
    }

    setLoading(true);
    try {
      const description = await aiService.generateDescription(taskData.title);
      onSuggestion({ description });
      toast.success('Description generated! ✨');
    } catch (error) {
      toast.error('AI failed to generate description');
    } finally {
      setLoading(false);
    }
  };

  const handleEstimate = async () => {
    if (!taskData.title) {
      toast.error('Please enter a task title first');
      return;
    }

    setLoading(true);
    try {
      const estimate = await aiService.estimateTime(
        taskData.title,
        taskData.description,
        taskData.priority
      );
      
      toast.success(
        `AI Estimate: ${estimate.hours} hours (${estimate.confidence} confidence)\n${estimate.reasoning}`,
        { duration: 5000 }
      );
    } catch (error) {
      toast.error('AI failed to estimate time');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
      <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 mr-auto">
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium">AI Assistant</span>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={handleGenerateDescription}
        disabled={loading}
        icon={loading ? Loader2 : Wand2}
      >
        Generate Description
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={handleBreakdown}
        disabled={loading}
        icon={loading ? Loader2 : Sparkles}
      >
        Breakdown Task
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={handleEstimate}
        disabled={loading}
      >
        Estimate Time
      </Button>
    </div>
  );
};

export default AIAssistant;