import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock, Calendar, Download } from 'lucide-react';
import { Button, Card, Badge, Select } from './common';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const TimeTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isTracking) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isTracking]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!selectedTask) {
      toast.error('Please select a task first');
      return;
    }
    setIsTracking(true);
    toast.success('Timer started');
  };

  const handlePause = () => {
    setIsTracking(false);
    toast.success('Timer paused');
  };

  const handleStop = () => {
    if (elapsedTime === 0) return;
    
    const entry = {
      id: Date.now(),
      taskId: selectedTask,
      duration: elapsedTime,
      startTime: new Date(Date.now() - elapsedTime * 1000),
      endTime: new Date(),
      description: '',
    };
    
    setTimeEntries([entry, ...timeEntries]);
    setElapsedTime(0);
    setIsTracking(false);
    toast.success('Time logged successfully!');
  };

  const getTotalTime = () => {
    return timeEntries.reduce((acc, entry) => acc + entry.duration, 0);
  };

  const exportTimesheet = () => {
    const csv = timeEntries.map(e => 
      `${e.startTime.toISOString()},${formatTime(e.duration)},${e.taskId}`
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheet-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Active Timer */}
      <Card>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isTracking ? 'Tracking Time...' : 'Start Tracking'}
            </span>
          </div>

          <motion.div
            animate={{ scale: isTracking ? [1, 1.02, 1] : 1 }}
            transition={{ repeat: isTracking ? Infinity : 0, duration: 2 }}
            className="text-6xl font-bold text-gray-900 dark:text-white mb-6 font-mono"
          >
            {formatTime(elapsedTime)}
          </motion.div>

          <div className="mb-6">
            <Select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              placeholder="Select a task..."
              options={[
                { value: '1', label: 'Fix login bug' },
                { value: '2', label: 'Design homepage' },
                { value: '3', label: 'API integration' },
              ]}
            />
          </div>

          <div className="flex justify-center gap-3">
            {!isTracking ? (
              <Button onClick={handleStart} icon={Play} size="lg">
                Start Timer
              </Button>
            ) : (
              <>
                <Button onClick={handlePause} variant="warning" icon={Pause} size="lg">
                  Pause
                </Button>
                <Button onClick={handleStop} variant="danger" icon={Square} size="lg">
                  Stop & Log
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Today</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {formatTime(getTotalTime())}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {formatTime(getTotalTime() * 5)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Entries</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {timeEntries.length}
          </p>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Entries
          </h3>
          <Button size="sm" variant="outline" icon={Download} onClick={exportTimesheet}>
            Export CSV
          </Button>
        </div>

        <div className="space-y-2">
          {timeEntries.slice(0, 10).map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Task #{entry.taskId}
                  </p>
                  <p className="text-xs text-gray-500">
                    {entry.startTime.toLocaleTimeString()} - {entry.endTime.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <Badge variant="primary">{formatTime(entry.duration)}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TimeTracker;