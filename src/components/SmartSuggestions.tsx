
import React, { useEffect, useState } from 'react';
import { SmartSuggestion, Task, TimeSlot, UserPreference } from '@/types';
import { Sparkles, Clock, ChevronRight, LightbulbIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/utils/timeUtils';
import { mockCategories } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface SmartSuggestionsProps {
  suggestions: SmartSuggestion[];
  tasks: Task[];
  onAcceptSuggestion: (taskId: string, timeSlot: TimeSlot) => void;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ 
  suggestions, 
  tasks, 
  onAcceptSuggestion 
}) => {
  const [userPreferences, setUserPreferences] = useState<UserPreference | null>(null);
  
  // Load user preferences on component mount
  useEffect(() => {
    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences));
    }
  }, []);
  
  // Get task by ID
  const getTaskById = (taskId: string): Task | undefined => {
    return tasks.find(task => task.id === taskId);
  };
  
  // Get category color for a task
  const getTaskColor = (taskId: string): string => {
    const task = getTaskById(taskId);
    if (!task) return '#888888';
    
    const category = mockCategories.find(cat => cat.id === task.category);
    return category?.color || '#888888';
  };
  
  // Get efficiency color based on score
  const getEfficiencyColor = (score: number): string => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };
  
  // Check if a time slot is within focus time
  const isInFocusTime = (timeSlot: TimeSlot): boolean => {
    if (!userPreferences) return false;
    
    const [focusStartHour, focusStartMinute] = userPreferences.focusTime.start.split(':').map(Number);
    const [focusEndHour, focusEndMinute] = userPreferences.focusTime.end.split(':').map(Number);
    const [slotStartHour, slotStartMinute] = timeSlot.startTime.split(':').map(Number);
    
    const focusStartMinutes = focusStartHour * 60 + focusStartMinute;
    const focusEndMinutes = focusEndHour * 60 + focusEndMinute;
    const slotStartMinutes = slotStartHour * 60 + slotStartMinute;
    
    return slotStartMinutes >= focusStartMinutes && slotStartMinutes < focusEndMinutes;
  };
  
  // Enhance suggestion description based on user preferences
  const getEnhancedReason = (suggestion: SmartSuggestion): string => {
    const task = getTaskById(suggestion.taskId);
    if (!task || !userPreferences) return suggestion.reason;
    
    let enhancedReason = suggestion.reason;
    
    if (task.priority === 'high' && isInFocusTime(suggestion.suggestedTimeSlot)) {
      enhancedReason += " This high-priority task is scheduled during your focus time for maximum productivity.";
    } else if (isInFocusTime(suggestion.suggestedTimeSlot)) {
      enhancedReason += " This time slot falls within your designated focus time.";
    }
    
    return enhancedReason;
  };

  return (
    <div className="glass-card rounded-lg p-4 animate-fade-in">
      <div className="flex items-center mb-4">
        <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
        <h2 className="text-xl font-semibold">Smart Suggestions</h2>
      </div>
      
      {suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map((suggestion) => {
            const task = getTaskById(suggestion.taskId);
            if (!task) return null;
            
            // Check if this suggestion is during focus time for styling
            const isFocusTimeSuggestion = userPreferences && isInFocusTime(suggestion.suggestedTimeSlot);
            
            return (
              <div 
                key={suggestion.id} 
                className={cn(
                  "bg-background/40 rounded-lg p-4 border border-border",
                  isFocusTimeSuggestion && "border-l-4 border-l-primary"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium mb-1">{task.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>
                        {formatTime(suggestion.suggestedTimeSlot.startTime)} - 
                        {formatTime(suggestion.suggestedTimeSlot.endTime)}
                      </span>
                      {isFocusTimeSuggestion && (
                        <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          Focus Time
                        </span>
                      )}
                    </div>
                    <div className="flex items-start mt-3">
                      <LightbulbIcon className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{getEnhancedReason(suggestion)}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className={cn(
                      "text-sm font-medium mb-2",
                      getEfficiencyColor(suggestion.efficiency)
                    )}>
                      {suggestion.efficiency}% efficient
                    </div>
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={() => onAcceptSuggestion(
                        suggestion.taskId, 
                        suggestion.suggestedTimeSlot
                      )}
                    >
                      Accept
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-6">
          <p className="text-muted-foreground">No suggestions available right now</p>
        </div>  
      )}
    </div>
  );
};

export default SmartSuggestions;
