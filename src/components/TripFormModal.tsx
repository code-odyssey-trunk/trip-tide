'use client';

import { useState, useEffect, useRef } from 'react';
import { Trip } from '@/data/trips';
import Image from 'next/image';

type TripFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tripData: Omit<Trip, 'id' | 'days'>) => void;
  onDelete?: () => void;
  initialData?: Trip;
};

export default function TripFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: TripFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showDateWarning, setShowDateWarning] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        image: initialData.image
      });
      setImagePreview(initialData.image);
    } else {
      // Set default dates for new trips
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setFormData({
        title: '',
        startDate: today.toISOString().split('T')[0],
        endDate: tomorrow.toISOString().split('T')[0],
        image: ''
      });
      setImagePreview('');
    }
    setDateError(null);
  }, [initialData, isOpen]);

  const validateDates = (startDate: string, endDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    if (start < today) {
      setDateError("Please select today or a future date");
      return false;
    }

    if (end < start) {
      setDateError("End date must be after start date");
      return false;
    }

    setDateError(null);
    return true;
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFormData = { ...formData, [field]: value };
    
    if (initialData && (value !== initialData[field])) {
      setShowDateWarning(true);
    }

    // If start date is changed and is later than end date, adjust end date
    if (field === 'startDate') {
      const start = new Date(value);
      const end = new Date(formData.endDate);
      
      if (start > end) {
        // Set end date to next day after start date
        const nextDay = new Date(start);
        nextDay.setDate(nextDay.getDate() + 1);
        newFormData.endDate = nextDay.toISOString().split('T')[0];
      }
    }

    // Validate dates when either field changes
    validateDates(
      field === 'startDate' ? value : formData.startDate,
      field === 'endDate' ? value : newFormData.endDate
    );

    setFormData(newFormData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Convert the file to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDates(formData.startDate, formData.endDate)) {
      return;
    }

    onSubmit(formData);
    onClose();
  };

  const handleClose = () => {
    setShowDateWarning(false);
    setDateError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Edit Trip' : 'Create New Trip'}
          </h2>
          <button
            onClick={handleClose}
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
              Trip Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-900 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-900 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                min={formData.startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
          </div>

          {dateError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 text-sm text-red-700">
                  <p>{dateError}</p>
                </div>
              </div>
            </div>
          )}

          {showDateWarning && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Changing the trip dates may result in loss of itinerary items for dates that are removed. Please make sure to review your itinerary after saving.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Cover Image
            </label>
            <div 
              className="relative h-48 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <Image
                    src={imagePreview}
                    alt="Trip cover preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold drop-shadow">Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-700">Click to upload an image</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
            >
              {initialData ? 'Save Changes' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 