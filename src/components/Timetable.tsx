
import React from 'react';
import { getDayName, getShortDayName, getTimeSlots, formatTime } from '@/utils/timeUtils';
import { Task, TimeSlot } from '@/types';
import { mockCategories } from '@/utils/mockData';
import { Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface TimetableProps {
  tasks: Task[];
  onAssignTimeSlot: (taskId: string, timeSlot: TimeSlot) => void;
}

const Timetable: React.FC<TimetableProps> = ({ tasks, onAssignTimeSlot }) => {
  const { toast } = useToast();
  const timeSlots = getTimeSlots(8, 20, 60);
  const days = [0, 1, 2, 3, 4, 5, 6]; // Sunday to Saturday
  
  // Get today's day number (0-6)
  const today = new Date().getDay();
  
  // Find tasks assigned to each time slot
  const getTaskForTimeSlot = (day: number, time: string): Task | undefined => {
    return tasks.find(task => 
      task.timeSlot?.day === day && 
      task.timeSlot?.startTime === time
    );
  };
  
  // Get color for a task based on its category
  const getTaskColor = (task: Task): string => {
    const category = mockCategories.find(cat => cat.id === task.category);
    return category?.color || '#888888';
  };
  
  // Get a lighter version of the color for the background
  const getLightColor = (color: string): string => {
    return `${color}20`; // Adding 20% opacity
  };

  // Handle click on an empty time slot
  const handleEmptySlotClick = (day: number, time: string) => {
    // Show a message that this will be implemented in future
    toast({
      title: "Feature Coming Soon",
      description: "Direct time slot assignment will be available in the next update",
      duration: 3000,
    });
  };

  return (
    <div className="w-full overflow-auto glass-card rounded-lg p-4 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
      
      <div className="timetable-grid mb-4">
        {/* Time column */}
        <div className="sticky left-0 bg-card z-10">
          <div className="h-12"></div> {/* Empty corner cell */}
          {timeSlots.map((time, index) => (
            <div key={index} className="h-24 border-t flex items-center justify-center text-sm text-muted-foreground">
              {formatTime(time)}
            </div>
          ))}
        </div>
        
        {/* Days columns */}
        {days.map(day => (
          <div key={day} className={day === today ? "relative" : ""}>
            {day === today && (
              <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
            )}
            <div className={`h-12 flex items-center justify-center text-center font-medium ${day === today ? 'text-primary' : ''}`}>
              <div>
                <div className="text-sm md:text-base">{getShortDayName(day)}</div>
                <div className="text-xs text-muted-foreground hidden md:block">{day === today ? 'Today' : ''}</div>
              </div>
            </div>
            
            {timeSlots.map((time, timeIndex) => {
              const task = getTaskForTimeSlot(day, time);
              
              return (
                <div 
                  key={`${day}-${timeIndex}`} 
                  className={`h-24 border-t time-slot ${!task ? 'hover:bg-accent cursor-pointer' : ''}`}
                  onClick={() => !task && handleEmptySlotClick(day, time)}
                >
                  {task ? (
                    <div 
                      className="h-full p-2 overflow-hidden task-item" 
                      style={{ 
                        backgroundColor: getLightColor(getTaskColor(task)),
                        borderLeft: `3px solid ${getTaskColor(task)}`
                      }}
                    >
                      <div className="font-medium truncate">{task.title}</div>
                      <div className="text-xs flex items-center space-x-1 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{task.duration} min</span>
                      </div>
                      <div className="mt-2 w-full bg-background/50 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full progress-bar" 
                          style={{ 
                            width: `${task.progress}%`,
                            backgroundColor: getTaskColor(task)
                          }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full w-full"></div> // Empty slot
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timetable;
