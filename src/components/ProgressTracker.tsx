
import React from 'react';
import { Task } from '@/types';
import { CheckCircle2, Clock, AlertCircle, BarChart2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { mockCategories } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface ProgressTrackerProps {
  tasks: Task[];
  onUpdateProgress: (taskId: string, progress: number) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ tasks, onUpdateProgress }) => {
  // Get color for a task based on its category
  const getTaskColor = (task: Task): string => {
    const category = mockCategories.find(cat => cat.id === task.category);
    return category?.color || '#888888';
  };

  // Task count statistics
  const completedTasks = tasks.filter(task => task.progress === 100).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group tasks by status
  const inProgressTasks = tasks.filter(task => task.progress > 0 && task.progress < 100);
  const completedTasksList = tasks.filter(task => task.progress === 100);
  const notStartedTasks = tasks.filter(task => task.progress === 0);

  // Handle progress update
  const handleProgressChange = (task: Task, newProgress: number) => {
    onUpdateProgress(task.id, newProgress);
  };

  return (
    <div className="glass-card rounded-lg p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Progress Tracker</h2>
        <div className="text-sm font-medium">
          {completedTasks}/{totalTasks} completed
        </div>
      </div>
      
      <div className="mb-6">
        <Progress value={completionPercentage} className="h-2" />
      </div>
      
      <div className="space-y-6">
        {/* In Progress Tasks */}
        <div>
          <div className="flex items-center text-amber-500 mb-2">
            <Clock className="h-4 w-4 mr-2" />
            <h3 className="font-medium">In Progress</h3>
          </div>
          {inProgressTasks.length > 0 ? (
            <div className="space-y-3">
              {inProgressTasks.map(task => (
                <div key={task.id} className="bg-background/40 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm">{task.progress}%</div>
                  </div>
                  <div 
                    className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden mb-2"
                  >
                    <div 
                      className="h-full rounded-full progress-bar" 
                      style={{ 
                        width: `${task.progress}%`,
                        backgroundColor: getTaskColor(task)
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between">
                    <button 
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => handleProgressChange(task, Math.max(0, task.progress - 10))}
                    >
                      -10%
                    </button>
                    <button 
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => handleProgressChange(task, Math.min(100, task.progress + 10))}
                    >
                      +10%
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">No tasks in progress</div>
          )}
        </div>
        
        {/* Not Started Tasks */}
        <div>
          <div className="flex items-center text-red-500 mb-2">
            <AlertCircle className="h-4 w-4 mr-2" />
            <h3 className="font-medium">Not Started</h3>
          </div>
          {notStartedTasks.length > 0 ? (
            <div className="space-y-3">
              {notStartedTasks.map(task => (
                <div key={task.id} className="bg-background/40 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm">{task.progress}%</div>
                  </div>
                  <div 
                    className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden mb-2"
                  >
                    <div 
                      className="h-full rounded-full" 
                      style={{
                        width: '0%',
                        backgroundColor: getTaskColor(task)
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => handleProgressChange(task, 10)}
                    >
                      Start Task (+10%)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">All tasks have been started</div>
          )}
        </div>
        
        {/* Completed Tasks */}
        <div>
          <div className="flex items-center text-green-500 mb-2">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <h3 className="font-medium">Completed</h3>
          </div>
          {completedTasksList.length > 0 ? (
            <div className="space-y-3">
              {completedTasksList.map(task => (
                <div key={task.id} className="bg-background/40 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm">{task.progress}%</div>
                  </div>
                  <div 
                    className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden"
                  >
                    <div 
                      className="h-full rounded-full" 
                      style={{
                        width: '100%',
                        backgroundColor: getTaskColor(task)
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">No completed tasks yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
