import { User } from '../types';

export const initialUsers: User[] = [
  {
    // FIX: Added missing 'id' property
    id: 'auth-user-id-admin',
    email: 'billhanoman@gmail.com',
    name: 'Bill Hanoman',
    isPremium: true,
    isAdmin: true,
    isSubscribed: true,
    planEndDate: 'N/A',
  },
  {
    // FIX: Added missing 'id' property
    id: 'auth-user-id-1',
    email: 'user1@example.com',
    name: 'Regular User',
    isPremium: false,
    isAdmin: false,
    isSubscribed: false,
    planEndDate: 'N/A',
  },
  {
    // FIX: Added missing 'id' property
    id: 'auth-user-id-2',
    email: 'user2@example.com',
    name: 'Another User',
    isPremium: false,
    isAdmin: false,
    isSubscribed: true,
    planEndDate: 'N/A',
  },
   {
    // FIX: Added missing 'id' property
    id: 'auth-user-id-premium',
    email: 'premium_user@example.com',
    name: 'Premium User',
    isPremium: true,
    isAdmin: false,
    isSubscribed: true,
    planEndDate: '2025-11-20',
  },
];