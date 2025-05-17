"use client";

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTripStore } from '@/store/tripStore';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import ItineraryFormModal from './ItineraryFormModal';
import { ItineraryItem, ItineraryDay } from '@/data/itineraryDays';
import { Icon } from '@iconify/react';
import Image from 'next/image';

interface ItineraryBoardProps {
  tripId: string;
}

// Helper function to format date for display
const formatDateForDisplay = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

// Helper function to generate days from date range
const generateDaysFromDateRange = (startDate: string, endDate: string): ItineraryDay[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days: ItineraryDay[] = [];
  
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

export default function ItineraryBoard({ tripId }: ItineraryBoardProps) {
  const router = useRouter();
  const { trips, addItem, updateItem, deleteItem, reorderItems, moveItemBetweenDays } = useTripStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    dayId: string;
    item: ItineraryItem;
  } | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const trip = trips.find(t => t.id === tripId);
  
  // Generate days from date range if no days exist
  const days = useMemo(() => {
    if (!trip) return [];
    if (trip.days.length === 0) {
      return generateDaysFromDateRange(trip.startDate, trip.endDate);
    }
    return trip.days;
  }, [trip]);

  if (!trip) {
    router.push('/trips');
    return null;
  }

  const handleBack = () => {
    router.push('/trips');
  };

  const handleSubmitItem = (formData: Omit<ItineraryItem, 'id'>, dayId: string) => {
    if (editingItem) {
      updateItem(tripId, editingItem.dayId, editingItem.item.id, formData);
    } else {
      addItem(tripId, dayId, formData as Omit<ItineraryItem, 'id'>);
    }
  };

  const handleDeleteItem = (dayId: string, itemId: string) => {
    deleteItem(tripId, dayId, itemId);
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === 'item') {
      const sourceDay = days.find(day => day.id === source.droppableId);
      const destDay = days.find(day => day.id === destination.droppableId);
      
      if (!sourceDay || !destDay) return;

      if (source.droppableId === destination.droppableId) {
        // Reordering within the same day
        reorderItems(tripId, source.droppableId, result.draggableId, destination.index);
      } else {
        // Moving to a different day
        const destItems = [...destDay.items];
        
        // Check if the destination day is full
        if (destItems.length >= 6) {
          setWarning('Cannot add more than 6 items to a day');
          if (warningTimeoutRef.current) {
            clearTimeout(warningTimeoutRef.current);
          }
          warningTimeoutRef.current = setTimeout(() => setWarning(null), 3000);
          return;
        }

        // Use the new moveItemBetweenDays function
        moveItemBetweenDays(
          tripId,
          source.droppableId,
          destination.droppableId,
          result.draggableId,
          destination.index
        );
      }
    }
  };

  const getItemStyle = (isDragging: boolean, draggableStyle: React.CSSProperties | undefined) => ({
    ...draggableStyle,
    background: isDragging ? 'white' : 'transparent',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-[256px] rounded-2xl overflow-hidden">
            <Image
              src={trip.image || '/place/default.jpg'}
              alt={trip.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
            
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 p-2 bg-black/30 text-white rounded-full hover:bg-black/40 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              <svg 
                className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Title and Date Range */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {trip.title}
              </h1>
              <div className="flex items-center gap-2 text-white/90">
                <span>{formatDateForDisplay(trip.startDate)}</span>
                <span>-</span>
                <span>{formatDateForDisplay(trip.endDate)}</span>
              </div>
            </div>

            {/* Add Itinerary Button */}
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              <svg 
                className="w-5 h-5 transform group-hover:scale-110 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Itinerary
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pt-[calc(256px+1rem)]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {warning && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {warning}
            </div>
          )}

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {days.map((day, dayIndex) => (
                <div key={day.id} className="bg-white rounded-2xl shadow-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span>Day {dayIndex + 1}</span>
                    <span className="px-2 py-1 text-sm font-medium bg-orange-100 text-orange-600 rounded-full">
                      {formatDateForDisplay(day.date)}
                    </span>
                  </h3>
                  <Droppable droppableId={day.id} type="item">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-3 min-h-[200px]"
                      >
                        {day.items.length === 0 ? (
                          <div className="flex items-center justify-center h-[200px] text-gray-400">
                            <p className="text-center">
                              No itinerary planned for this day
                            </p>
                          </div>
                        ) : (
                          day.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                  className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                      <div className={`${item.iconColor} mt-1`}>
                                        <Icon icon={item.iconName} className="w-5 h-5" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                                        {item.details && (
                                          <p className="text-sm text-gray-500 mt-1">{item.details}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => {
                                          setEditingItem({ dayId: day.id, item });
                                          setIsModalOpen(true);
                                        }}
                                        className="p-1 text-gray-400 hover:text-gray-600"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() => handleDeleteItem(day.id, item.id)}
                                        className="p-1 text-gray-400 hover:text-red-500"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      <ItineraryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmitItem}
        days={days}
        initialData={editingItem?.item}
        dayId={editingItem?.dayId || days[0]?.id || ''}
      />
    </div>
  );
} 