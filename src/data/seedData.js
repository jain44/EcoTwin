import { calculateDailyFootprint } from '../engine/carbonCalc';

// Helper to generate date strings
const dateStr = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

// Demo user profile
export const DEMO_USER = {
  id: 'demo-tcet-001',
  name: 'Jainam',
  hostelOrBranch: 'Information Technology — TCET',
  createdAt: dateStr(14),
};

// Seeded 14-day habit history for demo user (realistic Mumbai student)
const rawHistory = [
  { daysAgo: 13, commuteMode: 'train', commuteDistanceKm: 18, dietType: 'nonveg', mealsCount: 3, energyUsageHours: 4 },
  { daysAgo: 12, commuteMode: 'bus',   commuteDistanceKm: 12, dietType: 'nonveg', mealsCount: 3, energyUsageHours: 5 },
  { daysAgo: 11, commuteMode: 'train', commuteDistanceKm: 18, dietType: 'veg',    mealsCount: 3, energyUsageHours: 3 },
  { daysAgo: 10, commuteMode: 'train', commuteDistanceKm: 18, dietType: 'veg',    mealsCount: 2, energyUsageHours: 2 },
  { daysAgo: 9,  commuteMode: 'walk',  commuteDistanceKm: 1,  dietType: 'veg',    mealsCount: 3, energyUsageHours: 2 },
  { daysAgo: 8,  commuteMode: 'bike',  commuteDistanceKm: 8,  dietType: 'nonveg', mealsCount: 3, energyUsageHours: 4 },
  { daysAgo: 7,  commuteMode: 'train', commuteDistanceKm: 18, dietType: 'veg',    mealsCount: 3, energyUsageHours: 3 },
  { daysAgo: 6,  commuteMode: 'train', commuteDistanceKm: 18, dietType: 'veg',    mealsCount: 3, energyUsageHours: 3 },
  { daysAgo: 5,  commuteMode: 'walk',  commuteDistanceKm: 0.5,dietType: 'vegan',  mealsCount: 3, energyUsageHours: 1 },
  { daysAgo: 4,  commuteMode: 'train', commuteDistanceKm: 18, dietType: 'veg',    mealsCount: 3, energyUsageHours: 2 },
  { daysAgo: 3,  commuteMode: 'walk',  commuteDistanceKm: 0.5,dietType: 'vegan',  mealsCount: 3, energyUsageHours: 1 },
  { daysAgo: 2,  commuteMode: 'train', commuteDistanceKm: 18, dietType: 'veg',    mealsCount: 3, energyUsageHours: 2 },
  { daysAgo: 1,  commuteMode: 'walk',  commuteDistanceKm: 0.5,dietType: 'vegan',  mealsCount: 2, energyUsageHours: 1 },
];

export const DEMO_HABIT_LOG = rawHistory.map(({ daysAgo, ...rest }) => ({
  date: dateStr(daysAgo),
  ...rest,
  computedFootprintKg: calculateDailyFootprint(rest),
}));

// Eco Battles — Seeded Leaderboards for Departments, Hostels, and Individuals
export const DEPARTMENT_LEADERBOARD_DATA = [
  { id: 1, name: 'Information Technology',  category: 'Department', avgScore: 2.4, members: 176, trend: 'up',   coins: 4200, isUserDept: true },
  { id: 2, name: 'Civil Engineering',       category: 'Department', avgScore: 2.8, members: 142, trend: 'up',   coins: 3850 },
  { id: 3, name: 'Computer Engineering',    category: 'Department', avgScore: 3.1, members: 198, trend: 'same', coins: 3500 },
  { id: 4, name: 'Electronics & TC',        category: 'Department', avgScore: 3.7, members: 154, trend: 'up',   coins: 3100 },
  { id: 5, name: 'Mechanical Engineering',  category: 'Department', avgScore: 4.4, members: 130, trend: 'down', coins: 2800 },
  { id: 6, name: 'AIDS',                    category: 'Department', avgScore: 4.9, members: 89,  trend: 'up',   coins: 2400 },
  { id: 7, name: 'Chemical Engineering',    category: 'Department', avgScore: 5.8, members: 62,  trend: 'down', coins: 1900 },
  { id: 8, name: 'Production Engineering',  category: 'Department', avgScore: 7.2, members: 45,  trend: 'down', coins: 1200 },
];

