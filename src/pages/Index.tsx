
import React, { useState } from 'react';
import Header from '@/components/Header';
import TaskForm from '@/components/TaskForm';
import Timetable from '@/components/Timetable';
import ProgressTracker from '@/components/ProgressTracker';
import SmartSuggestions from '@/components/SmartSuggestions';
import AnalyticsView from '@/components/AnalyticsView';
import { Task, TimeSlot, SmartSuggestion } from '@/types';
import { mockTasks, mockSuggestions, mockProductivityData } from '@/utils/mockData';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  // State for tasks, suggestions, and productivity data
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>(mockSuggestions);
  
  // Add a new task
  const handleAddTask = (newTask: Task) => {
    // Add the task to the tasks list
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    // Generate a new suggestion for this task (in a real app, this would be AI-based)
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
