export const QR_LOCATIONS = [
  {
    id: 'bike_rack',
    name: 'TCET Main Bike Rack',
    icon: '🚲',
    description: 'Log a cycle commute to campus with maximum trust score.',
    payload: {
      commuteMode: 'cycle',
      commuteDistanceKm: 5,
      source: 'qr',
      locationName: 'TCET Main Bike Rack'
    }
  },
  {
    id: 'canteen_counter',
    name: 'TCET Green Canteen Counter',
    icon: '🥦',
    description: 'Log a organic vegan meal at the college canteen.',
    payload: {
      dietType: 'vegan',
      mealsCount: 1,
      source: 'qr',
      locationName: 'TCET Green Canteen Counter'
    }
  },
  {
    id: 'recycling_bin',
    name: 'TCET Smart Recycling Hub',
    icon: '♻️',
    description: 'Verify waste recycling & turn off appliances to save energy.',
    payload: {
      energyUsageHours: 0,
      source: 'qr',
      locationName: 'TCET Smart Recycling Hub'
    }
  },
  {
    id: 'library_reading_room',
    name: 'TCET Central Library Reading Room',
    icon: '📖',
    description: 'Log low-energy reading/study hours at the library.',
    payload: {
      energyUsageHours: 1,
      source: 'qr',
      locationName: 'TCET Central Library Reading Room'
    }
  },
  {
    id: 'sports_ground',
    name: 'TCET Sports Ground',
    icon: '🚶',
    description: 'Log a walking commute/workout around campus.',
    payload: {
      commuteMode: 'walk',
      commuteDistanceKm: 2,
      source: 'qr',
      locationName: 'TCET Sports Ground'
    }
  }
];