export const HOSTEL_LEADERBOARD_DATA = [
  { id: 101, name: 'Hostel A (Ground Block)',         category: 'Hostel', avgScore: 2.6, members: 210, trend: 'up',   coins: 4500 },
  { id: 102, name: 'Day Scholars (Suburban Mumbai)', category: 'Hostel', avgScore: 3.0, members: 680, trend: 'same', coins: 4100 },
  { id: 103, name: 'Hostel B (Wing East)',           category: 'Hostel', avgScore: 3.4, members: 185, trend: 'up',   coins: 3600 },
  { id: 104, name: 'Hostel C (Wing West)',           category: 'Hostel', avgScore: 4.2, members: 120, trend: 'down', coins: 2900 },
];

export const INDIVIDUAL_LEADERBOARD_DATA = [
  { id: 201, name: 'Jainam',          branch: 'IT Dept — TCET',        avgScore: 2.2, coins: 850, trend: 'up',   isUser: true },
  { id: 202, name: 'Priya Sharma',   branch: 'Civil Engineering',     avgScore: 2.5, coins: 790, trend: 'up' },
  { id: 203, name: 'Sneha Patil',    branch: 'Computer Engineering',  avgScore: 2.7, coins: 720, trend: 'same' },
  { id: 204, name: 'Dev Shah',       branch: 'IT Dept — TCET',        avgScore: 3.1, coins: 650, trend: 'up' },
  { id: 205, name: 'Rohan Verma',    branch: 'Electronics & TC',      avgScore: 3.6, coins: 580, trend: 'down' },
  { id: 206, name: 'Vikram Kulkarni',branch: 'Mechanical Engineering',avgScore: 4.3, coins: 490, trend: 'down' },
  { id: 207, name: 'Ananya Iyer',    branch: 'AIDS Dept',             avgScore: 4.8, coins: 410, trend: 'up' },
  { id: 208, name: 'Tanvi Naik',     branch: 'Chemical Engineering',  avgScore: 5.9, coins: 320, trend: 'down' },
];

// Green Coins rewards catalog
export const GREEN_COINS_REWARDS = [
  { id: 1, title: 'Canteen Discount',     description: '10% off at TCET canteen for a week', cost: 200,  icon: '🍱', category: 'food',     available: true },
  { id: 2, title: 'Library Printing',     description: '50 free A4 prints at the library',    cost: 150,  icon: '📄', category: 'campus',   available: true },
  { id: 3, title: 'EcoTwin Badge',        description: 'Exclusive "Green Pioneer" profile badge', cost: 300, icon: '🏅', category: 'digital',  available: true },
  { id: 4, title: 'Tree Planting',        description: 'TCET plants a tree in your name',     cost: 500,  icon: '🌳', category: 'impact',   available: true },
  { id: 5, title: 'Cycle Rental Pass',    description: '1-month campus bicycle rental pass',  cost: 400,  icon: '🚲', category: 'transport',available: true },
  { id: 6, title: 'EcoTwin Merch',        description: 'Exclusive EcoTwin tote bag',           cost: 600,  icon: '👜', category: 'merch',    available: false },
];

import { doc, setDoc, getDocs, collection } from 'firebase/firestore';

