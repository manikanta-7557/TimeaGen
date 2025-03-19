
import React from 'react';
import { getDayName, getShortDayName, getTimeSlots, formatTime } from '@/utils/timeUtils';
import { Task, TimeSlot, UserPreference } from '@/types';
import { mockCategories } from '@/utils/mockData';
import { Clock, AlertCircle, Focus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface TimetableProps {
  tasks: Task[];
  onAssignTimeSlot: (taskId: string, timeSlot: TimeSlot) => void;
  userPreferences?: UserPreference | null;
}

const Timetable: React.FC<TimetableProps> = ({ tasks, onAssignTimeSlot, userPreferences }) => {
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

  // Check if a time slot is within focus time
  const isInFocusTime = (time: string): boolean => {
    if (!userPreferences) return false;
    
    const [focusStartHour, focusStartMinute] = userPreferences.focusTime.start.split(':').map(Number);
    const [focusEndHour, focusEndMinute] = userPreferences.focusTime.end.split(':').map(Number);
    const [slotHour, slotMinute] = time.split(':').map(Number);
    
    const focusStartMinutes = focusStartHour * 60 + focusStartMinute;
    const focusEndMinutes = focusEndHour * 60 + focusEndMinute;
    const slotMinutes = slotHour * 60 + slotMinute;
    
    return slotMinutes >= focusStartMinutes && slotMinutes < focusEndMinutes;
  };
  
  // Check if a time slot is within working hours
  const isInWorkingHours = (time: string): boolean => {
    if (!userPreferences) return true; // Consider all hours as working hours if no preferences
    
    const [workStartHour, workStartMinute] = userPreferences.preferredWorkingHours.start.split(':').map(Number);
    const [workEndHour, workEndMinute] = userPreferences.preferredWorkingHours.end.split(':').map(Number);
    const [slotHour, slotMinute] = time.split(':').map(Number);
    
    const workStartMinutes = workStartHour * 60 + workStartMinute;
    const workEndMinutes = workEndHour * 60 + workEndMinute;
    const slotMinutes = slotHour * 60 + slotMinute;
    
    return slotMinutes >= workStartMinutes && slotMinutes < workEndMinutes;
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
              const isFocusTime = isInFocusTime(time);
              const isWorkingHour = isInWorkingHours(time);
              
              return (
                <div 
                  key={`${day}-${timeIndex}`} 
                  className={cn(
                    "h-24 border-t time-slot",
                    !task && "hover:bg-accent cursor-pointer",
                    isFocusTime && "bg-primary/10",
                    !isWorkingHour && "bg-muted/40"
                  )}
                  onClick={() => !task && handleEmptySlotClick(day, time)}
                >
                  {isFocusTime && !task && (
                    <div className="absolute top-1 right-1">
                      <Focus className="h-4 w-4 text-primary/60" />
                    </div>
                  )}
                  
                  {task ? (
                    <div 
                      className={cn(
                        "h-full p-2 overflow-hidden task-item",
                        isFocusTime && "ring-2 ring-primary/40 ring-inset"
                      )}
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
      
      {userPreferences && (
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-primary/10 mr-2"></div>
            <span>Focus Time</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-muted/40 mr-2"></div>
            <span>Outside Working Hours</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
