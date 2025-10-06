import { MealPlan } from '../types';

export const mealPlans: MealPlan[] = [
    {
        title: "Beginner's Week",
        description: "A week of simple, delicious, and foolproof recipes perfect for those new to cooking.",
        imageUrl: "https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        plan: [
            { day: 'Monday', recipeTitle: 'Spaghetti Carbonara' },
            { day: 'Tuesday', recipeTitle: 'Simple Beef Tacos' },
            { day: 'Wednesday', recipeTitle: 'Creamy Tomato Soup' },
            { day: 'Thursday', recipeTitle: 'Classic Tomato Bruschetta' },
            { day: 'Friday', recipeTitle: 'Garlic Butter Shrimp Scampi' },
        ]
    },
    {
        title: "Vegetarian Delight",
        description: "Explore a world of flavor with these vibrant and satisfying meat-free meals for the week.",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        plan: [
            { day: 'Monday', recipeTitle: 'Healthy Quinoa Salad' },
            { day: 'Tuesday', recipeTitle: 'Black Bean Burgers' },
            { day: 'Wednesday', recipeTitle: 'Vegan Lentil Soup' },
            { day: 'Thursday', recipeTitle: 'Caprese Salad' },
            { day: 'Friday', recipeTitle: 'Creamy Tomato Soup' },
        ]
    },
    {
        title: "Family Favorites",
        description: "Crowd-pleasing dishes that are perfect for weeknight family dinners. Simple to make and loved by all ages.",
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        plan: [
            { day: 'Monday', recipeTitle: 'Simple Beef Tacos' },
            { day: 'Tuesday', recipeTitle: 'Sheet Pan Lemon Herb Chicken & Veggies' },
            { day: 'Wednesday', recipeTitle: 'Classic Beef Chili' },
            { day: 'Thursday', recipeTitle: 'Spaghetti Carbonara' },
            { day: 'Friday', recipeTitle: 'Lemon Herb Roasted Chicken' },
            { day: 'Weekend Treat', recipeTitle: 'Ultimate Chocolate Chip Cookies' },
        ]
    }
];
