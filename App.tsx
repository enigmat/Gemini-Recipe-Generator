import React, { useState, useMemo, useEffect } from 'react';
import { Recipe, ShoppingList, MealPlan, Video, VideoCategory, Lesson, CookingClass, User } from './types';
import Header from './components/Header';
import RecipeCard from './components/RecipeCard';
import SearchBar from './components/SearchBar';
import RecipeModal from './components/RecipeModal';
import TagFilter from './components/TagFilter';
import { recipes as recipeData } from './data/recipes';
import { recipes as newRecipes } from './data/newRecipes';
import { mealPlans } from './data/mealPlans';
import { videoData } from './data/videos';
import { cookingClasses as cookingClassesData } from './data/cookingClasses';
import * as favoritesService from './services/favoritesService';
import * as userService from './services/userService';
import IngredientInput from './components/IngredientInput';
import { generateRecipes, generateShoppingList, importRecipeFromUrl } from './services/geminiService';
import Spinner from './components/Spinner';
import ShoppingListModal from './components/ShoppingListModal';
import MealPlanCard from './components/MealPlanCard';
import MealPlanDetail from './components/MealPlanDetail';
import CookMode from './components/CookMode';
import VideoCard from './components/VideoCard';
import VideoPlayerModal from './components/VideoPlayerModal';
import PremiumContent from './components/PremiumContent';
import AdvancedClasses from './components/AdvancedClasses';
import CookingClassDetail from './components/CookingClassDetail';
import AskAnExpert from './components/AskAnExpert';
import UpgradeModal from './components/UpgradeModal';
import CrownIcon from './components/icons/CrownIcon';
import SparklesIcon from './components/icons/SparklesIcon';
import LoginModal from './components/LoginModal';
import UserMenu from './components/UserMenu';
import ShieldIcon from './components/icons/ShieldIcon';
import AdminDashboard from './components/AdminDashboard';
import CookbookButton from './components/CookbookButton';
import LockClosedIcon from './components/icons/LockClosedIcon';
import UrlInput from './components/UrlInput';
import CameraInput from './components/CameraInput';
import CameraModal from './components/CameraModal';
import BartenderHelper from './components/BartenderHelper';
import CocktailIcon from './components/icons/CocktailIcon';

const ITEMS_PER_PAGE = 12;

type View = 'all' | 'saved' | 'plans' | 'videos' | 'bartender';

