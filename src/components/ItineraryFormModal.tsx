'use client';

import { useState, useEffect } from 'react';
import { ItineraryItem, ItineraryDay } from '@/data/itineraryDays';
import { IconName } from '@/data/iconMap';

type ItineraryFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<ItineraryItem, 'id'>, dayId: string) => void;
  initialData?: ItineraryItem;
  dayId: string;
  days: ItineraryDay[];
};

const ITEM_TYPES = [
  { type: 'Flight', icon: 'FaPlaneDeparture', color: 'text-blue-500' },
  { type: 'Hotel', icon: 'FaHotel', color: 'text-pink-500' },
  { type: 'Meal', icon: 'FaUtensils', color: 'text-orange-400' },
  { type: 'Activity', icon: 'FaMapMarkerAlt', color: 'text-green-500' },
  { type: 'Note', icon: 'FaStickyNote', color: 'text-gray-400' },
  { type: 'Beach', icon: 'FaUmbrellaBeach', color: 'text-teal-500' },
  { type: 'Shopping', icon: 'FaShoppingBag', color: 'text-purple-500' },
];

export default function ItineraryFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  dayId,
  days
}: ItineraryFormModalProps) {
  const [formData, setFormData] = useState<Omit<ItineraryItem, 'id'> & { selectedDayId: string }>({
    type: '',
    iconName: 'FaMapMarkerAlt' as IconName,
    iconColor: 'text-green-500',
    title: '',
    details: '',
    selectedDayId: dayId,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        iconName: initialData.iconName,
        iconColor: initialData.iconColor,
        title: initialData.title,
        details: initialData.details,
        selectedDayId: dayId,
      });
    } else {
      setFormData(prev => ({
        ...prev,
        selectedDayId: dayId,
      }));
    }
  }, [initialData, dayId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { selectedDayId, ...itemData } = formData;
    onSubmit(itemData, selectedDayId);
    onClose();
  };

  const handleTypeChange = (type: string) => {
    const selectedType = ITEM_TYPES.find(t => t.type === type);
    if (selectedType) {
      setFormData(prev => ({
        ...prev,
        type,
        iconName: selectedType.icon as IconName,
        iconColor: selectedType.color,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Edit Itinerary' : 'Add Itinerary'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Day
            </label>
            <select
              value={formData.selectedDayId}
              onChange={(e) => setFormData(prev => ({ ...prev, selectedDayId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              required
            >
              {days.map((day) => (
                <option key={day.id} value={day.id} className="text-gray-900">
                  {day.day} - {day.date}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              required
            >
              <option value="" className="text-gray-500">Select a type</option>
              {ITEM_TYPES.map((item) => (
                <option key={item.type} value={item.type} className="text-gray-900">
                  {item.type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-500"
              placeholder="Enter title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details
            </label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-24 text-gray-900 placeholder-gray-500"
              placeholder="Enter details"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
            >
              {initialData ? 'Update' : 'Add'} Itinerary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 