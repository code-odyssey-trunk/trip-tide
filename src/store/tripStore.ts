import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Trip, trips as staticTrips } from '@/data/trips';
import { v4 as uuidv4 } from 'uuid';
import { ItineraryItem } from '@/data/itineraryDays';

interface TripState {
  trips: Trip[];
  addTrip: (tripData: Omit<Trip, 'id' | 'days'>) => void;
  updateTrip: (id: string, tripData: Omit<Trip, 'id' | 'days'>) => void;
  deleteTrip: (id: string) => void;
  addDay: (tripId: string, day: Trip['days'][0]) => void;
  updateDay: (tripId: string, dayId: string, dayData: Partial<Trip['days'][0]>) => void;
  deleteDay: (tripId: string, dayId: string) => void;
  addItem: (tripId: string, dayId: string, item: Omit<ItineraryItem, 'id'>) => void;
  updateItem: (tripId: string, dayId: string, itemId: string, itemData: Partial<Trip['days'][0]['items'][0]>) => void;
  deleteItem: (tripId: string, dayId: string, itemId: string) => void;
  reorderItems: (tripId: string, dayId: string, itemId: string, newIndex: number) => void;
  moveItemBetweenDays: (tripId: string, sourceDayId: string, destDayId: string, itemId: string, newIndex: number) => void;
}

