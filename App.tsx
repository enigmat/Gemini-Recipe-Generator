import React, { useState, useCallback, useMemo } from 'react';
import { Recipe } from './types';
import { generateRecipes, generateImage, extractIngredientsFromUrl, generateNewImagePrompt, generateRecipeVariation } from './services/geminiService';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import Spinner from './components/Spinner';
import UrlInput from './components/UrlInput';
import CookbookButton from './components/CookbookButton';
import SearchBar from './components/SearchBar';
import CameraInput from './components/CameraInput';
import CameraModal from './components/CameraModal';
import VariationModal from './components/VariationModal';

const App: React.FC = () => {
    const [ingredients, setIngredients] = useState<string[]>(['chicken breast', 'rice', 'broccoli']);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [recipeUrl, setRecipeUrl] = useState<string>('');
    const [isFetchingUrl, setIsFetchingUrl] = useState<boolean>(false);
    const [urlError, setUrlError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [recipeToVary, setRecipeToVary] = useState<Recipe | null>(null);
    const [isVariationLoading, setIsVariationLoading] = useState<boolean>(false);

    const handleFetchFromUrl = useCallback(async () => {
        if (!recipeUrl) {
            setUrlError("Please enter a URL.");
            return;
        }
        setIsFetchingUrl(true);
        setUrlError(null);
        setError(null);

        try {
            const extractedIngredients = await extractIngredientsFromUrl(recipeUrl);
            setIngredients(prevIngredients => {
                const combined = [...prevIngredients, ...extractedIngredients];
                // Remove duplicates
                return [...new Set(combined)];
            });
            setRecipeUrl('');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setUrlError(err.message);
            } else {
                setUrlError("An unknown error occurred while fetching from the URL.");
            }
        } finally {
            setIsFetchingUrl(false);
        }
    }, [recipeUrl]);
    
    const handleIngredientsScanned = (scannedIngredients: string[]) => {
        setIngredients(prevIngredients => {
            const combined = [...prevIngredients, ...scannedIngredients];
            return [...new Set(combined)]; // remove duplicates
        });
        setIsCameraModalOpen(false);
    }

    const processRecipeImage = async (recipe: Recipe, recipeIndex: number) => {
        if (!recipe.imagePrompt) return;
        try {
            const imageUrl = await generateImage(recipe.imagePrompt);
            setRecipes(prevRecipes => {
                const updatedRecipes = [...prevRecipes];
                const targetIndex = updatedRecipes.findIndex(r => r.recipeName === recipe.recipeName);
                if (targetIndex !== -1) {
                    updatedRecipes[targetIndex] = { ...updatedRecipes[targetIndex], imageUrl };
                }
                return updatedRecipes;
            });
        } catch (imageError) {
            console.error(`First attempt to generate image for "${recipe.recipeName}" failed. Retrying...`, imageError);
            try {
                const newPrompt = await generateNewImagePrompt(recipe.recipeName, recipe.description);
                const imageUrl = await generateImage(newPrompt);
                setRecipes(prevRecipes => {
                    const updatedRecipes = [...prevRecipes];
                    const targetIndex = updatedRecipes.findIndex(r => r.recipeName === recipe.recipeName);
                    if (targetIndex !== -1) {
                        updatedRecipes[targetIndex] = { ...updatedRecipes[targetIndex], imageUrl };
                    }
                    return updatedRecipes;
                });
            } catch (retryError) {
                console.error(`Second attempt to generate image for "${recipe.recipeName}" also failed.`, retryError);
                setRecipes(prevRecipes => {
                    const updatedRecipes = [...prevRecipes];
                    const targetIndex = updatedRecipes.findIndex(r => r.recipeName === recipe.recipeName);
                    if (targetIndex !== -1) {
                        updatedRecipes[targetIndex] = { ...updatedRecipes[targetIndex], imageUrl: 'error' };
                    }
                    return updatedRecipes;
                });
            }
        }
    };


    const handleGenerateRecipes = useCallback(async () => {
        if (ingredients.length === 0) {
            setError("Please add some ingredients first.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setUrlError(null);
        setRecipes([]);
        setSearchQuery('');

        try {
            const result = await generateRecipes(ingredients);
            setRecipes(result);
            setIsLoading(false);
            result.forEach(processRecipeImage);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
            setIsLoading(false);
        }
    }, [ingredients]);
    
    const handleGenerateVariation = useCallback(async (originalRecipe: Recipe, variationRequest: string) => {
        setIsVariationLoading(true);
        setError(null);
        try {
            const newRecipe = await generateRecipeVariation(originalRecipe, variationRequest, ingredients);
            
            newRecipe.recipeName = `${newRecipe.recipeName} (Variation)`;

            // Check for duplicate name and append a number if necessary
            let finalName = newRecipe.recipeName;
            let counter = 2;
            while (recipes.some(r => r.recipeName === finalName)) {
                finalName = `${newRecipe.recipeName} ${counter}`;
                counter++;
            }
            newRecipe.recipeName = finalName;

            setRecipes(prev => [newRecipe, ...prev]);
            
            // Generate its image
            processRecipeImage(newRecipe, 0);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred while generating the variation.");
            }
        } finally {
            setIsVariationLoading(false);
            setRecipeToVary(null);
        }
    }, [ingredients, recipes]);

    const filteredRecipes = useMemo(() => {
        if (!searchQuery) {
            return recipes;
        }
        return recipes.filter(recipe =>
            recipe.recipeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [recipes, searchQuery]);
    
    return (
        <div className="min-h-screen bg-secondary text-text-primary">
            <main className="container mx-auto px-4 py-8">
                <Header />
                
                <div className="max-w-2xl mx-auto mb-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <UrlInput 
                            recipeUrl={recipeUrl}
                            setRecipeUrl={setRecipeUrl}
                            onFetch={handleFetchFromUrl}
                            isLoading={isFetchingUrl}
                        />
                        <CameraInput onClick={() => setIsCameraModalOpen(true)} />
                    </div>

                     {urlError && (
                        <div className="mt-2 text-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm" role="alert">
                            {urlError}
                        </div>
                    )}
                    <div className="text-center my-4 text-text-secondary font-semibold">OR</div>
                    <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleGenerateRecipes}
                            disabled={isLoading || ingredients.length === 0}
                            className="w-full md:w-auto px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
                        >
                            {isLoading ? 'Generating...' : 'Generate Recipes'}
                        </button>
                    </div>
                </div>
                
                {isLoading && <Spinner />}
                
                {error && (
                    <div className="max-w-3xl mx-auto my-4 text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                        <strong className="font-bold">Oops! </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {isCameraModalOpen && (
                    <CameraModal 
                        onClose={() => setIsCameraModalOpen(false)}
                        onIngredientsScanned={handleIngredientsScanned}
                    />
                )}
                
                {recipeToVary && (
                    <VariationModal 
                        recipe={recipeToVary}
                        onClose={() => setRecipeToVary(null)}
                        onGenerate={handleGenerateVariation}
                        isLoading={isVariationLoading}
                    />
                )}

                {!isLoading && recipes.length > 0 && (
                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-center items-center mb-4 gap-4">
                             <h2 className="text-3xl font-bold text-center text-text-primary">Your Culinary Creations</h2>
                             <CookbookButton elementIdToPrint='cookbook-content' ingredients={ingredients} />
                        </div>
                         <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                        {filteredRecipes.length > 0 ? (
                            <div id="cookbook-content" className="space-y-8">
                                {filteredRecipes.map((recipe) => (
                                    <RecipeCard 
                                        key={recipe.recipeName} 
                                        recipe={recipe} 
                                        onGenerateVariation={() => setRecipeToVary(recipe)}
                                    />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center text-text-secondary py-16">
                                <p className="text-xl font-semibold">No recipes found for "{searchQuery}"</p>
                                <p>Try searching for something else or clear the search.</p>
                            </div>
                        )}
                    </div>
                )}

                {!isLoading && recipes.length === 0 && !error && (
                     <div className="text-center text-text-secondary py-16">
                        <p className="text-xl">Ready to cook something amazing?</p>
                        <p>Add your ingredients above and let's get started!</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;