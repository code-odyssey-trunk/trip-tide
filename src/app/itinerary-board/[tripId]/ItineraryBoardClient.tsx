'use client';

import { useRouter } from 'next/navigation';
import ItineraryBoard from '@/components/ItineraryBoard';

type Props = {
  tripId: string;
}

export default function ItineraryBoardClient({ tripId }: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      </div>
      <ItineraryBoard tripId={tripId} />
    </div>
  );
} 