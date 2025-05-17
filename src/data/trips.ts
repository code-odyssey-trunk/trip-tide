import { ItineraryDay } from "./itineraryDays";

export type Trip = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
  image: string;
};

export const trips: Trip[] = [
  {
    id: "malaysia-2024",
    title: "Trip to Malaysia",
    startDate: "2024-12-12",
    endDate: "2024-12-15",
    days: [
      {
        id: "day-1",
        day: "Day 1",
        date: "2024-12-12",
        items: [
          {
            id: "item-1",
            type: "Transportation",
            iconName: "mdi:airplane",
            iconColor: "text-blue-500",
            title: "Arrive in Kuala Lumpur",
            details: "Flight MH123, 09:00 AM - 12:00 PM, Malaysia Airlines",
          },
          {
            id: "item-2",
            type: "Hotel",
            iconName: "mdi:bed",
            iconColor: "text-pink-500",
            title: "Hotel Check-in",
            details: "Check-in: 2:00 PM, Grand Hyatt Kuala Lumpur, +60 3-2182 1234",
          },
          {
            id: "item-3",
            type: "Restaurant",
            iconName: "mdi:food-fork-drink",
            iconColor: "text-orange-400",
            title: "Welcome Lunch",
            details: "Lunch at Jalan Alor Food Street",
          },
          {
            id: "item-4",
            type: "Activity",
            iconName: "mdi:map-marker",
            iconColor: "text-green-500",
            title: "Petronas Towers Visit",
            details: "Petronas Towers, 2 hours",
          },
        ],
      },
      {
        id: "day-2",
        day: "Day 2",
        date: "2024-12-13",
        items: [
          {
            id: "item-5",
            type: "Activity",
            iconName: "mdi:map-marker",
            iconColor: "text-green-500",
            title: "Batu Caves Tour",
            details: "3 Hours",
          },
          {
            id: "item-6",
            type: "Restaurant",
            iconName: "mdi:food-fork-drink",
            iconColor: "text-orange-400",
            title: "Breakfast",
            details: "Breakfast at hotel",
          },
          {
            id: "item-7",
            type: "Activity",
            iconName: "mdi:map-marker",
            iconColor: "text-green-500",
            title: "Central Market",
            details: "Shopping and sightseeing",
          },
          {
            id: "item-8",
            type: "Restaurant",
            iconName: "mdi:food-fork-drink",
            iconColor: "text-orange-400",
            title: "Dinner",
            details: "Dinner at Jalan Petaling (Chinatown)",
          },
        ],
      },
      {
        id: "day-3",
        day: "Day 3",
        date: "2024-12-14",
        items: [
          {
            id: "item-9",
            type: "Activity",
            iconName: "mdi:map-marker",
            iconColor: "text-green-500",
            title: "Day Trip to Langkawi",
            details: "Ferry departs 8:00 AM, Langkawi Beach activities",
          },
          {
            id: "item-10",
            type: "Restaurant",
            iconName: "mdi:food-fork-drink",
            iconColor: "text-orange-400",
            title: "Seafood Lunch",
            details: "Lunch at Pantai Cenang",
          },
          {
            id: "item-11",
            type: "Activity",
            iconName: "mdi:map-marker",
            iconColor: "text-green-500",
            title: "Sky Bridge Visit",
            details: "Langkawi Sky Bridge",
          },
          {
            id: "item-12",
            type: "Hotel",
            iconName: "mdi:bed",
            iconColor: "text-pink-500",
            title: "Return to Kuala Lumpur Hotel",
            details: "Check-in: 8:00 PM, Grand Hyatt Kuala Lumpur",
          },
        ],
      },
      {
        id: "day-4",
        day: "Day 4",
        date: "2024-12-15",
        items: [
          {
            id: "item-13",
            type: "Restaurant",
            iconName: "mdi:food-fork-drink",
            iconColor: "text-orange-400",
            title: "Breakfast",
            details: "Breakfast at hotel",
          },
          {
            id: "item-14",
            type: "Activity",
            iconName: "mdi:map-marker",
            iconColor: "text-green-500",
            title: "Lake Gardens Walk",
            details: "Morning walk at Perdana Botanical Gardens",
          },
          {
            id: "item-15",
            type: "Other",
            iconName: "mdi:map-marker",
            iconColor: "text-gray-500",
            title: "Pack & Check-out",
            details: "Check-out by 12:00 PM, prepare for departure",
          },
          {
            id: "item-16",
            type: "Transportation",
            iconName: "mdi:airplane",
            iconColor: "text-blue-500",
            title: "Departure",
            details: "Flight MH456, 4:00 PM, Malaysia Airlines",
          },
        ],
      },
    ],
    image: "/place/malaysia.jpg",
  },
  {
    id: "japan-2025",
    title: "Japan Adventure",
    startDate: "2025-01-10",
    endDate: "2025-01-11",
    days: [
      {
        id: "japan-day-1",
        day: "Day 1",
        date: "2025-01-10",
        items: [
          {
            id: "jp-item-1",
            type: "Transportation",
            iconName: "mdi:airplane",
            iconColor: "text-blue-500",
            title: "Arrive in Tokyo",
            details: "Flight JL123, 08:00 AM - 3:00 PM, Japan Airlines",
          },
          {
            id: "jp-item-2",
            type: "Hotel",
            iconName: "mdi:bed",
            iconColor: "text-pink-500",
            title: "Hotel Check-in",
            details: "Check-in: 4:00 PM, Shinjuku Granbell Hotel",
          },
        ],
      },
      {
        id: "japan-day-2",
        day: "Day 2",
        date: "2025-01-11",
        items: [
          {
            id: "jp-item-3",
            type: "Activity",
            iconName: "mdi:map-marker",
            iconColor: "text-green-500",
            title: "Senso-ji Temple",
            details: "Morning visit, 9:00 AM",
          },
          {
            id: "jp-item-4",
            type: "Restaurant",
            iconName: "mdi:food-fork-drink",
            iconColor: "text-orange-400",
            title: "Sushi Lunch",
            details: "Tsukiji Fish Market",
          },
        ],
      },
    ],
    image: "/place/japan-1.jpg",
  },
]; 