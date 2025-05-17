'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { trips as staticTrips } from '@/data/trips';
import TripFormModal from '@/components/TripFormModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useTripStore } from '@/store/tripStore';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

export default function TripsPage() {
  const { trips, addTrip, updateTrip, deleteTrip } = useTripStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<typeof trips[0] | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    tripId: string;
    tripTitle: string;
  }>({
    isOpen: false,
    tripId: '',
    tripTitle: ''
  });

  useEffect(() => {
    if (trips.length === 0) {
      staticTrips.forEach((trip) => {
        addTrip(trip);
      });
    }
  }, [trips.length, addTrip]);

  const handleSubmitTrip = (tripData: Omit<typeof trips[0], 'id' | 'days'>) => {
    if (editingTrip) {
      updateTrip(editingTrip.id, tripData);
    } else {
      addTrip(tripData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <button
            onClick={() => {
              setEditingTrip(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <svg 
              className="w-5 h-5 transform group-hover:scale-110 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Trip
          </button>
        </div>
        {trips.length !== 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="group relative">
              <Link href={`/trips/${trip.id}`} className="block">
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <Image
                    src={trip.image  || '/place/default.jpg'}
                    alt={trip.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h2 className="text-xl font-bold text-white mb-1">{trip.title}</h2>
                    <div className="flex justify-between items-center">
                      <p className="text-white/90 text-sm">
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </p>
                      <div className="flex items-center text-white/90 text-sm">
                        <span>View Itinerary</span>
                        <svg 
                          className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingTrip(trip);
                    setIsModalOpen(true);
                  }}
                  className="p-2 bg-white/90 rounded-full hover:bg-white shadow-sm"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirmation({
                      isOpen: true,
                      tripId: trip.id,
                      tripTitle: trip.title
                    });
                  }}
                  className="p-2 bg-white/90 rounded-full hover:bg-white shadow-sm"
                >
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        ) :
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-24 h-24 mb-6 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Trips Yet</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Start planning your next adventure by creating a new trip. Add destinations, dates, and build your perfect itinerary.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Trip
          </button>
        </div>
        }


      </div>

      <TripFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTrip(null);
        }}
        onSubmit={handleSubmitTrip}
        onDelete={editingTrip ? () => deleteTrip(editingTrip.id) : undefined}
        initialData={editingTrip || undefined}
      />

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => deleteTrip(deleteConfirmation.tripId)}
        title="Delete Trip"
        message={`Are you sure you want to delete "${deleteConfirmation.tripTitle}"? This action cannot be undone.`}
      />
    </div>
  );
} 