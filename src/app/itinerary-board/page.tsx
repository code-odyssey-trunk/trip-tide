import ItineraryBoard from '@/components/ItineraryBoard';

export default function ItineraryBoardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Itinerary Board</h1>
        <button className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-orange-500 hover:to-orange-600 transition">
          + New Trip
        </button>
      </div>
      <ItineraryBoard />
    </div>
  );
} 