// Helper function to generate days from date range
const generateDaysFromDateRange = (startDate: string, endDate: string): Trip['days'] => {
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

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      trips: staticTrips.map(staticTrip => {
        // Generate all days from date range
        const allDays = generateDaysFromDateRange(staticTrip.startDate, staticTrip.endDate);
        
        // If trip has predefined days, merge them with the generated days
        if (staticTrip.days.length > 0) {
          const mergedDays = allDays.map(generatedDay => {
            // Find if there's a matching predefined day
            const predefinedDay = staticTrip.days.find(d => d.date === generatedDay.date);
            if (predefinedDay) {
              // Use the predefined day's data but keep the generated day's ID
              return {
                ...predefinedDay,
                id: generatedDay.id
              };
            }
            // If no predefined day exists, use the generated empty day
            return generatedDay;
          });
          
          return {
            ...staticTrip,
            days: mergedDays
          };
        }
        
        // For trips without predefined days, use the generated days
        return {
          ...staticTrip,
          days: allDays
        };
      }),
      
      addTrip: (tripData) => set((state) => {
        const newTrip: Trip = {
          ...tripData,
          id: 'id' in tripData ? tripData.id as string : uuidv4(),
          days: generateDaysFromDateRange(tripData.startDate, tripData.endDate)
        };
        
        // If tripData has an id, check if it exists
        if ('id' in tripData) {
          const exists = state.trips.some(trip => trip.id === tripData.id);
          if (exists) return state;
        }
        
        return {
          trips: [...state.trips, newTrip]
        };
      }),

      updateTrip: (id, tripData) => set((state) => {
        const trip = state.trips.find(t => t.id === id);
        if (!trip) return state;

        // If dates are being updated, regenerate days
        if (tripData.startDate || tripData.endDate) {
          const newStartDate = tripData.startDate || trip.startDate;
          const newEndDate = tripData.endDate || trip.endDate;
          const allDays = generateDaysFromDateRange(newStartDate, newEndDate);
          
          // Preserve existing items for days that still exist
          const mergedDays = allDays.map(generatedDay => {
            const existingDay = trip.days.find(d => d.date === generatedDay.date);
            if (existingDay) {
              return {
                ...existingDay,
                id: generatedDay.id
              };
            }
            return generatedDay;
          });

          return {
            trips: state.trips.map(trip => 
              trip.id === id 
                ? { 
                    ...trip, 
                    ...tripData,
                    days: mergedDays
                  }
                : trip
            )
          };
        }

        // If dates aren't being updated, just update other fields
        return {
          trips: state.trips.map(trip => 
            trip.id === id ? { ...trip, ...tripData } : trip
          )
        };
      }),

      deleteTrip: (id) => set((state) => ({
        trips: state.trips.filter(trip => trip.id !== id)
      })),

      addDay: (tripId, day) => set((state) => ({
        trips: state.trips.map(trip => 
          trip.id === tripId 
            ? { ...trip, days: [...trip.days, { ...day, id: uuidv4() }] }
            : trip
        )
      })),

      updateDay: (tripId, dayId, dayData) => set((state) => ({
        trips: state.trips.map(trip => 
          trip.id === tripId 
            ? {
                ...trip,
                days: trip.days.map(day =>
                  day.id === dayId ? { ...day, ...dayData } : day
                )
              }
            : trip
        )
      })),

      deleteDay: (tripId, dayId) => set((state) => ({
        trips: state.trips.map(trip => 
          trip.id === tripId 
            ? { ...trip, days: trip.days.filter(day => day.id !== dayId) }
            : trip
        )
      })),

      addItem: (tripId, dayId, item) => set((state) => {
        const trip = state.trips.find(t => t.id === tripId);
        if (!trip) return state;

        const day = trip.days.find(d => d.id === dayId);
        if (!day) return state;

        // Check if the day already has 6 items
        if (day.items.length >= 6) return state;

        const newItem = { ...item, id: uuidv4() };
        
        return {
          trips: state.trips.map(trip => 
            trip.id === tripId 
              ? {
                  ...trip,
                  days: trip.days.map(day =>
                    day.id === dayId 
                      ? { ...day, items: [...day.items, newItem] }
                      : day
                  )
                }
              : trip
          )
        };
      }),

      updateItem: (tripId, dayId, itemId, itemData) => set((state) => ({
        trips: state.trips.map(trip => 
          trip.id === tripId 
            ? {
                ...trip,
                days: trip.days.map(day =>
                  day.id === dayId 
                    ? {
                        ...day,
                        items: day.items.map(item =>
                          item.id === itemId ? { ...item, ...itemData } : item
                        )
                      }
                    : day
                )
              }
            : trip
        )
      })),

      deleteItem: (tripId, dayId, itemId) => set((state) => ({
        trips: state.trips.map(trip => 
          trip.id === tripId 
            ? {
                ...trip,
                days: trip.days.map(day =>
                  day.id === dayId 
                    ? { ...day, items: day.items.filter(item => item.id !== itemId) }
                    : day
                )
              }
            : trip
        )
      })),

      reorderItems: (tripId, dayId, itemId, newIndex) => set((state) => {
        const trip = state.trips.find(t => t.id === tripId);
        if (!trip) return state;

        const day = trip.days.find(d => d.id === dayId);
        if (!day) return state;

        const itemIndex = day.items.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return state;

        const newItems = [...day.items];
        const [movedItem] = newItems.splice(itemIndex, 1);
        newItems.splice(newIndex, 0, movedItem);

        return {
          trips: state.trips.map(trip => 
            trip.id === tripId 
              ? {
                  ...trip,
                  days: trip.days.map(day =>
                    day.id === dayId 
                      ? { ...day, items: newItems }
                      : day
                  )
                }
              : trip
          )
        };
      }),

      moveItemBetweenDays: (tripId, sourceDayId, destDayId, itemId, newIndex) => set((state) => {
        const trip = state.trips.find(t => t.id === tripId);
        if (!trip) return state;

        const sourceDay = trip.days.find(d => d.id === sourceDayId);
        const destDay = trip.days.find(d => d.id === destDayId);
        if (!sourceDay || !destDay) return state;

        const itemIndex = sourceDay.items.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return state;

        // Get the item to move
        const [movedItem] = sourceDay.items.splice(itemIndex, 1);
        
        // Create new arrays for both days
        const newSourceItems = [...sourceDay.items];
        const newDestItems = [...destDay.items];
        
        // Insert the item at the specified index in the destination day
        newDestItems.splice(newIndex, 0, movedItem);

        return {
          trips: state.trips.map(trip => 
            trip.id === tripId 
              ? {
                  ...trip,
                  days: trip.days.map(day => {
                    if (day.id === sourceDayId) {
                      return { ...day, items: newSourceItems };
                    }
                    if (day.id === destDayId) {
                      return { ...day, items: newDestItems };
                    }
                    return day;
                  })
                }
              : trip
          )
        };
      })
    }),
    {
      name: 'trip-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // This is important for Next.js
    }
  )
); 