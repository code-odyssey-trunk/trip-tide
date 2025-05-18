import { Trip } from '@/data/trips';

export const formatDateForDisplay = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const getTripStatus = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now > end) {
    return {
      text: 'Completed',
      color: 'bg-gray-100 text-gray-800'
    };
  } else if (now >= start && now <= end) {
    return {
      text: 'Ongoing',
      color: 'bg-green-100 text-green-800'
    };
  } else {
    return {
      text: 'Upcoming',
      color: 'bg-blue-100 text-blue-800'
    };
  }
};

export const generateDaysFromDateRange = (startDate: string, endDate: string): Trip['days'] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days: Trip['days'] = [];
  
  const currentDate = new Date(start);
  let dayIndex = 1;
  
  while (currentDate <= end) {
    days.push({
      id: `day-${dayIndex}`,
      day: `Day ${dayIndex}`,
      date: currentDate.toISOString().split('T')[0],
      items: []
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
    dayIndex++;
  }
  
  return days;
}; 

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const getTripState = (startDate: string, endDate: string) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(startDate);
  const startNormalized = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const end = new Date(endDate);
  const endNormalized = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  if (today > endNormalized) {
    return 'past';
  } else if (today >= startNormalized && today <= endNormalized) {
    return 'ongoing';
  } else {
    return 'upcoming';
  }
};