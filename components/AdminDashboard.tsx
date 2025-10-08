import React from 'react';
import { Recipe } from '../types';

interface AdminDashboardProps {
    onBackToApp: () => void;
    onAddRecipe: (recipe: Recipe) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp, onAddRecipe }) => {
    return (
        <div className="animate-fade-in py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
                <button
                    onClick={onBackToApp}
                    className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors"
                >
                    &larr; Back to Recipes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder cards for admin features */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-border-color">
                    <h2 className="text-xl font-bold text-text-primary mb-2">User Management</h2>
                    <p className="text-text-secondary">View, edit, or remove user accounts. Assign roles and permissions.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-border-color">
                    <h2 className="text-xl font-bold text-text-primary mb-2">Recipe Analytics</h2>
                    <p className="text-text-secondary">Track popular recipes, user engagement, and search trends.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-border-color">
                    <h2 className="text-xl font-bold text-text-primary mb-2">Content Management</h2>
                    <p className="text-text-secondary">Add, edit, or feature recipes, meal plans, and cooking classes.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;