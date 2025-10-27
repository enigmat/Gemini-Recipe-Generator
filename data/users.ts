import { User } from '../types';

export const initialUsers: User[] = [
  {
    email: 'billhanoman@gmail.com',
    name: 'Bill Hanoman',
    isPremium: true,
    isAdmin: true,
    isSubscribed: true,
    planEndDate: 'N/A',
  },
  {
    email: 'user1@example.com',
    name: 'Regular User',
    isPremium: false,
    isAdmin: false,
    isSubscribed: false,
    planEndDate: 'N/A',
  },
  {
    email: 'user2@example.com',
    name: 'Another User',
    isPremium: false,
    isAdmin: false,
    isSubscribed: true,
    planEndDate: 'N/A',
  },
   {
    email: 'premium_user@example.com',
    name: 'Premium User',
    isPremium: true,
    isAdmin: false,
    isSubscribed: true,
    planEndDate: '2025-11-20',
  },
];
