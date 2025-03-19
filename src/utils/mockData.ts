import { Task, TimeSlot, SmartSuggestion, ProductivityData, Category, UserPreference } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const mockCategories: Category[] = [
  { id: '1', name: 'Work', color: '#3b82f6' },
  { id: '2', name: 'Study', color: '#10b981' },
  { id: '3', name: 'Personal', color: '#f59e0b' },
  { id: '4', name: 'Health', color: '#ef4444' },
  { id: '5', name: 'Social', color: '#8b5cf6' }
];

export const mockTimeSlots: TimeSlot[] = [
  { id: '1', startTime: '09:00', endTime: '10:00', day: 1 },
  { id: '2', startTime: '10:30', endTime: '12:00', day: 1 },
  { id: '3', startTime: '13:00', endTime: '14:30', day: 1 },
  { id: '4', startTime: '15:00', endTime: '16:00', day: 1 },
  { id: '5', startTime: '09:30', endTime: '11:00', day: 2 },
  { id: '6', startTime: '11:30', endTime: '13:00', day: 2 },
  { id: '7', startTime: '14:00', endTime: '15:30', day: 2 },
  { id: '8', startTime: '16:00', endTime: '17:00', day: 2 },
  { id: '9', startTime: '09:00', endTime: '10:30', day: 3 },
  { id: '10', startTime: '11:00', endTime: '12:30', day: 3 },
  { id: '11', startTime: '13:30', endTime: '15:00', day: 3 },
  { id: '12', startTime: '15:30', endTime: '16:30', day: 3 },
  { id: '13', startTime: '09:30', endTime: '11:00', day: 4 },
  { id: '14', startTime: '11:30', endTime: '13:00', day: 4 },
  { id: '15', startTime: '14:00', endTime: '15:30', day: 4 },
  { id: '16', startTime: '16:00', endTime: '17:00', day: 4 },
  { id: '17', startTime: '10:00', endTime: '11:30', day: 5 },
  { id: '18', startTime: '12:00', endTime: '13:30', day: 5 },
  { id: '19', startTime: '14:30', endTime: '16:00', day: 5 },
  { id: '20', startTime: '11:00', endTime: '12:30', day: 6 },
  { id: '21', startTime: '13:30', endTime: '15:00', day: 6 },
  { id: '22', startTime: '15:30', endTime: '17:00', day: 0 },
];

export const mockTasks: Task[] = [];

export const generateMockSuggestions = (): SmartSuggestion[] => {
  const suggestions: SmartSuggestion[] = [];
  const reasons = [
    'Based on your past productivity patterns, you tend to be more focused during this time.',
    'This slot has fewer interruptions in your schedule.',
    'You\'ve successfully completed similar tasks in this time slot before.',
    'This is aligned with your preferred working hours.',
    'This time is optimal based on the task\'s priority and your energy levels.'
  ];

  // Filter tasks that don't already have a time slot
  const tasksWithoutTimeSlot = mockTasks.filter(task => !task.timeSlot);

  // Create suggestions for tasks without time slots
  for (const task of tasksWithoutTimeSlot) {
    const randomTimeSlotIndex = Math.floor(Math.random() * mockTimeSlots.length);
    const randomReasonIndex = Math.floor(Math.random() * reasons.length);
    const randomEfficiency = Math.floor(Math.random() * 41) + 60; // 60 to 100

    suggestions.push({
      id: uuidv4(),
      taskId: task.id,
      suggestedTimeSlot: mockTimeSlots[randomTimeSlotIndex],
      reason: reasons[randomReasonIndex],
      efficiency: randomEfficiency
    });
  }

  return suggestions;
};

export const mockSuggestions: SmartSuggestion[] = [];

export const generateMockProductivityData = (): ProductivityData[] => {
  const data: ProductivityData[] = [];
  const today = new Date();

  // Generate data for the last 14 days
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const tasksPlanned = Math.floor(Math.random() * 6) + 3; // 3 to 8
    const tasksCompleted = Math.floor(Math.random() * (tasksPlanned + 1)); // 0 to tasksPlanned
    const efficiencyScore = Math.floor((tasksCompleted / tasksPlanned) * 100);

    data.push({
      date,
      tasksPlanned,
      tasksCompleted,
      efficiencyScore
    });
  }

  return data;
};

export const mockProductivityData = generateMockProductivityData();

export const mockUserPreferences: UserPreference = {
  preferredWorkingHours: {
    start: '09:00',
    end: '17:00'
  },
  focusTime: {
    start: '10:00',
    end: '12:00'
  },
  breakPreferences: {
    frequency: 90, // Take a break every 90 minutes
    duration: 15 // Break for 15 minutes
  },
  activeTimeTracking: true,
  productiveTimeSlots: [],
  distractionFreeMode: false
};
