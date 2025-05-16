import { trips } from "@/data/trips";
import ItineraryBoard from "@/components/ItineraryBoard";

export default function TripItineraryPage({ params }: { params: { tripId: string } }) {
  const tripId = params.tripId;
  const trip = trips.find(t => t.id === tripId);
  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Trip not found</div>
      </div>
    );
  }
  // Pass the trip's days and title to ItineraryBoard
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ItineraryBoard initialTitle={trip.title} initialDays={trip.days} />
    </div>
  );
} 