const App: React.FC = () => {
    // States for browsing static recipes
    const [mainRecipes, setMainRecipes] = useState<Recipe[]>(recipeData);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [itemsToShow, setItemsToShow] = useState(ITEMS_PER_PAGE);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [savedRecipeTitles, setSavedRecipeTitles] = useState<string[]>([]);
    const [currentView, setCurrentView] = useState<View>('all');
    
    // States for user authentication and premium status
    const [isPremium, setIsPremium] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isDashboardVisible, setIsDashboardVisible] = useState(false);
    
    // States for premium upgrade flow
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [showUpgradeConfirmation, setShowUpgradeConfirmation] = useState(false);

    // States for ingredient-based generation
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[] | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);

    // States for URL import
    const [recipeUrl, setRecipeUrl] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [importError, setImportError] = useState<string | null>(null);
    const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);

    // State for Camera Modal
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

    // States for shopping list
    const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
    const [isGeneratingList, setIsGeneratingList] = useState(false);
    const [listGenerationError, setListGenerationError] = useState<string | null>(null);

    // States for Meal Plans
    const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);

    // State for Cook Mode
    const [cookingRecipe, setCookingRecipe] = useState<Recipe | null>(null);

    // State for Videos
    const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

    // State for Advanced Classes
    const [selectedClass, setSelectedClass] = useState<CookingClass | null>(null);

    // State for Ask an Expert
    const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);


    useEffect(() => {
        const user = userService.getCurrentUser();
        setCurrentUser(user);

        const hasPaid = userService.getPremiumStatus();
        setIsPremium(hasPaid || (user?.isAdmin ?? false));

        setSavedRecipeTitles(favoritesService.getSavedRecipeTitles());

        // Check for Stripe checkout redirect
        const query = new URLSearchParams(window.location.search);
        if (query.get('checkout') === 'success') {
            setIsPremium(true);
            userService.setPremiumStatus(true);
            setShowUpgradeConfirmation(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        if (query.get('checkout') === 'cancel') {
             window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const allRecipes = useMemo(() => [...mainRecipes, ...newRecipes], [mainRecipes]);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        mainRecipes.forEach(recipe => {
            recipe.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [mainRecipes]);

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
            ? allRecipes.filter(recipe => savedRecipeTitles.includes(recipe.title))
            : mainRecipes;

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
    }, [searchQuery, selectedTags, currentView, savedRecipeTitles, allRecipes, mainRecipes]);

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

    const handleImportRecipe = async () => {
        if (!isPremium) {
            setIsUpgradeModalOpen(true);
            return;
        }
        if (!recipeUrl) {
            setImportError("Please enter a URL.");
            return;
        }
        setIsImporting(true);
        setImportError(null);
        setImportSuccessMessage(null);
        try {
            const newRecipe = await importRecipeFromUrl(recipeUrl);
            setMainRecipes(prev => [newRecipe, ...prev]);
            
            // Ensure it's saved if not already
            if (!savedRecipeTitles.includes(newRecipe.title)) {
                 handleToggleSave(newRecipe.title);
            }
    
            setImportSuccessMessage(`Successfully imported "${newRecipe.title}"! Find it in "My Recipes".`);
            setRecipeUrl('');
            setTimeout(() => setImportSuccessMessage(null), 5000);
        } catch (error) {
            console.error("Error importing recipe:", error);
            if (error instanceof Error) {
                setImportError(error.message);
            } else {
                setImportError("An unknown error occurred while importing the recipe.");
            }
        } finally {
            setIsImporting(false);
        }
    };
    
    const handleIngredientsScanned = (scannedIngredients: string[]) => {
        const newIngredients = scannedIngredients.filter(ing => !ingredients.includes(ing.toLowerCase()));
        setIngredients(prev => [...prev, ...newIngredients]);
        setIsCameraModalOpen(false);
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
        const recipesInPlan = mainRecipes.filter(recipe => recipeTitlesInPlan.includes(recipe.title));
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

    const handlePlayLesson = (lesson: Lesson) => {
        if (!selectedClass) return;
        setPlayingVideo({
            title: lesson.title,
            description: `A lesson from "${selectedClass.title}". Duration: ${lesson.duration}`,
            thumbnailUrl: lesson.thumbnailUrl,
            videoUrl: lesson.videoUrl,
        });
    };

    const handleQuestionSubmit = (question: string) => {
        // In a real app, this would send the question to a backend service
        console.log("Submitted question to expert:", question);
        setIsQuestionSubmitted(true);
    };

    const handleAskAnotherQuestion = () => {
        setIsQuestionSubmitted(false);
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
        setGeneratedRecipes(null);
        setGenerationError(null);
    }

    const handleLogin = (email: string) => {
        userService.loginUser(email);
        const user = userService.getCurrentUser();
        setCurrentUser(user);
        const hasPaid = userService.getPremiumStatus();
        setIsPremium(hasPaid || (user?.isAdmin ?? false));
        setIsLoginModalOpen(false);
    };

    const handleLogout = () => {
        userService.logoutUser();
        setCurrentUser(null);
        // Revert to stored premium status for non-admin users
        setIsPremium(userService.getPremiumStatus());
        setIsDashboardVisible(false);
    };

    const handleAddRecipe = (newRecipe: Recipe) => {
        setMainRecipes(prevRecipes => [newRecipe, ...prevRecipes]);
    };

    const renderContent = () => {
        if (currentView === 'bartender') {
            return <BartenderHelper />;
        }
        
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
                        <div className="flex items-center gap-4">
                            {isPremium ? (
                                <CookbookButton
                                    elementIdToPrint="generated-recipes-grid"
                                    ingredients={ingredients}
                                />
                            ) : (
                                <button
                                    onClick={() => setIsUpgradeModalOpen(true)}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-500 font-semibold rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 ease-in-out flex items-center gap-2"
                                    title="Upgrade to Premium to create a cookbook"
                                >
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    <span>Create Cookbook</span>
                                </button>
                            )}
                            <button
                                onClick={handleBackToBrowse}
                                className="px-4 py-2 bg-gray-200 text-text-secondary font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                &larr; Browse All Recipes
                            </button>
                        </div>
                    </div>
                    {generatedRecipes.length > 0 ? (
                        <div id="generated-recipes-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
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
        
        if (currentView === 'videos') {
            return (
                 <div className="space-y-12 animate-fade-in">
                    {videoData.map(category => (
                        <section key={category.title}>
                            <h2 className="text-2xl font-bold text-text-primary mb-6 border-b-2 border-primary/20 pb-2">{category.title}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {category.videos.map(video => (
                                    <VideoCard key={video.title} video={video} onClick={() => setPlayingVideo(video)} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )
        }


        if (currentView === 'plans') {
            if (selectedPlan) {
                return <MealPlanDetail 
                    plan={selectedPlan}
                    recipes={mainRecipes}
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
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-text-primary">
                        {currentView === 'saved' ? 'My Saved Recipes' : 'All Recipes'}
                    </h2>
                    {currentView === 'saved' && currentRecipes.length > 0 && (
                        isPremium ? (
                            <CookbookButton
                                elementIdToPrint="recipes-grid"
                            />
                        ) : (
                            <button
                                onClick={() => setIsUpgradeModalOpen(true)}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-500 font-semibold rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 ease-in-out flex items-center gap-2"
                                title="Upgrade to Premium to create a cookbook"
                            >
                                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                <span>Create Cookbook</span>
                            </button>
                        )
                    )}
                </div>
                {currentRecipes.length > 0 ? (
                    <>
                        <div id="recipes-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
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
    
    const renderMainContent = () => {
        if (isDashboardVisible && currentUser?.isAdmin) {
            return <AdminDashboard onBackToApp={() => setIsDashboardVisible(false)} onAddRecipe={handleAddRecipe} />;
        }

        if (selectedClass) {
            return (
                <CookingClassDetail
                    cookingClass={selectedClass}
                    onBack={() => setSelectedClass(null)}
                    onPlayLesson={handlePlayLesson}
                />
            );
        }

        return (
            <>
                <div className="flex justify-end items-center mb-4 gap-4">
                    {currentUser?.isAdmin && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                            <ShieldIcon className="w-4 h-4 text-indigo-500" />
                            <span>Admin</span>
                        </div>
                    )}
                    {currentUser && isPremium && !currentUser.isAdmin && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                            <CrownIcon className="w-4 h-4 text-yellow-500" />
                            <span>Premium</span>
                        </div>
                    )}
                    {currentUser ? (
                        <UserMenu
                            user={currentUser}
                            onLogout={handleLogout}
                            onShowDashboard={() => {
                                setSelectedClass(null); // Ensure other views are closed
                                setIsDashboardVisible(true);
                            }}
                        />
                    ) : (
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-focus transition-colors duration-200"
                        >
                            Sign In
                        </button>
                    )}
                </div>


                {currentView !== 'bartender' && (
                    <>
                        <Header />

                        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-5xl mx-auto mb-12 border border-border-color">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                {/* Left Side: Generate */}
                                <div className="flex flex-col">
                                    <h2 className="text-2xl font-bold text-text-primary mb-4 text-center md:text-left">Find Recipes You Can Make</h2>
                                    <p className="text-text-secondary mb-4 text-center md:text-left">Enter ingredients you have, or scan them with your camera.</p>
                                    <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
                                    <div className="relative flex py-5 items-center">
                                        <div className="flex-grow border-t border-gray-200"></div>
                                        <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold uppercase">Or</span>
                                        <div className="flex-grow border-t border-gray-200"></div>
                                    </div>
                                    <CameraInput onClick={() => setIsCameraModalOpen(true)} disabled={isGenerating} />
                                    <div className="mt-6">
                                        <button
                                            onClick={handleGenerateRecipes}
                                            disabled={isGenerating || ingredients.length === 0}
                                            className="w-full px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <SparklesIcon className="w-5 h-5"/>
                                            <span>{isGenerating ? 'Finding Recipes...' : 'Find Recipes'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Right Side: Import */}
                                <div className="flex flex-col">
                                    <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2 justify-center md:justify-start">
                                        Import from the Web
                                        {!isPremium && <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Premium</span>}
                                    </h2>
                                    <p className="text-text-secondary mb-4 text-center md:text-left">Found a recipe online? Paste the URL here to add it to your cookbook.</p>
                                    {isPremium ? (
                                        <div className="flex-grow flex flex-col">
                                            <UrlInput 
                                                recipeUrl={recipeUrl} 
                                                setRecipeUrl={setRecipeUrl} 
                                                onFetch={handleImportRecipe}
                                                isLoading={isImporting}
                                            />
                                            {importError && (
                                                <div className="mt-4 text-red-600 bg-red-50 p-3 rounded-md text-sm">{importError}</div>
                                            )}
                                            {importSuccessMessage && (
                                                <div className="mt-4 text-green-700 bg-green-50 p-3 rounded-md text-sm">{importSuccessMessage}</div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative p-6 border-2 border-dashed border-gray-300 rounded-lg text-center flex-grow flex flex-col justify-center items-center bg-gray-50">
                                            <LockClosedIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-text-secondary font-semibold">This is a Premium feature</p>
                                            <p className="text-sm text-gray-500 mb-4">Upgrade to import recipes from any website.</p>
                                            <button onClick={() => setIsUpgradeModalOpen(true)} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-focus">
                                                Upgrade Now
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <PremiumContent
                            isPremium={isPremium}
                            onUpgrade={() => setIsUpgradeModalOpen(true)}
                            recipes={newRecipes}
                            onSelectRecipe={setSelectedRecipe}
                            savedRecipeTitles={savedRecipeTitles}
                            onToggleSave={handleToggleSave}
                        />
                        
                        <AdvancedClasses
                            isPremium={isPremium}
                            onUpgrade={() => setIsUpgradeModalOpen(true)}
                            classes={cookingClassesData}
                            onSelectClass={setSelectedClass}
                        />

                        <AskAnExpert
                            isPremium={isPremium}
                            onUpgrade={() => setIsUpgradeModalOpen(true)}
                            isSubmitted={isQuestionSubmitted}
                            onSubmitQuestion={handleQuestionSubmit}
                            onAskAnother={handleAskAnotherQuestion}
                        />
                    </>
                )}


                <div className="flex justify-center mb-8 gap-1.5 p-1 bg-gray-200 rounded-lg max-w-xl mx-auto">
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
                    <button
                        onClick={() => handleViewChange('videos')}
                        className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors ${currentView === 'videos' ? 'bg-white text-primary shadow' : 'text-text-secondary hover:bg-gray-100'}`}
                    >
                        Videos
                    </button>
                    <button
                        onClick={() => handleViewChange('bartender')}
                        className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${currentView === 'bartender' ? 'bg-white text-primary shadow' : 'text-text-secondary hover:bg-gray-100'}`}
                    >
                        <CocktailIcon className="h-4 w-4" />
                        <span>Bartender</span>
                    </button>
                </div>

                {renderContent()}
            </>
        );
    }

    return (
        <div className="min-h-screen bg-secondary text-text-primary">
            <main className="container mx-auto px-4 py-8">
                {renderMainContent()}
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

            {playingVideo && (
                <VideoPlayerModal video={playingVideo} onClose={() => setPlayingVideo(null)} />
            )}
            
            {isCameraModalOpen && (
                <CameraModal 
                    onClose={() => setIsCameraModalOpen(false)} 
                    onIngredientsScanned={handleIngredientsScanned}
                />
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

            {isUpgradeModalOpen && (
                <UpgradeModal onClose={() => setIsUpgradeModalOpen(false)} />
            )}

            {isLoginModalOpen && (
                <LoginModal
                    onClose={() => setIsLoginModalOpen(false)}
                    onLogin={handleLogin}
                />
            )}

            {showUpgradeConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowUpgradeConfirmation(false)}>
                    <div className="bg-white rounded-lg shadow-xl text-center p-8 max-w-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                           <SparklesIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary mt-4">Welcome to Premium!</h2>
                        <p className="text-text-secondary mt-2">You've successfully upgraded. You now have access to all exclusive recipes, classes, and expert help.</p>
                        <button 
                            onClick={() => setShowUpgradeConfirmation(false)}
                            className="mt-6 w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus"
                        >
                            Start Exploring
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;