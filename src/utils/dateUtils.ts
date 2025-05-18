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