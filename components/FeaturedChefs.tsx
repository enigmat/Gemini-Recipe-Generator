import React, { useState, useEffect, useCallback } from 'react';
// FIX: import generateImageFromPrompt from geminiService
import { generateFeaturedChefs, generateImage, generateImageFromPrompt } from '../services/geminiService';
import { FeaturedChefInfo, DisplayChef } from '../types';
import Spinner from './Spinner';
import StoredImage from './StoredImage';
import UsersIcon from './icons/UsersIcon';
import XIcon from './icons/XIcon';
import SparklesIcon from './icons/SparklesIcon';

// Modal Component
const FeaturedChefRecipeModal: React.FC<{ chef: DisplayChef | null; onClose: () => void }> = ({ chef, onClose }) => {
    if (!chef) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-11/12 md:max-w-3xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800">{chef.recipeTitle}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XIcon className="w-6 h-6 text-slate-600" />
                    </button>
                </header>
                <main className="flex-grow overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <img src={chef.recipeImage} alt={chef.recipeTitle} className="w-full h-80 object-cover rounded-lg" />
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-700">About the Recipe</h3>
                                <p className="text-slate-600 mt-1">{chef.recipeDescription}</p>
                            </div>
                            <div className="border-t pt-4">
                                <h3 className="font-bold text-lg text-slate-700">About the Chef</h3>
                                <div className="flex items-center gap-3 mt-2">
                                    <img src={chef.chefImage} alt={chef.name} className="w-16 h-16 rounded-full object-cover"/>
                                    <div>
                                        <p className="font-semibold text-slate-800">{chef.name}</p>
                                        <p className="text-sm text-slate-500">{chef.bio}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};


// Chef Card & Skeleton Components
const ChefCard: React.FC<{ chef: DisplayChef; onView: () => void }> = ({ chef, onView }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group border animate-fade-in">
        <div className="relative">
            <img src={chef.chefImage} alt={chef.name} className="w-full h-56 object-cover" />
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-xl font-semibold text-slate-800">{chef.name}</h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2 flex-grow">
                Known for: <span className="font-medium text-slate-600">{chef.recipeTitle}</span>
            </p>
            <button
                onClick={onView}
                className="mt-4 w-full px-4 py-2 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors text-sm"
            >
                View Recipe
            </button>
        </div>
    </div>
);

const ChefCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col border animate-pulse">
        <div className="w-full h-56 bg-slate-200"></div>
        <div className="p-4 flex flex-col flex-grow">
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6 mb-1"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="mt-auto h-10 bg-slate-200 rounded-lg w-full"></div>
        </div>
    </div>
);


// Main FeaturedChefs Component
const FeaturedChefs: React.FC = () => {
    const [chefs, setChefs] = useState<DisplayChef[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewingChef, setViewingChef] = useState<DisplayChef | null>(null);

    const fetchChefs = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const existingChefNames = chefs.map(c => c.name);
            const results: FeaturedChefInfo[] = await generateFeaturedChefs(existingChefNames);

            const newDisplayChefs: DisplayChef[] = await Promise.all(results.map(async (chefInfo) => {
                 await new Promise(resolve => setTimeout(resolve, 200)); // Small delay between image generations
                const [chefImage, recipeImage] = await Promise.all([
                    generateImage(chefInfo.imagePrompt),
                    generateImageFromPrompt(chefInfo.recipeImagePrompt)
                ]);
                return { ...chefInfo, chefImage, recipeImage };
            }));

            setChefs(prev => [...prev, ...newDisplayChefs]);
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [chefs]);

    useEffect(() => {
        // Fetch initial set of chefs only if the list is empty
        if (chefs.length === 0) {
            fetchChefs();
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <div className="space-y-8">
            <div className="text-center">
                <UsersIcon className="w-12 h-12 text-teal-500 mx-auto" />
                <h1 className="text-3xl font-bold text-slate-800 mt-4">Featured Chefs</h1>
                <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
                    Discover world-renowned chefs and their signature dishes, generated by AI.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-center">
                    <p><strong className="font-semibold">Oops!</strong> {error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {chefs.map((chef, index) => (
                    <ChefCard key={`${chef.name}-${index}`} chef={chef} onView={() => setViewingChef(chef)} />
                ))}
                {isLoading && Array.from({ length: chefs.length === 0 ? 8 : 4 }).map((_, index) => <ChefCardSkeleton key={index} />)}
            </div>

            <div className="text-center">
                <button
                    onClick={fetchChefs}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-lg shadow-md border-2 border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                    {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
                    <span>{isLoading ? 'Loading...' : 'Load 10 More Chefs'}</span>
                </button>
            </div>

            <FeaturedChefRecipeModal chef={viewingChef} onClose={() => setViewingChef(null)} />
        </div>
    );
};

export default FeaturedChefs;
