"use client";

import { useState, useRef, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTripStore } from '@/store/tripStore';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import ItineraryFormModal from './ItineraryFormModal';
import { ItineraryItem, ItineraryDay } from '@/data/itineraryDays';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { formatDate, getTripStatus } from '@/utils/dateUtils';

interface ItineraryBoardProps {
  tripId: string;
}

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
  const {
    trips,
    deleteItem,
    moveItemBetweenDays,
    reorderItems,
    updateItem,
    addItem
  } = useTripStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    dayId: string;
    item: ItineraryItem;
  } | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState<ItineraryDay | null>(null);
  const [isPastTrip, setIsPastTrip] = useState(false);
  const [isDayLocked, setIsDayLocked] = useState(false);

  const trip = trips.find(t => t.id === tripId);
  
  // Generate days from date range if no days exist
  const days = useMemo(() => {
    if (!trip) return [];
    if (trip.days.length === 0) {
      return generateDaysFromDateRange(trip.startDate, trip.endDate);
    }
    return trip.days;
  }, [trip]);

  useEffect(() => {
    if (trip) {
      setIsPastTrip(new Date(trip.endDate) < new Date());
    }
  }, [trip]);

  if (!trip) {
    router.push('/');
    return null;
  }

  const handleBack = () => {
    router.push('/');
  };

  const handleDeleteItem = (dayId: string, itemId: string) => {
    if (isPastTrip) {
      toast.error("Cannot modify past trips");
      return;
    }
    if (!trip) return;
    deleteItem(trip.id, dayId, itemId);
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

  const handleDrop = (e: React.DragEvent, dayId: string) => {
    if (isPastTrip) {
      e.preventDefault();
      toast.error("Cannot modify past trips");
      return;
    }
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    if (!trip) return;
    moveItemBetweenDays(trip.id, e.dataTransfer.getData('sourceDayId'), dayId, itemId, 0);
  };

  const handleAddItem = (dayId: string) => {
    if (isPastTrip) {
      toast.error("Cannot modify past trips");
      return;
    }
    const day = days.find(d => d.id === dayId);
    if (day) {
      setSelectedDay(day);
      setIsDayLocked(true);
      setIsModalOpen(true);
    }
  };

  const handleEditItem = (dayId: string, item: ItineraryItem) => {
    if (isPastTrip) {
      toast.error("Cannot modify past trips");
      return;
    }
    setSelectedDay(days.find(day => day.id === dayId) || null);
    setEditingItem({ dayId, item });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-500">TripTide</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-500 font-medium">JD</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">john@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Compact Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 py-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={trip.image || '/place/default.jpg'}
                  alt={trip.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{trip.title}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatDate(trip.startDate)}</span>
                  <span>-</span>
                  <span>{formatDate(trip.endDate)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTripStatus(trip.startDate, trip.endDate).color}`}>
                {getTripStatus(trip.startDate, trip.endDate).text}
              </span>
              {!isPastTrip && (
                <button
                  onClick={() => {
                    setSelectedDay(days[0] || null);
                    setIsDayLocked(false);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Itinerary
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Trip Details */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Trip Duration
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-gray-500">{formatDate(trip.startDate)}</span>
              <span>-</span>
              <span className="text-gray-500">{formatDate(trip.endDate)}</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Days
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-gray-500">{trip.days.length}</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Activities
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-gray-500">
                {trip.days.reduce((acc, day) => acc + day.items.length, 0)}
              </span>
            </div>
          </div>
        </div>

        {warning && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {warning}
          </div>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {days.map((day, dayIndex) => (
              <div
                key={day.id}
                className="bg-white rounded-lg shadow-lg border border-gray-200 p-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, day.id)}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span>Day {dayIndex + 1}</span>
                    <span className="px-2 py-1 text-sm font-medium bg-orange-100 text-orange-600 rounded-full">
                      {formatDate(day.date)}
                    </span>
                  </h3>
                  {!isPastTrip && (
                    <button
                      onClick={() => handleAddItem(day.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}
                </div>
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
                            isDragDisabled={isPastTrip}
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
                                  {!isPastTrip && (
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditItem(day.id, item);
                                        }}
                                        className="p-1 text-gray-400 hover:text-gray-600"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteItem(day.id, item.id);
                                        }}
                                        className="p-1 text-gray-400 hover:text-red-500"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </div>
                                  )}
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

      <ItineraryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
          setSelectedDay(null);
          setIsDayLocked(false);
        }}
        onSubmit={(itemData) => {
          if (editingItem) {
            // Update existing item
            updateItem(trip.id, editingItem.dayId, editingItem.item.id, itemData);
          } else if (selectedDay) {
            // Add new item
            addItem(trip.id, selectedDay.id, itemData);
          }
          setIsModalOpen(false);
          setEditingItem(null);
          setSelectedDay(null);
          setIsDayLocked(false);
        }}
        days={trip.days}
        initialData={editingItem?.item}
        dayId={selectedDay?.id || days[0]?.id || ''}
        isDayLocked={isDayLocked}
      />
    </div>
  );
} 