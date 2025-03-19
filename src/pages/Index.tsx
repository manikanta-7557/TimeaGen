
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TaskForm from '@/components/TaskForm';
import Timetable from '@/components/Timetable';
import ProgressTracker from '@/components/ProgressTracker';
import SmartSuggestions from '@/components/SmartSuggestions';
import AnalyticsView from '@/components/AnalyticsView';
import { Task, TimeSlot, SmartSuggestion, UserPreference } from '@/types';
import { mockTasks, mockSuggestions, mockProductivityData } from '@/utils/mockData';
import { useToast } from '@/components/ui/use-toast';
import { addMinutesToTime } from '@/utils/timeUtils';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  // State for tasks, suggestions, and productivity data
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>(mockSuggestions);
  const [userPreferences, setUserPreferences] = useState<UserPreference | null>(null);
  
  // Load user preferences on component mount
  useEffect(() => {
    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences));
    }
  }, []);
  
  // Clear all tasks
  const handleClearTasks = () => {
    setTasks([]);
    setSuggestions([]);
    toast({
      title: "Tasks Cleared",
      description: "All tasks have been removed",
      duration: 2000,
    });
  };
  
  // Generate smart suggestions based on user preferences
  const generateSmartSuggestion = (task: Task): SmartSuggestion | null => {
    if (!userPreferences) return null;
    
    // Find a suitable time slot based on task priority and user preferences
    let startTime: string;
    let day = new Date().getDay(); // Default to today
    
    // For high priority tasks, try to allocate during focus time
    if (task.priority === 'high' && userPreferences.focusTime) {
      startTime = userPreferences.focusTime.start;
      
      // Check if we already have a task scheduled during focus time
      const focusTimeAlreadyBooked = tasks.some(t => 
        t.timeSlot?.day === day && 
        t.timeSlot?.startTime === startTime
      );
      
      // If focus time is booked, use preferred working hours instead
      if (focusTimeAlreadyBooked) {
        startTime = userPreferences.preferredWorkingHours.start;
      }
    } else {
      // For other priorities, use preferred working hours
      startTime = userPreferences.preferredWorkingHours.start;
      
      // Look for a free slot
      let slotFound = false;
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = userPreferences.preferredWorkingHours.end.split(':').map(Number);
      
      // Try different start times within working hours
      for (let hour = startHour; hour < endHour; hour++) {
        const currentSlotTime = `${hour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
        
        const slotOccupied = tasks.some(t => 
          t.timeSlot?.day === day && 
          t.timeSlot?.startTime === currentSlotTime
        );
        
        if (!slotOccupied) {
          startTime = currentSlotTime;
          slotFound = true;
          break;
        }
      }
      
      // If no slot found today, try tomorrow
      if (!slotFound) {
        day = (day + 1) % 7;
        startTime = userPreferences.preferredWorkingHours.start;
      }
    }
    
    // Calculate end time based on task duration
    const endTime = addMinutesToTime(startTime, task.duration);
    
    // Generate efficiency score based on priority and whether it's in focus time
    let efficiency = 70; // Base efficiency
    
    if (task.priority === 'high') efficiency += 15;
    if (task.priority === 'low') efficiency -= 10;
    
    const [focusStartHour, focusStartMinute] = userPreferences.focusTime.start.split(':').map(Number);
    const [focusEndHour, focusEndMinute] = userPreferences.focusTime.end.split(':').map(Number);
    const [slotStartHour, slotStartMinute] = startTime.split(':').map(Number);
    
    const focusStartMinutes = focusStartHour * 60 + focusStartMinute;
    const focusEndMinutes = focusEndHour * 60 + focusEndMinute;
    const slotStartMinutes = slotStartHour * 60 + slotStartMinute;
    
    // If the suggested time is during focus hours, increase efficiency
    if (slotStartMinutes >= focusStartMinutes && slotStartMinutes < focusEndMinutes) {
      efficiency += 15;
    }
    
    // Cap efficiency at 100
    efficiency = Math.min(efficiency, 100);
    
    // Create a reason for the suggestion
    let reason = "This time slot matches your preferred working hours";
    if (slotStartMinutes >= focusStartMinutes && slotStartMinutes < focusEndMinutes) {
      reason = "This time is during your focus hours when you're most productive";
    }
    
    if (task.priority === 'high') {
      reason += " and is optimal for your high-priority task";
    }
    
    return {
      id: `suggestion-${Date.now()}`,
      taskId: task.id,
      suggestedTimeSlot: {
        id: `timeslot-${Date.now()}`,
        day,
        startTime,
        endTime
      },
      reason,
      efficiency
    };
  };
  
  // Add a new task
  const handleAddTask = (newTask: Task) => {
    // Add the task to the tasks list
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    // Generate a new suggestion for this task based on user preferences
    if (userPreferences) {
      const newSuggestion = generateSmartSuggestion(newTask);
      
      if (newSuggestion) {
        setSuggestions(prevSuggestions => [...prevSuggestions, newSuggestion]);
      }
    } else {
      // Fallback to random suggestion if no preferences are set
      if (suggestions.length < 5) { // Limit the number of suggestions
        const randomTimeSlotIndex = Math.floor(Math.random() * mockTasks.length);
        const randomTimeSlot = mockTasks[randomTimeSlotIndex]?.timeSlot;
        
        if (randomTimeSlot) {
          const newSuggestion: SmartSuggestion = {
            id: `suggestion-${Date.now()}`,
            taskId: newTask.id,
            suggestedTimeSlot: randomTimeSlot,
            reason: 'This time slot matches your preferred working hours and has been productive for similar tasks in the past.',
            efficiency: Math.floor(Math.random() * 30) + 70 // Random efficiency between 70-100
          };
          
          setSuggestions(prevSuggestions => [...prevSuggestions, newSuggestion]);
        }
      }
    }
  };
  
  // Update task progress
  const handleUpdateProgress = (taskId: string, progress: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, progress, completed: progress === 100 } 
          : task
      )
    );
    
    toast({
      title: "Progress Updated",
      description: `Task progress updated to ${progress}%`,
      duration: 2000,
    });
  };
  
  // Assign time slot to a task
  const handleAssignTimeSlot = (taskId: string, timeSlot: TimeSlot) => {
    // Update the task with the time slot
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, timeSlot } 
          : task
      )
    );
    
    // Remove the suggestion
    setSuggestions(prevSuggestions => 
      prevSuggestions.filter(suggestion => suggestion.taskId !== taskId)
    );
    
    toast({
      title: "Time Slot Assigned",
      description: "Task has been scheduled successfully",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      <Header />
      
      <div className="flex justify-end mb-4">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleClearTasks}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Clear All Tasks
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Task Form and Progress Tracker */}
        <div className="space-y-6">
          <TaskForm onAddTask={handleAddTask} />
          <ProgressTracker 
            tasks={tasks} 
            onUpdateProgress={handleUpdateProgress} 
          />
        </div>
        
        {/* Middle Column: Timetable */}
        <div className="md:col-span-2">
          <Timetable 
            tasks={tasks} 
            onAssignTimeSlot={handleAssignTimeSlot} 
            userPreferences={userPreferences}
          />
        </div>
      </div>
      
      {/* Full Width Sections */}
      <div className="mt-6 space-y-6">
        <SmartSuggestions 
          suggestions={suggestions} 
          tasks={tasks} 
          onAcceptSuggestion={handleAssignTimeSlot} 
        />
        
        <AnalyticsView productivityData={mockProductivityData} />
      </div>
    </div>
  );
};

export default Index;
