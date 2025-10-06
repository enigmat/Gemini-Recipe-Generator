
import React, { useState, useMemo, useEffect } from 'react';
import { Recipe, ShoppingList, MealPlan } from './types';
import Header from './components/Header';
import RecipeCard from './components/RecipeCard';
import SearchBar from './components/SearchBar';
import RecipeModal from './components/RecipeModal';
import TagFilter from './components/TagFilter';
import { recipes as recipeData } from './data/recipes';
import { mealPlans } from './data/mealPlans';
import * as favoritesService from './services/favoritesService';
import IngredientInput from './components/IngredientInput';
import { generateRecipes, generateShoppingList } from './services/geminiService';
import Spinner from './components/Spinner';
import ShoppingListModal from './components/ShoppingListModal';
import MealPlanCard from './components/MealPlanCard';
import MealPlanDetail from './components/MealPlanDetail';
import CookMode from './components/CookMode';

const ITEMS_PER_PAGE = 12;

type View = 'all' | 'saved' | 'plans';

const App: React.FC = () => {
    // States for browsing static recipes
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [itemsToShow, setItemsToShow] = useState(ITEMS_PER_PAGE);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [savedRecipeTitles, setSavedRecipeTitles] = useState<string[]>([]);
    const [currentView, setCurrentView] = useState<View>('all');

    // States for ingredient-based generation
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[] | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);

    // States for shopping list
    const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
    const [isGeneratingList, setIsGeneratingList] = useState(false);
    const [listGenerationError, setListGenerationError] = useState<string | null>(null);

    // States for Meal Plans
    const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);

    // State for Cook Mode
    const [cookingRecipe, setCookingRecipe] = useState<Recipe | null>(null);


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

    const handleGenerateRecipes = async () => {
        if (ingredients.length === 0) {
            setGenerationError("Please add some ingredients first.");
            return;
        }
        setIsGenerating(true);
        setGenerationError(null);
        setGeneratedRecipes(null);
        try {
            const recipes = await generateRecipes(ingredients);
            setGeneratedRecipes(recipes);
        } catch (error) {
            console.error("Error generating recipes:", error);
            if (error instanceof Error) {
                setGenerationError(error.message);
            } else {
                setGenerationError("An unknown error occurred while generating recipes.");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateRecipeShoppingList = async () => {
        if (!selectedRecipe) return;

        setIsGeneratingList(true);
        setListGenerationError(null);
        try {
            const list = await generateShoppingList(selectedRecipe.ingredients);
            setShoppingList(list);
        } catch (error) {
            console.error("Error generating shopping list:", error);
            if (error instanceof Error) {
                setListGenerationError(error.message);
            } else {
                setListGenerationError("An unknown error occurred while generating the list.");
            }
        } finally {
            setIsGeneratingList(false);
        }
    };

    const handleGeneratePlanShoppingList = async () => {
        if (!selectedPlan) return;

        const recipeTitlesInPlan = selectedPlan.plan.map(day => day.recipeTitle);
        const recipesInPlan = recipeData.filter(recipe => recipeTitlesInPlan.includes(recipe.title));
        const allIngredients = recipesInPlan.flatMap(recipe => recipe.ingredients);

        setIsGeneratingList(true);
        setListGenerationError(null);
        try {
            const list = await generateShoppingList(allIngredients);
            setShoppingList(list);
        } catch (error) {
            console.error("Error generating shopping list for plan:", error);
            if (error instanceof Error) {
                setListGenerationError(error.message);
            } else {
                setListGenerationError("An unknown error occurred while generating the list.");
            }
        } finally {
            setIsGeneratingList(false);
        }
    };
    
    const handleStartCookMode = () => {
        if (selectedRecipe) {
            setCookingRecipe(selectedRecipe);
            setSelectedRecipe(null); // Close the modal
        }
    };

    const handleExitCookMode = () => {
        // Re-open the recipe modal for a seamless experience
        setSelectedRecipe(cookingRecipe);
        setCookingRecipe(null);
    };


    const handleBackToBrowse = () => {
        setGeneratedRecipes(null);
        setGenerationError(null);
    };
    
    const handleViewChange = (view: View) => {
        setCurrentView(view);
        setSelectedPlan(null); // Reset selected plan when changing main view
        setSearchQuery(''); // Reset search
        setSelectedTags([]); // Reset tags
    }

    const renderContent = () => {
        if (isGenerating) {
            return (
                <div className="text-center py-16">
                    <Spinner />
                    <p className="mt-4 text-text-secondary">Generating delicious recipes for you...</p>
                </div>
            );
        }

        if (generationError) {
            return (
                <div className="text-center text-red-500 py-16 bg-red-50 rounded-lg">
                    <p className="text-xl font-semibold">Oops! Something went wrong.</p>
                    <p className="mt-2">{generationError}</p>
                    <button
                        onClick={handleBackToBrowse}
                        className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        if (generatedRecipes) {
            return (
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Recipes for You</h2>
                        <button
                            onClick={handleBackToBrowse}
                            className="px-4 py-2 bg-gray-200 text-text-secondary font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            &larr; Browse All Recipes
                        </button>
                    </div>
                    {generatedRecipes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                            {generatedRecipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe.title}
                                    recipe={recipe}
                                    onClick={() => setSelectedRecipe(recipe)}
                                    isSaved={savedRecipeTitles.includes(recipe.title)}
                                    onToggleSave={() => handleToggleSave(recipe.title)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-text-secondary py-16">
                            <p className="text-xl font-semibold">No Recipes Found</p>
                            <p>We couldn't generate any recipes with your ingredients. Please try a different combination.</p>
                        </div>
                    )}
                </div>
            );
        }

        if (currentView === 'plans') {
            if (selectedPlan) {
                return <MealPlanDetail 
                    plan={selectedPlan}
                    recipes={recipeData}
                    onSelectRecipe={setSelectedRecipe}
                    onBack={() => setSelectedPlan(null)}
                    onGenerateList={handleGeneratePlanShoppingList}
                    isGeneratingList={isGeneratingList}
                />;
            }
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-in">
                    {mealPlans.map(plan => (
                        <MealPlanCard key={plan.title} plan={plan} onClick={() => setSelectedPlan(plan)} />
                    ))}
                </div>
            );
        }

        // Default browse view for 'all' or 'saved'
        return (
            <>
                <div className="max-w-4xl mx-auto mb-8 space-y-4">
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <TagFilter
                        allTags={allTags}
                        selectedTags={selectedTags}
                        onTagClick={handleTagClick}
                    />
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
            </>
        );
    };

    return (
        <div className="min-h-screen bg-secondary text-text-primary">
            <main className="container mx-auto px-4 py-8">
                <Header />

                <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mb-12 border border-border-color">
                    <h2 className="text-xl font-bold text-text-primary mb-4 text-center">Have ingredients? Find a recipe!</h2>
                    <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
                    <div className="mt-4 text-center">
                        <button
                            onClick={handleGenerateRecipes}
                            disabled={isGenerating || ingredients.length === 0}
                            className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? 'Finding Recipes...' : 'Find Recipes'}
                        </button>
                    </div>
                </div>

                <div className="flex justify-center mb-8 gap-2 p-1 bg-gray-200 rounded-lg max-w-sm mx-auto">
                    <button
                        onClick={() => handleViewChange('all')}
                        className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors ${currentView === 'all' ? 'bg-white text-primary shadow' : 'text-text-secondary hover:bg-gray-100'}`}
                    >
                        All Recipes
                    </button>
                    <button
                        onClick={() => handleViewChange('saved')}
                        className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors ${currentView === 'saved' ? 'bg-white text-primary shadow' : 'text-text-secondary hover:bg-gray-100'}`}
                    >
                        My Recipes
                    </button>
                     <button
                        onClick={() => handleViewChange('plans')}
                        className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors ${currentView === 'plans' ? 'bg-white text-primary shadow' : 'text-text-secondary hover:bg-gray-100'}`}
                    >
                        Meal Plans
                    </button>
                </div>

                {renderContent()}

            </main>

            {selectedRecipe && (
                <RecipeModal
                    recipe={selectedRecipe}
                    onClose={() => setSelectedRecipe(null)}
                    isSaved={savedRecipeTitles.includes(selectedRecipe.title)}
                    onToggleSave={() => handleToggleSave(selectedRecipe.title)}
                    onGenerateShoppingList={handleGenerateRecipeShoppingList}
                    isGeneratingList={isGeneratingList}
                    onStartCookMode={handleStartCookMode}
                />
            )}
            
            {cookingRecipe && (
                <CookMode recipe={cookingRecipe} onExit={handleExitCookMode} />
            )}


            {(shoppingList || listGenerationError) && (
                 <ShoppingListModal
                    shoppingList={shoppingList}
                    error={listGenerationError}
                    recipeTitle={selectedPlan?.title || selectedRecipe?.title || 'your selection'}
                    onClose={() => {
                        setShoppingList(null);
                        setListGenerationError(null);
                    }}
                 />
            )}
        </div>
    );
};

export default App;
