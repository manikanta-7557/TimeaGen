
/**
 * Format time from 24h to 12h format with AM/PM
 */
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Get an array of times at given interval
 */
export const getTimeSlots = (
  startHour: number = 6,
  endHour: number = 22,
  intervalMinutes: number = 30
): string[] => {
  const slots: string[] = [];
  const totalMinutesInDay = 24 * 60;
  const startMinutes = startHour * 60;
  const endMinutes = endHour * 60;

  for (let minutes = startMinutes; minutes <= endMinutes; minutes += intervalMinutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    slots.push(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
  }

  return slots;
};

/**
 * Calculate duration between two time strings
 */
export const calculateDuration = (startTime: string, endTime: string): number => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  return endTotalMinutes - startTotalMinutes;
};

/**
 * Get day name from day number (0-6)
 */
export const getDayName = (day: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day];
};

/**
 * Get short day name from day number (0-6)
 */
export const getShortDayName = (day: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[day];
};

/**
 * Check if two time slots overlap
 */
export const doTimeSlotsOverlap = (slot1: string[], slot2: string[]): boolean => {
  const [start1, end1] = slot1;
  const [start2, end2] = slot2;

  const [startHours1, startMinutes1] = start1.split(':').map(Number);
  const [endHours1, endMinutes1] = end1.split(':').map(Number);
  const [startHours2, startMinutes2] = start2.split(':').map(Number);
  const [endHours2, endMinutes2] = end2.split(':').map(Number);

  const startTotalMinutes1 = startHours1 * 60 + startMinutes1;
  const endTotalMinutes1 = endHours1 * 60 + endMinutes1;
  const startTotalMinutes2 = startHours2 * 60 + startMinutes2;
  const endTotalMinutes2 = endHours2 * 60 + endMinutes2;

  return (
    (startTotalMinutes1 < endTotalMinutes2 && endTotalMinutes1 > startTotalMinutes2) ||
    (startTotalMinutes2 < endTotalMinutes1 && endTotalMinutes2 > startTotalMinutes1)
  );
};

/**
 * Calculate the difference in minutes between two time strings
 */
export const getTimeDifferenceInMinutes = (time1: string, time2: string): number => {
  const [hours1, minutes1] = time1.split(':').map(Number);
  const [hours2, minutes2] = time2.split(':').map(Number);

  const totalMinutes1 = hours1 * 60 + minutes1;
  const totalMinutes2 = hours2 * 60 + minutes2;

  return Math.abs(totalMinutes2 - totalMinutes1);
};

/**
 * Add minutes to a time string
 */
export const addMinutesToTime = (time: string, minutesToAdd: number): string => {
  const [hours, minutes] = time.split(':').map(Number);
  
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
};

/**
 * Get current time in HH:MM format
 */
export const getCurrentTime = (): string => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

/**
 * Format date to human readable format
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Get all days of the current week
 */
export const getDaysOfWeek = (): Date[] => {
  const today = new Date();
  const currentDay = today.getDay();
  const days: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - currentDay + i);
    days.push(date);
  }

  return days;
};
