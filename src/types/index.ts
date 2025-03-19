
export type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  day: number; // 0-6 for Sunday-Saturday
};

export type Task = {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  timeSlot?: TimeSlot;
  progress: number; // 0-100
  category: string;
  createdAt: Date;
  dueDate?: Date;
};

export type SmartSuggestion = {
  id: string;
  taskId: string;
  suggestedTimeSlot: TimeSlot;
  reason: string;
  efficiency: number; // 0-100
};

export type ProductivityData = {
  date: Date;
  tasksCompleted: number;
  tasksPlanned: number;
  efficiencyScore: number; // 0-100
};

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type UserPreference = {
  preferredWorkingHours: {
    start: string;
    end: string;
  };
  focusTime: {
    start: string;
    end: string;
  };
  breakPreferences: {
    frequency: number; // in minutes
    duration: number; // in minutes
  };
};
