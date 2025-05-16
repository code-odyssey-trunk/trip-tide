import Link from "next/link";
import Image from "next/image";
import { trips } from "@/data/trips";

export default function TripsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Your Trips</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {trips.map(trip => (
          <Link
            key={trip.id}
            href={`/trips/${trip.id}`}
            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="relative h-48 w-full">
              <Image
                src={trip.image}
                alt={trip.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={trip.id === trips[0].id}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-orange-500 transition-colors">
                {trip.title}
              </h2>
              <div className="flex items-center text-gray-600 mb-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{trip.startDate} - {trip.endDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">View Details</span>
                <span className="text-orange-500 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 