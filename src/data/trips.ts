export type Trip = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  image_url: string;
  days: {
    id: string;
    day: string;
    date: string;
    items: {
      id: string;
      type: string;
      iconName: string;
      iconColor: string;
      title: string;
      details: string;
    }[];
  }[];
};

export const trips: Trip[] = [
  // Ongoing Trip
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Tokyo Adventure',
    startDate: '2025-05-18',
    endDate: '2025-05-25',
    image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000',
    days: [
      {
        id: 'day-1',
        day: 'Day 1',
        date: '2025-05-18',
        items: [
          {
            id: 'item-1',
            type: 'Transportation',
            iconName: 'mdi:airplane',
            iconColor: 'text-blue-500',
            title: 'Arrival at Narita Airport',
            details: 'Flight JL123, 14:00 - 16:00, Japan Airlines'
          },
          {
            id: 'item-2',
            type: 'Transportation',
            iconName: 'mdi:train',
            iconColor: 'text-blue-500',
            title: 'Narita Express to Tokyo',
            details: '16:30 - 17:45, Reserved seats'
          },
          {
            id: 'item-3',
            type: 'Hotel',
            iconName: 'mdi:bed',
            iconColor: 'text-pink-500',
            title: 'Hotel Check-in',
            details: 'Check-in: 18:00, Shibuya Granbell Hotel'
          },
          {
            id: 'item-4',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Shibuya Crossing',
            details: 'Evening exploration of Shibuya district'
          },
          {
            id: 'item-5',
            type: 'Restaurant',
            iconName: 'mdi:food-fork-drink',
            iconColor: 'text-orange-400',
            title: 'Ichiran Ramen',
            details: 'Dinner at Shibuya branch, 20:00'
          }
        ]
      },
      {
        id: 'day-2',
        day: 'Day 2',
        date: '2025-05-19',
        items: [
          {
            id: 'item-6',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Meiji Shrine',
            details: 'Morning visit, 09:00 - 10:30'
          },
          {
            id: 'item-7',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Yoyogi Park',
            details: 'Stroll through the park, 10:30 - 11:30'
          },
          {
            id: 'item-8',
            type: 'Restaurant',
            iconName: 'mdi:food-fork-drink',
            iconColor: 'text-orange-400',
            title: 'Harajuku Lunch',
            details: 'Takeshita Street food exploration, 12:00 - 13:30'
          },
          {
            id: 'item-9',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Shibuya Sky',
            details: 'Observation deck visit, 14:00 - 16:00'
          }
        ]
      },
      {
        id: 'day-3',
        day: 'Day 3',
        date: '2025-05-20',
        items: [
          {
            id: 'item-10',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Tsukiji Outer Market',
            details: 'Morning market visit, 08:00 - 10:00'
          },
          {
            id: 'item-11',
            type: 'Restaurant',
            iconName: 'mdi:food-fork-drink',
            iconColor: 'text-orange-400',
            title: 'Sushi Breakfast',
            details: 'Fresh sushi at market, 10:00 - 11:00'
          },
          {
            id: 'item-12',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'TeamLab Planets',
            details: 'Interactive art museum, 13:00 - 15:00'
          },
          {
            id: 'item-13',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Odaiba',
            details: 'Evening exploration, 15:30 - 18:00'
          }
        ]
      },
      {
        id: 'day-4',
        day: 'Day 4',
        date: '2025-05-21',
        items: [
          {
            id: 'item-14',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Senso-ji Temple',
            details: 'Morning temple visit, 09:00 - 10:30'
          },
          {
            id: 'item-15',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Asakusa Culture Tour',
            details: 'Traditional district exploration, 10:30 - 12:30'
          },
          {
            id: 'item-16',
            type: 'Restaurant',
            iconName: 'mdi:food-fork-drink',
            iconColor: 'text-orange-400',
            title: 'Tempura Lunch',
            details: 'Asakusa Tempura restaurant, 12:30 - 14:00'
          },
          {
            id: 'item-17',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Tokyo Skytree',
            details: 'Observation deck visit, 14:30 - 16:30'
          }
        ]
      },
      {
        id: 'day-5',
        day: 'Day 5',
        date: '2025-05-22',
        items: [
          {
            id: 'item-18',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Tokyo DisneySea',
            details: 'Full day at theme park, 09:00 - 20:00'
          },
          {
            id: 'item-19',
            type: 'Restaurant',
            iconName: 'mdi:food-fork-drink',
            iconColor: 'text-orange-400',
            title: 'Theme Park Dining',
            details: 'Lunch at Magellan\'s Restaurant'
          }
        ]
      },
      {
        id: 'day-6',
        day: 'Day 6',
        date: '2025-05-23',
        items: [
          {
            id: 'item-20',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Shinjuku Gyoen',
            details: 'Morning garden visit, 09:00 - 11:00'
          },
          {
            id: 'item-21',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Shinjuku Shopping',
            details: 'Department stores exploration, 11:00 - 14:00'
          },
          {
            id: 'item-22',
            type: 'Restaurant',
            iconName: 'mdi:food-fork-drink',
            iconColor: 'text-orange-400',
            title: 'Omoide Yokocho',
            details: 'Evening food alley exploration, 18:00 - 20:00'
          }
        ]
      },
      {
        id: 'day-7',
        day: 'Day 7',
        date: '2025-05-24',
        items: [
          {
            id: 'item-23',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Akihabara',
            details: 'Morning electronics district tour, 10:00 - 13:00'
          },
          {
            id: 'item-24',
            type: 'Restaurant',
            iconName: 'mdi:food-fork-drink',
            iconColor: 'text-orange-400',
            title: 'Maid Cafe Experience',
            details: 'Lunch at @home cafe, 13:00 - 14:30'
          },
          {
            id: 'item-25',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Ghibli Museum',
            details: 'Afternoon visit, 15:00 - 17:00'
          }
        ]
      },
      {
        id: 'day-8',
        day: 'Day 8',
        date: '2025-05-25',
        items: [
          {
            id: 'item-26',
            type: 'Hotel',
            iconName: 'mdi:bed',
            iconColor: 'text-pink-500',
            title: 'Hotel Check-out',
            details: 'Check-out: 11:00, Shibuya Granbell Hotel'
          },
          {
            id: 'item-27',
            type: 'Transportation',
            iconName: 'mdi:train',
            iconColor: 'text-blue-500',
            title: 'Narita Express to Airport',
            details: '12:00 - 13:15, Reserved seats'
          },
          {
            id: 'item-28',
            type: 'Transportation',
            iconName: 'mdi:airplane',
            iconColor: 'text-blue-500',
            title: 'Departure from Narita',
            details: 'Flight JL124, 16:00 - 18:00, Japan Airlines'
          }
        ]
      }
    ]
  },
  // Upcoming Trips
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Paris Getaway',
    startDate: '2025-06-10',
    endDate: '2025-06-10',
    image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1000',
    days: [
      {
        id: 'day-1',
        day: 'Day 1',
        date: '2025-06-10',
        items: [
          {
            id: 'item-1',
            type: 'Transportation',
            iconName: 'mdi:airplane',
            iconColor: 'text-blue-500',
            title: 'Arrival at CDG Airport',
            details: 'Flight AF123, 10:00 - 12:00, Air France'
          },
          {
            id: 'item-2',
            type: 'Hotel',
            iconName: 'mdi:bed',
            iconColor: 'text-pink-500',
            title: 'Hotel Check-in',
            details: 'Check-in: 14:00, Hotel Le Marais'
          },
          {
            id: 'item-3',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Eiffel Tower Visit',
            details: 'Evening visit with dinner reservation'
          }
        ]
      }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Bali Retreat',
    startDate: '2025-07-01',
    endDate: '2025-07-01',
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000',
    days: [
      {
        id: 'day-1',
        day: 'Day 1',
        date: '2025-07-01',
        items: [
          {
            id: 'item-1',
            type: 'Transportation',
            iconName: 'mdi:airplane',
            iconColor: 'text-blue-500',
            title: 'Arrival at Denpasar',
            details: 'Flight GA123, 09:00 - 11:00, Garuda Indonesia'
          },
          {
            id: 'item-2',
            type: 'Hotel',
            iconName: 'mdi:bed',
            iconColor: 'text-pink-500',
            title: 'Resort Check-in',
            details: 'Check-in: 14:00, Ubud Jungle Resort'
          },
          {
            id: 'item-3',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Ubud Monkey Forest',
            details: 'Afternoon visit to the sacred forest'
          }
        ]
      }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: 'New York City Break',
    startDate: '2025-08-15',
    endDate: '2025-08-15',
    image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000',
    days: [
      {
        id: 'day-1',
        day: 'Day 1',
        date: '2025-08-15',
        items: [
          {
            id: 'item-1',
            type: 'Transportation',
            iconName: 'mdi:airplane',
            iconColor: 'text-blue-500',
            title: 'Arrival at JFK',
            details: 'Flight AA123, 08:00 - 10:00, American Airlines'
          },
          {
            id: 'item-2',
            type: 'Hotel',
            iconName: 'mdi:bed',
            iconColor: 'text-pink-500',
            title: 'Hotel Check-in',
            details: 'Check-in: 15:00, Times Square Hotel'
          },
          {
            id: 'item-3',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Times Square',
            details: 'Evening exploration of Times Square'
          }
        ]
      }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Sydney Adventure',
    startDate: '2025-09-01',
    endDate: '2025-09-01',
    image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000',
    days: [
      {
        id: 'day-1',
        day: 'Day 1',
        date: '2025-09-01',
        items: [
          {
            id: 'item-1',
            type: 'Transportation',
            iconName: 'mdi:airplane',
            iconColor: 'text-blue-500',
            title: 'Arrival at SYD',
            details: 'Flight QF123, 06:00 - 08:00, Qantas'
          },
          {
            id: 'item-2',
            type: 'Hotel',
            iconName: 'mdi:bed',
            iconColor: 'text-pink-500',
            title: 'Hotel Check-in',
            details: 'Check-in: 14:00, Circular Quay Hotel'
          },
          {
            id: 'item-3',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Sydney Opera House',
            details: 'Guided tour of the Opera House'
          }
        ]
      }
    ]
  },
  // Past Trips
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'London Christmas',
    startDate: '2024-12-20',
    endDate: '2024-12-20',
    image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000',
    days: [
      {
        id: 'day-1',
        day: 'Day 1',
        date: '2024-12-20',
        items: [
          {
            id: 'item-1',
            type: 'Transportation',
            iconName: 'mdi:airplane',
            iconColor: 'text-blue-500',
            title: 'Arrival at Heathrow',
            details: 'Flight BA123, 08:00 - 10:00, British Airways'
          },
          {
            id: 'item-2',
            type: 'Hotel',
            iconName: 'mdi:bed',
            iconColor: 'text-pink-500',
            title: 'Hotel Check-in',
            details: 'Check-in: 14:00, The Savoy'
          },
          {
            id: 'item-3',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Winter Wonderland',
            details: 'Evening visit to Hyde Park Winter Wonderland'
          }
        ]
      }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: 'Rome History Tour',
    startDate: '2025-02-01',
    endDate: '2025-02-01',
    image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000',
    days: [
      {
        id: 'day-1',
        day: 'Day 1',
        date: '2025-02-01',
        items: [
          {
            id: 'item-1',
            type: 'Transportation',
            iconName: 'mdi:airplane',
            iconColor: 'text-blue-500',
            title: 'Arrival at FCO',
            details: 'Flight AZ123, 10:00 - 12:00, Alitalia'
          },
          {
            id: 'item-2',
            type: 'Hotel',
            iconName: 'mdi:bed',
            iconColor: 'text-pink-500',
            title: 'Hotel Check-in',
            details: 'Check-in: 15:00, Hotel de Russie'
          },
          {
            id: 'item-3',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Colosseum Tour',
            details: 'Afternoon guided tour of the Colosseum'
          }
        ]
      }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    title: 'Barcelona Beach Holiday',
    startDate: '2025-03-15',
    endDate: '2025-03-15',
    image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1000',
    days: [
      {
        id: 'day-1',
        day: 'Day 1',
        date: '2025-03-15',
        items: [
          {
            id: 'item-1',
            type: 'Transportation',
            iconName: 'mdi:airplane',
            iconColor: 'text-blue-500',
            title: 'Arrival at BCN',
            details: 'Flight IB123, 09:00 - 11:00, Iberia'
          },
          {
            id: 'item-2',
            type: 'Hotel',
            iconName: 'mdi:bed',
            iconColor: 'text-pink-500',
            title: 'Hotel Check-in',
            details: 'Check-in: 14:00, Hotel Arts Barcelona'
          },
          {
            id: 'item-3',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Sagrada Familia',
            details: 'Afternoon visit to Gaudi\'s masterpiece'
          }
        ]
      }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    title: 'Amsterdam Weekend',
    startDate: '2025-04-05',
    endDate: '2025-04-05',
    image_url: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=1000',
    days: [
      {
        id: 'day-1',
        day: 'Day 1',
        date: '2025-04-05',
        items: [
          {
            id: 'item-1',
            type: 'Transportation',
            iconName: 'mdi:airplane',
            iconColor: 'text-blue-500',
            title: 'Arrival at AMS',
            details: 'Flight KL123, 08:00 - 10:00, KLM'
          },
          {
            id: 'item-2',
            type: 'Hotel',
            iconName: 'mdi:bed',
            iconColor: 'text-pink-500',
            title: 'Hotel Check-in',
            details: 'Check-in: 14:00, Hotel Pulitzer'
          },
          {
            id: 'item-3',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Canal Cruise',
            details: 'Evening canal cruise through Amsterdam'
          }
        ]
      }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    title: 'Dubai Luxury Stay',
    startDate: '2025-01-10',
    endDate: '2025-01-10',
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000',
    days: [
      {
        id: 'day-1',
        day: 'Day 1',
        date: '2025-01-10',
        items: [
          {
            id: 'item-1',
            type: 'Transportation',
            iconName: 'mdi:airplane',
            iconColor: 'text-blue-500',
            title: 'Arrival at DXB',
            details: 'Flight EK123, 07:00 - 09:00, Emirates'
          },
          {
            id: 'item-2',
            type: 'Hotel',
            iconName: 'mdi:bed',
            iconColor: 'text-pink-500',
            title: 'Hotel Check-in',
            details: 'Check-in: 14:00, Burj Al Arab'
          },
          {
            id: 'item-3',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Burj Khalifa',
            details: 'Evening visit to the world\'s tallest building'
          }
        ]
      }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    title: 'Singapore Food Tour',
    startDate: '2024-11-01',
    endDate: '2024-11-01',
    image_url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1000',
    days: [
      {
        id: 'day-1',
        day: 'Day 1',
        date: '2024-11-01',
        items: [
          {
            id: 'item-1',
            type: 'Transportation',
            iconName: 'mdi:airplane',
            iconColor: 'text-blue-500',
            title: 'Arrival at SIN',
            details: 'Flight SQ123, 08:00 - 10:00, Singapore Airlines'
          },
          {
            id: 'item-2',
            type: 'Hotel',
            iconName: 'mdi:bed',
            iconColor: 'text-pink-500',
            title: 'Hotel Check-in',
            details: 'Check-in: 14:00, Marina Bay Sands'
          },
          {
            id: 'item-3',
            type: 'Activity',
            iconName: 'mdi:map-marker',
            iconColor: 'text-green-500',
            title: 'Hawker Center Tour',
            details: 'Food tour of local hawker centers'
          }
        ]
      }
    ]
  }
]; 