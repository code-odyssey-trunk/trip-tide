'use client';

import { useState, useEffect } from 'react';
import { ItineraryItem, ItineraryDay } from '@/data/itineraryDays';

type ItineraryFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<ItineraryItem, 'id'>, dayId: string) => void;
  days: ItineraryDay[];
  initialData?: ItineraryItem;
  dayId: string;
};

// Helper function to format date for display
const formatDateForDisplay = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

// Helper function to get icon details based on type
const getIconDetails = (type: string): { iconName: string; iconColor: string } => {
  switch (type) {
    case 'Activity':
      return { iconName: 'mdi:map-marker', iconColor: 'text-green-500' };
    case 'Restaurant':
      return { iconName: 'mdi:food-fork-drink', iconColor: 'text-orange-400' };
    case 'Hotel':
      return { iconName: 'mdi:bed', iconColor: 'text-pink-500' };
    case 'Transportation':
      return { iconName: 'mdi:airplane', iconColor: 'text-blue-500' };
    default:
      return { iconName: 'mdi:map-marker', iconColor: 'text-gray-500' };
  }
};

export default function ItineraryFormModal({
  isOpen,
  onClose,
  onSubmit,
  days,
  initialData,
  dayId
}: ItineraryFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Activity',
    details: '',
    dayId: dayId,
    iconName: 'mdi:map-marker',
    iconColor: 'text-green-500'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        type: initialData.type,
        details: initialData.details,
        dayId: dayId,
        iconName: initialData.iconName,
        iconColor: initialData.iconColor
      });
    } else {
      const iconDetails = getIconDetails('Activity');
      setFormData({
        title: '',
        type: 'Activity',
        details: '',
        dayId: dayId,
        iconName: iconDetails.iconName,
        iconColor: iconDetails.iconColor
      });
    }
  }, [initialData, dayId]);

  const handleTypeChange = (type: string) => {
    const iconDetails = getIconDetails(type);
    setFormData(prev => ({
      ...prev,
      type,
      iconName: iconDetails.iconName,
      iconColor: iconDetails.iconColor
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { dayId, ...itemData } = formData;
    onSubmit(itemData, dayId);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'Activity',
      details: '',
      dayId: dayId,
      iconName: 'mdi:map-marker',
      iconColor: 'text-green-500'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Edit Itinerary Item' : 'Add Itinerary Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-900 mb-1">
              Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              required
            >
              <option value="Activity">Activity</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Hotel">Hotel</option>
              <option value="Transportation">Transportation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="day" className="block text-sm font-medium text-gray-900 mb-1">
              Day
            </label>
            <select
              id="day"
              value={formData.dayId}
              onChange={(e) => setFormData(prev => ({ ...prev, dayId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              required
            >
              {days.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.day} - {formatDateForDisplay(day.date)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-900 mb-1">
              Details (Optional)
            </label>
            <textarea
              id="details"
              placeholder="Enter details"
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
            >
              {initialData ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 