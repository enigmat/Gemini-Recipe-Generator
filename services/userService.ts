import { User, Subscription, SubscriptionHistory } from '../types';

const PREMIUM_STATUS_KEY_PREFIX = 'marshmellowRecipesPremium_';
const USER_KEY = 'marshmellowRecipesUser';
const ALL_USERS_KEY = 'marshmellowRecipesAllUsers';

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

// --- Mock User Database ---
const getInitialUsers = (): User[] => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    return [
        {
            name: 'Bill Hanoman',
            email: 'billhanoman@gmail.com',
            isAdmin: true,
            joinDate: formatDate(threeMonthsAgo)
        },
        {
            name: 'Regular User',
            email: 'user1@example.com',
            isAdmin: false,
            joinDate: formatDate(oneMonthAgo)
        },
        {
            name: 'Another User',
            email: 'user2@example.com',
            isAdmin: false,
            joinDate: formatDate(today)
        },
        {
            name: 'Premium User',
            email: 'premium_user@example.com',
            isAdmin: false,
            joinDate: formatDate(threeMonthsAgo),
            subscription: {
                planType: 'monthly',
                status: 'active',
                startDate: formatDate(oneMonthAgo),
                endDate: formatDate(nextMonth),
                nextBillingDate: formatDate(nextMonth),
            },
            subscriptionHistory: [
                { date: formatDate(oneMonthAgo), action: 'Subscribed', description: 'Started monthly plan.' }
            ]
        },
    ];
};

const initializeUsers = (): void => {
    try {
        const storedUsers = localStorage.getItem(ALL_USERS_KEY);
        if (!storedUsers) {
            localStorage.setItem(ALL_USERS_KEY, JSON.stringify(getInitialUsers()));
        }
    } catch (error) {
        console.error("Error initializing mock user database", error);
    }
};

// Initialize on load
initializeUsers();


export const getAllUsers = (): User[] => {
    try {
        const usersJson = localStorage.getItem(ALL_USERS_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
        console.error("Error getting all users from localStorage", error);
        return [];
    }
};

const saveAllUsers = (users: User[]): void => {
    try {
        localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Error saving all users to localStorage", error);
    }
};

export const getUserByEmail = (email: string): User | undefined => {
    return getAllUsers().find(user => user.email === email);
}

export const updateUser = (email: string, updatedData: Partial<User>): User | null => {
    let users = getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex === -1) return null;
    
    users[userIndex] = { ...users[userIndex], ...updatedData };
    saveAllUsers(users);
    
    // If the updated user is the current user, update their session too
    const currentUser = getCurrentUser();
    if(currentUser && currentUser.email === email) {
        localStorage.setItem(USER_KEY, JSON.stringify(users[userIndex]));
    }

    return users[userIndex];
};


export const deleteUser = (email: string): void => {
    let users = getAllUsers();
    users = users.filter(user => user.email !== email);
    saveAllUsers(users);
};

export const giveFreeTime = (email: string, months: number): void => {
    const user = getUserByEmail(email);
    if (!user) return;

    const today = new Date();
    let newEndDate: Date;

    if (user.subscription && user.subscription.status === 'active' && new Date(user.subscription.endDate) > today) {
        // Extend existing subscription
        newEndDate = new Date(user.subscription.endDate);
    } else {
        // Start a new subscription from today
        newEndDate = today;
    }
    
    newEndDate.setMonth(newEndDate.getMonth() + months);

    const updatedSubscription: Subscription = {
        planType: user.subscription?.planType || 'monthly',
        status: 'active',
        startDate: user.subscription?.startDate || formatDate(today),
        endDate: formatDate(newEndDate),
        nextBillingDate: formatDate(newEndDate),
    };

    const historyEntry: SubscriptionHistory = {
        date: formatDate(new Date()),
        action: 'Admin Grant',
        description: `Granted ${months} free month(s). New end date: ${formatDate(newEndDate)}.`
    };

    const updatedHistory = [...(user.subscriptionHistory || []), historyEntry];

    updateUser(email, { subscription: updatedSubscription, subscriptionHistory: updatedHistory });
};

export const grantPremium = (email: string): void => {
    const user = getUserByEmail(email);
    if (user && user.subscription?.status === 'active') return; // Already premium

    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const newSubscription: Subscription = {
        planType: 'monthly',
        status: 'active',
        startDate: formatDate(today),
        endDate: formatDate(nextMonth),
        nextBillingDate: formatDate(nextMonth),
    };

    const historyEntry: SubscriptionHistory = {
        date: formatDate(today),
        action: 'Subscribed',
        description: 'Started monthly plan via admin grant.'
    };
    
    const updatedHistory = [...(user?.subscriptionHistory || []), historyEntry];
    
    updateUser(email, { subscription: newSubscription, subscriptionHistory: updatedHistory });
};

// --- Single User Session Management ---

export const getPremiumStatus = (): boolean => {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    // Admins are always premium
    if (currentUser.isAdmin) return true;

    if (currentUser.subscription && currentUser.subscription.status === 'active') {
        return new Date(currentUser.subscription.endDate) >= new Date();
    }
    
    return false;
};

// This function is for external triggers like Stripe, not admin actions
export const setPremiumStatus = (isPremium: boolean): void => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    if (isPremium) {
        const today = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1);
        const sub: Subscription = {
            planType: 'monthly',
            status: 'active',
            startDate: formatDate(today),
            endDate: formatDate(nextMonth),
            nextBillingDate: formatDate(nextMonth),
        };
        const history: SubscriptionHistory = {
            date: formatDate(today),
            action: 'Subscribed',
            description: 'Started monthly plan via checkout.'
        };
        updateUser(currentUser.email, {
             subscription: sub,
             subscriptionHistory: [...(currentUser.subscriptionHistory || []), history]
        });
    } else {
        // Handle cancellation logic if needed
    }
};

export const getCurrentUser = (): User | null => {
    try {
        const userJson = localStorage.getItem(USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error("Error parsing user from localStorage", error);
        return null;
    }
};

export const loginUser = (email: string): void => {
    try {
        const allUsers = getAllUsers();
        let user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            // Create a new user if they don't exist in our mock DB
            user = {
                name: email.split('@')[0],
                email: email,
                isAdmin: false,
                joinDate: formatDate(new Date())
            };
            saveAllUsers([...allUsers, user]);
        }
        
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
        console.error("Error saving user to localStorage", error);
    }
};

export const logoutUser = (): void => {
    try {
        localStorage.removeItem(USER_KEY);
    } catch (error) {
        console.error("Error removing user from localStorage", error);
    }
};