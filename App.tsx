import React, { useState, useMemo, useEffect } from 'react';
import { Recipe } from './types';
import Header from './components/Header';
import RecipeCard from './components/RecipeCard';
import SearchBar from './components/SearchBar';
import RecipeModal from './components/RecipeModal';
import TagFilter from './components/TagFilter';
import { recipes as recipeData } from './data/recipes';
import * as favoritesService from './services/favoritesService';

const ITEMS_PER_PAGE = 12;

type View = 'all' | 'saved';

const App: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [itemsToShow, setItemsToShow] = useState(ITEMS_PER_PAGE);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [savedRecipeTitles, setSavedRecipeTitles] = useState<string[]>([]);
    const [currentView, setCurrentView] = useState<View>('all');

    useEffect(() => {
        setSavedRecipeTitles(favoritesService.getSavedRecipeTitles());
    }, []);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        recipeData.forEach(recipe => {
            recipe.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, []);

    const handleToggleSave = (recipeTitle: string) => {
        const isSaved = savedRecipeTitles.includes(recipeTitle);
        if (isSaved) {
            favoritesService.unsaveRecipe(recipeTitle);
            setSavedRecipeTitles(savedRecipeTitles.filter(t => t !== recipeTitle));
        } else {
            favoritesService.saveRecipe(recipeTitle);
            setSavedRecipeTitles([...savedRecipeTitles, recipeTitle]);
        }
    };

    const filteredRecipes = useMemo(() => {
        let recipes = currentView === 'saved'
            ? recipeData.filter(recipe => savedRecipeTitles.includes(recipe.title))
            : recipeData;

        return recipes.filter(recipe => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                !searchQuery ||
                recipe.title.toLowerCase().includes(searchLower) ||
                recipe.description.toLowerCase().includes(searchLower) ||
                recipe.ingredients.some(ing => ing.toLowerCase().includes(searchLower)) ||
                recipe.tags.some(tag => tag.toLowerCase().includes(searchLower));

            const matchesTags =
                selectedTags.length === 0 ||
                selectedTags.every(tag => recipe.tags.includes(tag));

            return matchesSearch && matchesTags;
        });
    }, [searchQuery, selectedTags, currentView, savedRecipeTitles]);

    const handleTagClick = (tag: string) => {
        setSelectedTags(prevTags =>
            prevTags.includes(tag)
                ? prevTags.filter(t => t !== tag)
                : [...prevTags, tag]
        );
        setItemsToShow(ITEMS_PER_PAGE); // Reset pagination on filter change
    };

    const showMoreItems = () => {
        setItemsToShow(prev => prev + ITEMS_PER_PAGE);
    };

    const currentRecipes = filteredRecipes.slice(0, itemsToShow);

    return (
        <div className="min-h-screen bg-secondary text-text-primary">
            <main className="container mx-auto px-4 py-8">
                <Header />

                <div className="max-w-4xl mx-auto mb-8 space-y-4">
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <TagFilter
                        allTags={allTags}
                        selectedTags={selectedTags}
                        onTagClick={handleTagClick}
                    />
                </div>

                <div className="flex justify-center mb-8 gap-2 p-1 bg-gray-200 rounded-lg max-w-xs mx-auto">
                    <button
                        onClick={() => setCurrentView('all')}
                        className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors ${currentView === 'all' ? 'bg-white text-primary shadow' : 'text-text-secondary hover:bg-gray-100'}`}
                    >
                        All Recipes
                    </button>
                    <button
                        onClick={() => setCurrentView('saved')}
                        className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors ${currentView === 'saved' ? 'bg-white text-primary shadow' : 'text-text-secondary hover:bg-gray-100'}`}
                    >
                        My Recipes
                    </button>
                </div>


                {currentRecipes.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                            {currentRecipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe.title}
                                    recipe={recipe}
                                    onClick={() => setSelectedRecipe(recipe)}
                                    isSaved={savedRecipeTitles.includes(recipe.title)}
                                    onToggleSave={() => handleToggleSave(recipe.title)}
                                />
                            ))}
                        </div>
                        {itemsToShow < filteredRecipes.length && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={showMoreItems}
                                    className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors duration-200"
                                >
                                    Load More Recipes
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center text-text-secondary py-16">
                         {currentView === 'saved' ? (
                            <>
                                <p className="text-xl font-semibold">No Saved Recipes Yet</p>
                                <p>Click the heart icon on any recipe to save it here.</p>
                            </>
                        ) : (
                             <>
                                <p className="text-xl font-semibold">No Recipes Found</p>
                                <p>Try adjusting your search or filters.</p>
                            </>
                        )}
                    </div>
                )}
            </main>

            {selectedRecipe && (
                <RecipeModal
                    recipe={selectedRecipe}
                    onClose={() => setSelectedRecipe(null)}
                    isSaved={savedRecipeTitles.includes(selectedRecipe.title)}
                    onToggleSave={() => handleToggleSave(selectedRecipe.title)}
                />
            )}
        </div>
    );
};

export default App;