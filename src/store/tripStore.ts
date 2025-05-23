import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Trip } from '@/data/trips';
import { v4 as uuidv4 } from 'uuid';
import { ItineraryItem } from '@/data/itineraryDays';
import { generateDaysFromDateRange } from '@/utils/dateUtils';
import { createClient } from '@/utils/supabase/client';

interface TripState {
  trips: Trip[];
  loading: boolean;
  error: Error | null;
  fetchTrips: () => Promise<void>;
  addTrip: (tripData: Omit<Trip, 'id'> | Omit<Trip, 'id' | 'days'>) => Promise<void>;
  updateTrip: (id: string, tripData: Omit<Trip, 'id' | 'days'>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  addDay: (tripId: string, day: Trip['days'][0]) => void;
  updateDay: (tripId: string, dayId: string, dayData: Partial<Trip['days'][0]>) => void;
  deleteDay: (tripId: string, dayId: string) => void;
  addItem: (tripId: string, dayId: string, item: Omit<ItineraryItem, 'id'>) => void;
  updateItem: (tripId: string, dayId: string, itemId: string, itemData: Partial<Trip['days'][0]['items'][0]>) => void;
  deleteItem: (tripId: string, dayId: string, itemId: string) => void;
  reorderItems: (tripId: string, dayId: string, itemId: string, newIndex: number) => void;
  moveItemBetweenDays: (tripId: string, sourceDayId: string, destDayId: string, itemId: string, newIndex: number) => void;
}

const supabase = createClient();

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      trips: [],
      loading: false,
      error: null,

      fetchTrips: async () => {
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('No user found');

          const { data, error } = await supabase
            .from('trips')
            .select('*')
            .eq('user_id', user.id)
            .order('start_date', { ascending: true });

          if (error) throw error;

          // Transform the data to match our Trip type
          const transformedTrips = data.map(trip => ({
            ...trip,
            startDate: trip.start_date,
            endDate: trip.end_date,
            days: trip.days || generateDaysFromDateRange(trip.start_date, trip.end_date)
          }));

          set({ trips: transformedTrips, loading: false });
        } catch (error) {
          set({ error: error as Error, loading: false });
        }
      },

      addTrip: async (tripData) => {
        console.log('Adding trip:');
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('No user found');

          const newTrip = {
            ...tripData,
            id: ('id' in tripData ? tripData.id : uuidv4()) as string,
            user_id: user.id,
            start_date: tripData.startDate,
            end_date: tripData.endDate,
            days: 'days' in tripData ? tripData.days : generateDaysFromDateRange(tripData.startDate, tripData.endDate)
          };

          const { error } = await supabase
            .from('trips')
            .insert([{
              id: newTrip.id,
              user_id: newTrip.user_id,
              title: newTrip.title,
              start_date: newTrip.start_date,
              end_date: newTrip.end_date,
              image_url: newTrip.image_url,
              days: newTrip.days
            }]);

          if (error) throw error;

          set((state) => ({
            trips: [...state.trips, newTrip],
            loading: false
          }));
        } catch (error) {
          set({ error: error as Error, loading: false });
        }
      },

      updateTrip: async (id, tripData) => {
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('No user found');

          const trip = get().trips.find(t => t.id === id);
          if (!trip) throw new Error('Trip not found');

          // If dates are being updated, regenerate days
          let days = trip.days;
          if (tripData.startDate || tripData.endDate) {
            const newStartDate = tripData.startDate || trip.startDate;
            const newEndDate = tripData.endDate || trip.endDate;
            const allDays = generateDaysFromDateRange(newStartDate, newEndDate);
            
            // Preserve existing items for days that still exist
            days = allDays.map(generatedDay => {
              const existingDay = trip.days.find(d => d.date === generatedDay.date);
              if (existingDay) {
                return {
                  ...existingDay,
                  id: generatedDay.id
                };
              }
              return generatedDay;
            });
          }

          const { error } = await supabase
            .from('trips')
            .update({
              title: tripData.title,
              start_date: tripData.startDate,
              end_date: tripData.endDate,
              image_url: tripData.image_url,
              days: days
            })
            .eq('id', id)
            .eq('user_id', user.id);

          if (error) throw error;

          set((state) => ({
            trips: state.trips.map(trip => 
              trip.id === id 
                ? { 
                    ...trip, 
                    ...tripData,
                    days
                  }
                : trip
            ),
            loading: false
          }));
        } catch (error) {
          set({ error: error as Error, loading: false });
        }
      },

      deleteTrip: async (id) => {
        set({ loading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('No user found');

          const { error } = await supabase
            .from('trips')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

          if (error) throw error;

          set((state) => ({
            trips: state.trips.filter(trip => trip.id !== id),
            loading: false
          }));
        } catch (error) {
          set({ error: error as Error, loading: false });
        }
      },

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
    }
  )
); 