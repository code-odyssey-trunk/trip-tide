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
    startDate: "12 Dec",
    endDate: "15 Dec",
    days: [
      {
        id: "day-1",
        day: "Day 1",
        date: "12 Dec",
        items: [
          {
            id: "item-1",
            type: "Flight",
            iconName: "FaPlaneDeparture",
            iconColor: "text-blue-500",
            title: "Arrive in Kuala Lumpur",
            details: "Flight MH123, 09:00 AM - 12:00 PM, Malaysia Airlines",
          },
          {
            id: "item-2",
            type: "Hotel",
            iconName: "FaHotel",
            iconColor: "text-pink-500",
            title: "Hotel Check-in",
            details: "Check-in: 2:00 PM, Grand Hyatt Kuala Lumpur, +60 3-2182 1234",
          },
          {
            id: "item-3",
            type: "Meal",
            iconName: "FaUtensils",
            iconColor: "text-orange-400",
            title: "Welcome Lunch",
            details: "Lunch at Jalan Alor Food Street",
          },
          {
            id: "item-4",
            type: "Activity",
            iconName: "FaMapMarkerAlt",
            iconColor: "text-green-500",
            title: "Petronas Towers Visit",
            details: "Petronas Towers, 2 hours",
          },
        ],
      },
      {
        id: "day-2",
        day: "Day 2",
        date: "13 Dec",
        items: [
          {
            id: "item-5",
            type: "Activity",
            iconName: "FaMapMarkerAlt",
            iconColor: "text-green-500",
            title: "Batu Caves Tour",
            details: "3 Hours",
          },
          {
            id: "item-6",
            type: "Meal",
            iconName: "FaUtensils",
            iconColor: "text-orange-400",
            title: "Breakfast",
            details: "Breakfast at hotel",
          },
          {
            id: "item-7",
            type: "Activity",
            iconName: "FaShoppingBag",
            iconColor: "text-purple-500",
            title: "Central Market",
            details: "Shopping and sightseeing",
          },
          {
            id: "item-8",
            type: "Meal",
            iconName: "FaUtensils",
            iconColor: "text-orange-400",
            title: "Dinner",
            details: "Dinner at Jalan Petaling (Chinatown)",
          },
        ],
      },
      {
        id: "day-3",
        day: "Day 3",
        date: "14 Dec",
        items: [
          {
            id: "item-9",
            type: "Activity",
            iconName: "FaUmbrellaBeach",
            iconColor: "text-teal-500",
            title: "Day Trip to Langkawi",
            details: "Ferry departs 8:00 AM, Langkawi Beach activities",
          },
          {
            id: "item-10",
            type: "Meal",
            iconName: "FaUtensils",
            iconColor: "text-orange-400",
            title: "Seafood Lunch",
            details: "Lunch at Pantai Cenang",
          },
          {
            id: "item-11",
            type: "Activity",
            iconName: "FaMapMarkerAlt",
            iconColor: "text-green-500",
            title: "Sky Bridge Visit",
            details: "Langkawi Sky Bridge",
          },
          {
            id: "item-12",
            type: "Hotel",
            iconName: "FaHotel",
            iconColor: "text-pink-500",
            title: "Return to Kuala Lumpur Hotel",
            details: "Check-in: 8:00 PM, Grand Hyatt Kuala Lumpur",
          },
        ],
      },
      {
        id: "day-4",
        day: "Day 4",
        date: "15 Dec",
        items: [
          {
            id: "item-13",
            type: "Meal",
            iconName: "FaUtensils",
            iconColor: "text-orange-400",
            title: "Breakfast",
            details: "Breakfast at hotel",
          },
          {
            id: "item-14",
            type: "Activity",
            iconName: "FaMapMarkerAlt",
            iconColor: "text-green-500",
            title: "Lake Gardens Walk",
            details: "Morning walk at Perdana Botanical Gardens",
          },
          {
            id: "item-15",
            type: "Note",
            iconName: "FaStickyNote",
            iconColor: "text-gray-400",
            title: "Pack & Check-out",
            details: "Check-out by 12:00 PM, prepare for departure",
          },
          {
            id: "item-16",
            type: "Flight",
            iconName: "FaPlaneDeparture",
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
    startDate: "10 Jan",
    endDate: "14 Jan",
    days: [
      {
        id: "japan-day-1",
        day: "Day 1",
        date: "10 Jan",
        items: [
          {
            id: "jp-item-1",
            type: "Flight",
            iconName: "FaPlaneDeparture",
            iconColor: "text-blue-500",
            title: "Arrive in Tokyo",
            details: "Flight JL123, 08:00 AM - 3:00 PM, Japan Airlines",
          },
          {
            id: "jp-item-2",
            type: "Hotel",
            iconName: "FaHotel",
            iconColor: "text-pink-500",
            title: "Hotel Check-in",
            details: "Check-in: 4:00 PM, Shinjuku Granbell Hotel",
          },
        ],
      },
      {
        id: "japan-day-2",
        day: "Day 2",
        date: "11 Jan",
        items: [
          {
            id: "jp-item-3",
            type: "Activity",
            iconName: "FaMapMarkerAlt",
            iconColor: "text-green-500",
            title: "Senso-ji Temple",
            details: "Morning visit, 9:00 AM",
          },
          {
            id: "jp-item-4",
            type: "Meal",
            iconName: "FaUtensils",
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