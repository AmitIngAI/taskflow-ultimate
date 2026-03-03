import { useState } from 'react';
import { Sparkles, Wand2, Loader2 } from 'lucide-react';
import { aiService } from '../../services/aiService';
import toast from 'react-hot-toast';

const SmartInput = ({ value, onChange, onEstimate, placeholder }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerateDescription = async () => {
    if (!value.trim()) {
      toast.error('Please enter a task title first');
      return;
    }

    setLoading(true);
    try {
      const description = await aiService.generateDescription(value);
      onChange({ target: { value: description } });
      toast.success('Description generated!');
    } catch (error) {
      toast.error('Failed to generate description');
    } finally {
      setLoading(false);
    }
  };

  const handleEstimateTime = async () => {
    if (!value.trim()) {
      toast.error('Please enter task details first');
      return;
    }

    setLoading(true);
    try {
      const estimate = await aiService.estimateTaskTime({ 
        title: value,
        description: value 
      });
      onEstimate && onEstimate(estimate);
      toast.success(
        `Estimated time: ${estimate.estimate} hours (${estimate.confidence}% confidence)`,
        { duration: 4000 }
      );
    } catch (error) {
      toast.error('Failed to estimate time');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input pr-12"
        rows={4}
      />
      <div className="absolute right-2 top-2 flex flex-col gap-1">
        <button
          type="button"
          onClick={handleGenerateDescription}
          disabled={loading}
          className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors disabled:opacity-50"
          title="Generate with AI"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
        </button>
        <button
          type="button"
          onClick={handleEstimateTime}
          disabled={loading}
          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
          title="Estimate time"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SmartInput;