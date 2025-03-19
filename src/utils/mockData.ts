
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

// Generate random tasks with different states
export const generateMockTasks = (): Task[] => {
  const tasks: Task[] = [];
  const titles = [
    'Complete project proposal',
    'Review code changes',
    'Prepare presentation',
    'Client meeting',
    'Weekly team sync',
    'Research new technologies',
    'Workout session',
    'Read book chapter',
    'Plan weekly meals',
    'Study for exam',
    'Call parents',
    'Doctor appointment',
    'Write blog post',
    'Update portfolio',
    'Grocery shopping'
  ];

  const descriptions = [
    'Need to finalize all the details and send to the client',
    'Go through the pull requests and provide feedback',
    'Create slides for the next team meeting',
    'Discuss project status and next steps',
    'Update the team on progress and blockers',
    'Look into new frameworks that could improve our workflow',
    'Focus on cardio and strength training',
    'Continue reading the current book',
    'Plan and prepare meals for the week',
    'Review all study materials and practice problems',
    'Catch up with family',
    'Regular health checkup',
    'Write content for the personal blog',
    'Add recent projects and update skills',
    'Get essentials for the week'
  ];

  const priorities = ['low', 'medium', 'high'] as const;

  // Create tasks
  for (let i = 0; i < 10; i++) {
    const randomTitleIndex = Math.floor(Math.random() * titles.length);
    const randomDescIndex = Math.floor(Math.random() * descriptions.length);
    const randomPriorityIndex = Math.floor(Math.random() * priorities.length);
    const randomCategoryIndex = Math.floor(Math.random() * mockCategories.length);
    const randomDuration = Math.floor(Math.random() * 120) + 30; // 30 to 150 minutes
    const randomProgress = Math.floor(Math.random() * 101); // 0 to 100
    const randomCompleted = Math.random() > 0.7;

    // Add some tasks with time slots assigned
    const hasTimeSlot = Math.random() > 0.4;
    const timeSlot = hasTimeSlot 
      ? mockTimeSlots[Math.floor(Math.random() * mockTimeSlots.length)] 
      : undefined;

    // Create due date between now and 14 days in the future
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 1);

    tasks.push({
      id: uuidv4(),
      title: titles[randomTitleIndex],
      description: descriptions[randomDescIndex],
      duration: randomDuration,
      priority: priorities[randomPriorityIndex],
      completed: randomCompleted,
      timeSlot,
      progress: randomCompleted ? 100 : randomProgress,
      category: mockCategories[randomCategoryIndex].id,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)), // Within last week
      dueDate: Math.random() > 0.2 ? dueDate : undefined,
    });
  }

  return tasks;
};

export const mockTasks = generateMockTasks();

// Generate smart suggestions
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

export const mockSuggestions = generateMockSuggestions();

// Generate productivity data for analytics
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

// Mock user preferences
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
  }
};
