'use client';

import { useEffect, useState } from 'react';
import { useTripStore } from '@/store/tripStore';
import ItineraryBoard from "@/components/ItineraryBoard";
import { Trip } from '@/data/trips';

type PageProps = {
  params: { tripId: string }
}

export default function TripItineraryPage({ params }: PageProps) {
  const { tripId } = params;
  const { trips } = useTripStore();
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const foundTrip = trips.find(t => t.id === tripId);
    setTrip(foundTrip || null);
  }, [trips, tripId]);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Trip not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ItineraryBoard tripId={tripId} />
    </div>
  );
} 