export const MOCK_USERS = [
  { id: 'mock-001', name: 'Priyansh Mehta', hostelOrBranch: 'Information Technology — TCET', department: 'Information Technology', hostel: 'Hostel A (Ground Block)', avgScore: 2.1, coins: 920, trustScore: 95 },
  { id: 'mock-002', name: 'Riya Sen', hostelOrBranch: 'Computer Engineering — TCET', department: 'Computer Engineering', hostel: 'Day Scholars (Suburban Mumbai)', avgScore: 2.4, coins: 810, trustScore: 98 },
  { id: 'mock-003', name: 'Dev Shah', hostelOrBranch: 'Information Technology — TCET', department: 'Information Technology', hostel: 'Hostel B (Wing East)', avgScore: 3.1, coins: 640, trustScore: 90 },
  { id: 'mock-004', name: 'Sneha Patil', hostelOrBranch: 'Computer Engineering — TCET', department: 'Computer Engineering', hostel: 'Day Scholars (Suburban Mumbai)', avgScore: 2.7, coins: 750, trustScore: 100 },
  { id: 'mock-005', name: 'Rohan Verma', hostelOrBranch: 'Electronics & TC — TCET', department: 'Electronics & TC', hostel: 'Day Scholars (Suburban Mumbai)', avgScore: 3.6, coins: 590, trustScore: 85 },
  { id: 'mock-006', name: 'Vikram Kulkarni', hostelOrBranch: 'Mechanical Engineering — TCET', department: 'Mechanical Engineering', hostel: 'Hostel C (Wing West)', avgScore: 4.3, coins: 490, trustScore: 92 },
  { id: 'mock-007', name: 'Ananya Iyer', hostelOrBranch: 'AIDS Dept — TCET', department: 'AIDS', hostel: 'Day Scholars (Suburban Mumbai)', avgScore: 4.8, coins: 410, trustScore: 90 },
  { id: 'mock-008', name: 'Tanvi Naik', hostelOrBranch: 'Chemical Engineering — TCET', department: 'Chemical Engineering', hostel: 'Day Scholars (Suburban Mumbai)', avgScore: 5.9, coins: 320, trustScore: 88 },
  { id: 'mock-009', name: 'Aryan Kapoor', hostelOrBranch: 'Mechanical Engineering — TCET', department: 'Mechanical Engineering', hostel: 'Hostel A (Ground Block)', avgScore: 3.8, coins: 550, trustScore: 95 },
  { id: 'mock-010', name: 'Diya Malhotra', hostelOrBranch: 'Information Technology — TCET', department: 'Information Technology', hostel: 'Day Scholars (Suburban Mumbai)', avgScore: 1.9, coins: 1040, trustScore: 100 },
  { id: 'mock-011', name: 'Kunal Shah', hostelOrBranch: 'Civil Engineering — TCET', department: 'Civil Engineering', hostel: 'Hostel B (Wing East)', avgScore: 5.2, coins: 380, trustScore: 80 },
  { id: 'mock-012', name: 'Aisha Patel', hostelOrBranch: 'AIDS Dept — TCET', department: 'AIDS', hostel: 'Hostel C (Wing West)', avgScore: 2.8, coins: 780, trustScore: 95 },
  { id: 'mock-013', name: 'Rahul Joshi', hostelOrBranch: 'Electronics & TC — TCET', department: 'Electronics & TC', hostel: 'Hostel A (Ground Block)', avgScore: 4.1, coins: 510, trustScore: 90 },
  { id: 'mock-014', name: 'Meera Nair', hostelOrBranch: 'Civil Engineering — TCET', department: 'Civil Engineering', hostel: 'Day Scholars (Suburban Mumbai)', avgScore: 3.0, coins: 700, trustScore: 97 },
  { id: 'mock-015', name: 'Yash Singh', hostelOrBranch: 'Chemical Engineering — TCET', department: 'Chemical Engineering', hostel: 'Hostel B (Wing East)', avgScore: 6.2, coins: 280, trustScore: 85 },
];

export async function seedMockUsersIfNeeded(db) {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    // If the database has fewer than 5 users, seed the mock data
    if (querySnapshot.size < 5) {
      console.log('Seeding mock users to Firestore...');
      for (const mockUser of MOCK_USERS) {
        await setDoc(doc(db, 'users', mockUser.id), {
          id: mockUser.id,
          name: mockUser.name,
          hostelOrBranch: mockUser.hostelOrBranch,
          department: mockUser.department,
          hostel: mockUser.hostel,
          greenCoinsBalance: mockUser.coins,
          trustScore: mockUser.trustScore,
          rollingAverage: mockUser.avgScore,
          createdAt: new Date().toISOString().split('T')[0],
          lastActive: new Date().toISOString(),
        });
      }
      console.log('Successfully seeded mock users!');
    }
  } catch (error) {
    console.error('Error seeding mock users:', error);
  }
}

