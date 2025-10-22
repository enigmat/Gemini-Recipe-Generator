import React, { useState, useMemo, useEffect } from 'react';
import { Recipe, ShoppingList, MealPlan, Video, VideoCategory, Lesson, CookingClass, User, Lead } from './types';
import Header from './components/Header';
import RecipeCard from './components/RecipeCard';
import SearchBar from './components/SearchBar';
import RecipeModal from './components/RecipeModal';
import TagFilter from './components/TagFilter';
import { recipes as allRecipesData } from './data/recipes';
import { mealPlans } from './data/mealPlans';
import { videoData } from './data/videos';
import { cookingClasses as cookingClassesData } from './data/cookingClasses';
import * as favoritesService from './services/favoritesService';
import * as userService from './services/userService';
import * as leadService from './services/leadService';
import IngredientInput from './components/IngredientInput';
import { generateRecipes, generateShoppingList, importRecipeFromUrl, fixRecipeImage, generateImage, generateRecipeFromPrompt, categorizeShoppingListItem } from './services/geminiService';
import Spinner from './components/Spinner';
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
import NewsletterSignup from './components/NewsletterSignup';
import ClockIcon from './components/icons/ClockIcon';
import UsersIcon from './components/icons/UsersIcon';
import FireIcon from './components/icons/FireIcon';
import HeartIcon from './components/icons/HeartIcon';
import { parseServings } from './utils/recipeUtils';
import ManualAddItem from './components/ManualAddItem';
import ShoppingCartIcon from './components/icons/ShoppingCartIcon';
import DownloadIcon from './components/icons/DownloadIcon';
import TrashIcon from './components/icons/TrashIcon';

const ITEMS_PER_PAGE = 12;
const RECIPES_STORAGE_KEY = 'marshmellowRecipes_allRecipes';
const CLASSES_STORAGE_KEY = 'marshmellowRecipes_cookingClasses';


type View = 'all' | 'saved' | 'plans' | 'videos' | 'bartender' | 'shopping';

const App: React.FC = () => {
    // Single source of truth for all recipes, with localStorage persistence
    const [allRecipes, setAllRecipes] = useState<Recipe[]>(() => {
        try {
            const storedRecipes = localStorage.getItem(RECIPES_STORAGE_KEY);
            if (storedRecipes) {
                return JSON.parse(storedRecipes);
            }
        } catch (error) {
            console.error("Error parsing recipes from localStorage", error);
        }
        return allRecipesData;
    });

    const [cookingClasses, setCookingClasses] = useState<CookingClass[]>(() => {
        try {
            const storedClasses = localStorage.getItem(CLASSES_STORAGE_KEY);
            if (storedClasses) {
                return JSON.parse(storedClasses);
            }
        } catch (error) {
            console.error("Error parsing cooking classes from localStorage", error);
        }
        return cookingClassesData;
    });

    // States for browsing and filtering
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [itemsToShow, setItemsToShow] = useState(ITEMS_PER_PAGE);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [savedRecipeTitles, setSavedRecipeTitles] = useState<string[]>([]);
    const [currentView, setCurrentView] = useState<View>('all');
    
    // States for user authentication and premium status
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
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
    
    // States for recipe from idea generation
    const [recipePrompt, setRecipePrompt] = useState('');
    const [promptError, setPromptError] = useState<string | null>(null);
    const [isGeneratingFromIdea, setIsGeneratingFromIdea] = useState(false);
    const [ideaGeneratedRecipe, setIdeaGeneratedRecipe] = useState<Recipe | null>(null);


    // States for URL import
    const [recipeUrl, setRecipeUrl] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [importError, setImportError] = useState<string | null>(null);
    const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);

    // State for Camera Modal
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

    // States for shopping list
    const [activeShoppingList, setActiveShoppingList] = useState<ShoppingList | null>(null);
    const [isShoppingListLoading, setIsShoppingListLoading] = useState(false);
    const [shoppingListError, setShoppingListError] = useState<string | null>(null);
    const [isAddingItem, setIsAddingItem] = useState(false);

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

    // Derived recipe lists from the single source of truth
    const activeRecipes = useMemo(() => allRecipes.filter(r => r.status === 'active'), [allRecipes]);
    const newThisMonthRecipes = useMemo(() => allRecipes.filter(r => r.status === 'new_this_month'), [allRecipes]);

    useEffect(() => {
        const user = userService.getCurrentUser();
        setCurrentUser(user);

        const hasPaid = userService.getPremiumStatus();
        setIsPremium(hasPaid || (user?.isAdmin ?? false));
        
        setAllUsers(userService.getAllUsers());
        setLeads(leadService.getAllLeads());
        setSavedRecipeTitles(favoritesService.getSavedRecipeTitles());

        // Check for Stripe checkout redirect
        const query = new URLSearchParams(window.location.search);
        if (query.get('checkout') === 'success') {
            userService.setPremiumStatus(true);
            const updatedUser = userService.getCurrentUser(); // Re-fetch user to get subscription
            setCurrentUser(updatedUser);
            setIsPremium(true);
            setShowUpgradeConfirmation(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        if (query.get('checkout') === 'cancel') {
             window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);
    
    // Persist recipes to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(allRecipes));
        } catch (error) {
            console.error("Error saving recipes to localStorage", error);
        }
    }, [allRecipes]);

    // Persist cooking classes to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(cookingClasses));
        } catch (error) {
            console.error("Error saving cooking classes to localStorage", error);
        }
    }, [cookingClasses]);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        allRecipes.forEach(recipe => {
            if (recipe.status !== 'archived') {
                recipe.tags.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags).sort();
    }, [allRecipes]);

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
            : activeRecipes;

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
    }, [searchQuery, selectedTags, currentView, savedRecipeTitles, allRecipes, activeRecipes]);

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
        setIdeaGeneratedRecipe(null);
        try {
            const recipes = await generateRecipes(ingredients);
            setGeneratedRecipes(recipes.map(r => ({ ...r, status: 'active' })));
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

    const handleGenerateRecipeFromPrompt = async () => {
        if (!isPremium) {
            setIsUpgradeModalOpen(true);
            return;
        }
        if (!recipePrompt.trim()) {
            setPromptError("Please describe the recipe you want to create.");
            return;
        }
        setIsGeneratingFromIdea(true);
        setPromptError(null);
        setIdeaGeneratedRecipe(null);

        try {
            const recipe = await generateRecipeFromPrompt(recipePrompt);
            
            // Add to global state so it persists
            setAllRecipes(prev => [recipe, ...prev]);
            
            // Save it to user's favorites
            if (!savedRecipeTitles.includes(recipe.title)) {
                handleToggleSave(recipe.title);
            }
            
            // Show the recipe on the page
            setIdeaGeneratedRecipe(recipe);
            
            // Clear the input
            setRecipePrompt('');
            
        } catch (error) {
            console.error("Error generating recipe from prompt:", error);
            if (error instanceof Error) {
                setPromptError(error.message);
            } else {
                setPromptError("An unknown error occurred while generating the recipe.");
            }
        } finally {
            setIsGeneratingFromIdea(false);
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
            const recipeWithStatus: Recipe = { ...newRecipe, status: 'active' };
            setAllRecipes(prev => [recipeWithStatus, ...prev]);
            
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

        setIsShoppingListLoading(true);
        setShoppingListError(null);
        try {
            const list = await generateShoppingList(selectedRecipe.ingredients);
            setActiveShoppingList(list);
            setCurrentView('shopping');
        } catch (error) {
            console.error("Error generating shopping list:", error);
            if (error instanceof Error) {
                setShoppingListError(error.message);
            } else {
                setShoppingListError("An unknown error occurred while generating the list.");
            }
            setCurrentView('shopping');
        } finally {
            setIsShoppingListLoading(false);
            setSelectedRecipe(null); // Close modal
        }
    };

    const handleGeneratePlanShoppingList = async () => {
        if (!selectedPlan) return;

        const recipeTitlesInPlan = selectedPlan.plan.map(day => day.recipeTitle);
        const recipesInPlan = allRecipes.filter(recipe => recipeTitlesInPlan.includes(recipe.title));
        const allIngredients = recipesInPlan.flatMap(recipe => recipe.ingredients);

        setIsShoppingListLoading(true);
        setShoppingListError(null);
        try {
            const list = await generateShoppingList(allIngredients);
            setActiveShoppingList(list);
            setCurrentView('shopping');
        } catch (error) {
            console.error("Error generating shopping list for plan:", error);
            if (error instanceof Error) {
                setShoppingListError(error.message);
            } else {
                setShoppingListError("An unknown error occurred while generating the list.");
            }
            setCurrentView('shopping');
        } finally {
            setIsShoppingListLoading(false);
            setSelectedPlan(null); // Return to meal plan list
        }
    };
    
    const handleGenerateFromSaved = async () => {
        const savedRecipes = allRecipes.filter(recipe => savedRecipeTitles.includes(recipe.title));
        if (savedRecipes.length === 0) {
            setShoppingListError("You have no saved recipes to generate a list from.");
            setActiveShoppingList(null);
            return;
        }

        const allIngredients = savedRecipes.flatMap(recipe => recipe.ingredients);
        
        setIsShoppingListLoading(true);
        setShoppingListError(null);
        try {
            const list = await generateShoppingList(allIngredients);
            setActiveShoppingList(list);
        } catch (error) {
            if (error instanceof Error) {
                setShoppingListError(error.message);
            } else {
                setShoppingListError("An error occurred generating the list from your saved recipes.");
            }
        } finally {
            setIsShoppingListLoading(false);
        }
    };
    
    const handleAddItemFromScratch = async (item: string) => {
        setIsAddingItem(true);
        try {
            const category = await categorizeShoppingListItem(item);
            setActiveShoppingList(prevList => {
                const newList: ShoppingList = prevList ? JSON.parse(JSON.stringify(prevList)) : [];
                const categoryIndex = newList.findIndex(cat => cat.category.toLowerCase() === category.toLowerCase());
                if (categoryIndex > -1) {
                    newList[categoryIndex].items.push(item);
                } else {
                    newList.push({ category, items: [item] });
                }
                return newList;
            });
        } catch (error) {
             console.error("Error adding item from scratch:", error);
        } finally {
            setIsAddingItem(false);
        }
    };
    
    const handleRemoveShoppingListItem = (categoryToRemove: string, itemToRemove: string) => {
        setActiveShoppingList(prevList => {
            if (!prevList) return null;

            const newList = prevList
                .map(category => {
                    if (category.category === categoryToRemove) {
                        return {
                            ...category,
                            items: category.items.filter(item => item !== itemToRemove)
                        };
                    }
                    return category;
                })
                .filter(category => category.items.length > 0);

            return newList.length > 0 ? newList : null;
        });
    };

    const handleClearShoppingList = () => {
        setActiveShoppingList(null);
        setShoppingListError(null);
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
        if (view !== 'shopping') {
            handleClearShoppingList();
        }
        setCurrentView(view);
        setSelectedPlan(null); // Reset selected plan when changing main view
        setSearchQuery(''); // Reset search
        setSelectedTags([]); // Reset tags
        setGeneratedRecipes(null);
        setGenerationError(null);
        setIdeaGeneratedRecipe(null);
    }

    const handleLogin = (email: string) => {
        userService.loginUser(email);
        const user = userService.getCurrentUser();
        setCurrentUser(user);
        const hasPaid = userService.getPremiumStatus();
        setIsPremium(hasPaid || (user?.isAdmin ?? false));
        setIsLoginModalOpen(false);
        setAllUsers(userService.getAllUsers()); // Refresh user list in case a new user was created
    };

    const handleLogout = () => {
        userService.logoutUser();
        setCurrentUser(null);
        setIsPremium(false); // Reset premium status on logout
        setIsDashboardVisible(false);
    };

    const handleAddRecipe = (newRecipe: Recipe) => {
        setAllRecipes(prevRecipes => [newRecipe, ...prevRecipes]);
    };
    
    const handleDeleteRecipe = (recipeTitle: string) => {
        if (window.confirm(`Are you sure you want to delete "${recipeTitle}"?`)) {
            setAllRecipes(prev => prev.filter(r => r.title !== recipeTitle));
        }
    };
    
    const handleUpdateRecipeStatus = (recipeTitle: string, newStatus: Recipe['status']) => {
        setAllRecipes(prev => 
            prev.map(r => r.title === recipeTitle ? { ...r, status: newStatus } : r)
        );
    };

    const handleFixRecipeImage = async (recipeTitle: string): Promise<void> => {
        const recipeToFix = allRecipes.find(r => r.title === recipeTitle);
        if (!recipeToFix) return;

        try {
            const newImageUrl = await fixRecipeImage(recipeToFix);
            setAllRecipes(prev => prev.map(r => r.title === recipeTitle ? { ...r, imageUrl: newImageUrl } : r));
        } catch (error) {
            console.error("Failed to fix image in App.tsx", error);
            alert("Could not fix the image. Please try again.");
        }
    };
    
    const handleDeleteUser = (email: string) => {
        if (window.confirm(`Are you sure you want to delete user "${email}"?`)) {
            userService.deleteUser(email);
            setAllUsers(userService.getAllUsers());
        }
    };

    const handleGiveFreeTime = (email: string, months: number) => {
        userService.giveFreeTime(email, months);
        setAllUsers(userService.getAllUsers()); // Refresh to show updated subscription
        const updatedCurrentUser = userService.getCurrentUser();
        if (updatedCurrentUser?.email === email) {
            setCurrentUser(updatedCurrentUser);
            setIsPremium(userService.getPremiumStatus());
        }
    };

    const handleUpdateUser = (email: string, updatedData: Partial<User>) => {
        userService.updateUser(email, updatedData);
        setAllUsers(userService.getAllUsers());
        const updatedCurrentUser = userService.getCurrentUser();
        if (updatedCurrentUser?.email === email) {
            setCurrentUser(updatedCurrentUser);
        }
    };

    // --- Cooking Class Handlers ---
    const handleAddCookingClass = (newClass: Omit<CookingClass, 'id'>) => {
        const classWithId: CookingClass = { ...newClass, id: `class-${new Date().getTime()}` };
        setCookingClasses(prev => [classWithId, ...prev]);
    };

    const handleUpdateCookingClass = (classId: string, updatedData: Partial<Omit<CookingClass, 'id' | 'lessons'>>) => {
        setCookingClasses(prev => prev.map(c => c.id === classId ? { ...c, ...updatedData } : c));
    };

    const handleDeleteCookingClass = (classId: string) => {
        if (window.confirm("Are you sure you want to delete this entire class and all its lessons?")) {
            setCookingClasses(prev => prev.filter(c => c.id !== classId));
        }
    };

    const handleAddLesson = (classId: string) => {
        const newLesson: Lesson = {
            id: `lesson-${new Date().getTime()}`,
            title: 'New Lesson',
            duration: '0:00',
            thumbnailUrl: 'https://via.placeholder.com/400x225.png?text=New+Lesson',
            videoUrl: '',
        };
        setCookingClasses(prev => prev.map(c => c.id === classId ? { ...c, lessons: [...c.lessons, newLesson] } : c));
    };

    const handleUpdateLesson = (classId: string, lessonId: string, updatedData: Partial<Omit<Lesson, 'id'>>) => {
        setCookingClasses(prev => prev.map(c => {
            if (c.id === classId) {
                const updatedLessons = c.lessons.map(l => l.id === lessonId ? { ...l, ...updatedData } : l);
                return { ...c, lessons: updatedLessons };
            }
            return c;
        }));
    };

    const handleDeleteLesson = (classId: string, lessonId: string) => {
        setCookingClasses(prev => prev.map(c => {
            if (c.id === classId) {
                const updatedLessons = c.lessons.filter(l => l.id !== lessonId);
                return { ...c, lessons: updatedLessons };
            }
            return c;
        }));
    };

    const handleUpdateClassImage = async (classId: string, prompt: string): Promise<void> => {
        try {
            const newImageUrl = await generateImage(prompt);
            setCookingClasses(prev => prev.map(c => c.id === classId ? { ...c, imageUrl: newImageUrl } : c));
        } catch (error) {
            console.error(`Failed to generate new image for class ${classId}:`, error);
            alert("Could not generate a new image. Please try again.");
        }
    };

    const renderContent = () => {
        if (currentView === 'bartender') {
            if (!isPremium) {
                return (
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-lg shadow-lg text-center my-12 border border-yellow-400/30">
                        <div className="flex justify-center items-center gap-3">
                            <LockClosedIcon className="w-8 h-8 text-yellow-400" />
                            <h2 className="text-2xl font-bold text-yellow-400">Bartender Helper</h2>
                        </div>
                        <p className="mt-2 text-gray-300 max-w-md mx-auto">
                            Describe a drink and get a custom cocktail recipe from our AI mixologist. Upgrade to Premium to unlock this feature.
                        </p>
                        <button
                            onClick={() => setIsUpgradeModalOpen(true)}
                            className="mt-6 px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-md hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-400 transition-colors duration-200 flex items-center gap-2 mx-auto"
                        >
                            <SparklesIcon className="w-5 h-5" />
                            <span>Upgrade to Premium</span>
                        </button>
                    </div>
                );
            }
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
                    recipes={allRecipes}
                    onSelectRecipe={setSelectedRecipe}
                    onBack={() => setSelectedPlan(null)}
                    onGenerateList={handleGeneratePlanShoppingList}
                    isGeneratingList={isShoppingListLoading}
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

        if (currentView === 'shopping') {
            return (
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto border border-border-color">
                    <h2 className="text-3xl font-bold text-text-primary text-center mb-6">Your Shopping List</h2>
                    {isShoppingListLoading ? (
                        <Spinner />
                    ) : shoppingListError ? (
                        <div className="text-center text-red-500 py-8 bg-red-50 rounded-lg">
                            <p className="text-xl font-semibold">Oops! Something went wrong.</p>
                            <p className="mt-2">{shoppingListError}</p>
                            <button onClick={handleClearShoppingList} className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus">
                                Start Over
                            </button>
                        </div>
                    ) : activeShoppingList ? (
                        <div className="animate-fade-in">
                             <div className="flex justify-between items-center mb-6">
                                <button onClick={handleClearShoppingList} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-text-secondary font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                                    <TrashIcon className="w-5 h-5"/>
                                    <span>Clear List</span>
                                </button>
                                <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors">
                                    <DownloadIcon className="w-5 h-5"/>
                                    <span>Print List</span>
                                </button>
                            </div>
                            <div className="space-y-6">
                                {activeShoppingList.map(({ category, items }) => (
                                    <div key={category}>
                                        <h3 className="text-lg font-semibold text-primary mb-2 border-b-2 border-primary/20 pb-1">{category}</h3>
                                        <ul className="space-y-2">
                                            {items.map((item, index) => (
                                                <li key={`${category}-${index}`} className="flex items-center justify-between group py-1">
                                                    <div className="flex items-center">
                                                        <input id={`item-${category}-${index}`} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-3 peer" />
                                                        <label htmlFor={`item-${category}-${index}`} className="text-text-secondary peer-checked:line-through peer-checked:text-gray-400 transition-colors">{item}</label>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveShoppingListItem(category, item)}
                                                        className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                                                        aria-label={`Remove ${item}`}
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                             <div className="mt-8 pt-6 border-t border-dashed">
                                <ManualAddItem onAddItem={handleAddItemFromScratch} isLoading={isAddingItem} />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center animate-fade-in">
                            <div className="bg-gray-50 p-6 rounded-lg border border-border-color flex flex-col items-center">
                                <h3 className="text-lg font-semibold text-text-primary mb-2">From My Saved Recipes</h3>
                                <p className="text-sm text-text-secondary mb-4 flex-grow">Generate a combined list for all {savedRecipeTitles.length} of your saved recipes.</p>
                                <button onClick={handleGenerateFromSaved} disabled={savedRecipeTitles.length === 0} className="w-full mt-auto px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus disabled:bg-gray-400">
                                    Generate List
                                </button>
                            </div>
                             <div className="bg-gray-50 p-6 rounded-lg border border-border-color flex flex-col">
                                <h3 className="text-lg font-semibold text-text-primary mb-2">Build From Scratch</h3>
                                <p className="text-sm text-text-secondary mb-4 flex-grow">Add items one by one and we'll categorize them for you automatically.</p>
                                <div className="mt-auto">
                                    <ManualAddItem onAddItem={handleAddItemFromScratch} isLoading={isAddingItem} />
                                </div>
                            </div>
                        </div>
                    )}
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
            return <AdminDashboard 
                onBackToApp={() => setIsDashboardVisible(false)} 
                onAddRecipe={handleAddRecipe}
                allUsers={allUsers}
                allRecipes={allRecipes}
                allLeads={leads}
                cookingClasses={cookingClasses}
                onDeleteUser={handleDeleteUser}
                onGiveFreeTime={handleGiveFreeTime}
                onUpdateUser={handleUpdateUser}
                onDeleteRecipe={handleDeleteRecipe}
                onUpdateRecipeStatus={handleUpdateRecipeStatus}
                onFixImage={handleFixRecipeImage}
                onAddCookingClass={handleAddCookingClass}
                onUpdateCookingClass={handleUpdateCookingClass}
                onDeleteCookingClass={handleDeleteCookingClass}
                onAddLesson={handleAddLesson}
                onUpdateLesson={handleUpdateLesson}
                onDeleteLesson={handleDeleteLesson}
                onUpdateClassImage={handleUpdateClassImage}
            />;
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


                {currentView !== 'bartender' && currentView !== 'shopping' && (
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
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <div className="flex flex-col">
                                    <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2 justify-center md:justify-start mx-auto">
                                        Create a Recipe from an Idea
                                        {!isPremium && <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Premium</span>}
                                    </h2>
                                    <p className="text-text-secondary mb-4 text-center">Describe a dish, and our AI chef will write the recipe for you.</p>

                                    {isPremium ? (
                                        <div className="max-w-2xl mx-auto">
                                            <textarea
                                                value={recipePrompt}
                                                onChange={(e) => {
                                                    setRecipePrompt(e.target.value);
                                                    if (promptError) setPromptError(null);
                                                }}
                                                placeholder="e.g., A spicy vegan curry with coconut milk and chickpeas..."
                                                className="w-full p-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                                rows={3}
                                                disabled={isGeneratingFromIdea}
                                            />
                                            {promptError && !isGeneratingFromIdea && (
                                                <div className="mt-4 text-red-600 bg-red-50 p-3 rounded-md text-sm">{promptError}</div>
                                            )}
                                            <div className="mt-4">
                                                <button
                                                    onClick={handleGenerateRecipeFromPrompt}
                                                    disabled={isGeneratingFromIdea || !recipePrompt.trim()}
                                                    className="w-full px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    <SparklesIcon className="w-5 h-5"/>
                                                    <span>{isGeneratingFromIdea ? 'Creating Recipe...' : 'Generate Recipe'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative p-6 border-2 border-dashed border-gray-300 rounded-lg text-center flex-grow flex flex-col justify-center items-center bg-gray-50 max-w-2xl mx-auto">
                                            <LockClosedIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-text-secondary font-semibold">This is a Premium feature</p>
                                            <p className="text-sm text-gray-500 mb-4">Upgrade to generate recipes from your ideas.</p>
                                            <button onClick={() => setIsUpgradeModalOpen(true)} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-focus">
                                                Upgrade Now
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                             {isGeneratingFromIdea && (
                                <div className="text-center py-8">
                                    <Spinner />
                                    <p className="mt-4 text-text-secondary">Your personal AI chef is creating a masterpiece...</p>
                                </div>
                            )}
                            {ideaGeneratedRecipe && !isGeneratingFromIdea && (
                                <div className="mt-8 pt-8 border-t-4 border-dashed border-primary/20 animate-fade-in">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-bold text-text-primary">Here's Your Custom Recipe!</h2>
                                        <button onClick={() => setIdeaGeneratedRecipe(null)} className="px-4 py-2 bg-gray-200 text-text-secondary font-semibold rounded-lg hover:bg-gray-300 transition-colors">&larr; Create Another</button>
                                    </div>
                                    <div className="bg-white rounded-lg overflow-hidden flex flex-col md:flex-row gap-8">
                                        <div className="w-full md:w-1/3 relative aspect-w-4 aspect-h-5">
                                            <img src={ideaGeneratedRecipe.imageUrl} alt={ideaGeneratedRecipe.title} className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <h3 className="text-3xl font-bold text-text-primary">{ideaGeneratedRecipe.title}</h3>
                                            <div className="my-2 flex flex-wrap gap-2">
                                                {ideaGeneratedRecipe.tags.map(tag => <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{tag}</span>)}
                                            </div>
                                            <p className="text-text-secondary my-4">{ideaGeneratedRecipe.description}</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center my-4 border-y border-border-color py-4">
                                                <div><ClockIcon className="w-6 h-6 mx-auto text-primary mb-1" /><p className="text-xs font-bold uppercase">Prep</p><p>{ideaGeneratedRecipe.prepTime}</p></div>
                                                <div><ClockIcon className="w-6 h-6 mx-auto text-primary mb-1" /><p className="text-xs font-bold uppercase">Cook</p><p>{ideaGeneratedRecipe.cookTime}</p></div>
                                                <div><UsersIcon className="w-6 h-6 mx-auto text-primary mb-1" /><p className="text-xs font-bold uppercase">Serves</p><p>{parseServings(ideaGeneratedRecipe.servings)}</p></div>
                                                <div><FireIcon className="w-6 h-6 mx-auto text-primary mb-1" /><p className="text-xs font-bold uppercase">Kcal</p><p>{ideaGeneratedRecipe.nutrition.calories}</p></div>
                                            </div>
                                            <button onClick={() => setSelectedRecipe(ideaGeneratedRecipe)} className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus">View Full Details & Options</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <PremiumContent
                            isPremium={isPremium}
                            onUpgrade={() => setIsUpgradeModalOpen(true)}
                            recipes={newThisMonthRecipes}
                            onSelectRecipe={setSelectedRecipe}
                            savedRecipeTitles={savedRecipeTitles}
                            onToggleSave={handleToggleSave}
                        />
                        
                        <AdvancedClasses
                            isPremium={isPremium}
                            onUpgrade={() => setIsUpgradeModalOpen(true)}
                            classes={cookingClasses}
                            onSelectClass={setSelectedClass}
                        />

                        <AskAnExpert
                            isPremium={isPremium}
                            onUpgrade={() => setIsUpgradeModalOpen(true)}
                            isSubmitted={isQuestionSubmitted}
                            onSubmitQuestion={handleQuestionSubmit}
                            onAskAnother={handleAskAnotherQuestion}
                        />

                        <NewsletterSignup />
                    </>
                )}


                <div className="flex justify-center mb-8 gap-1.5 p-1 bg-gray-200 rounded-lg max-w-2xl mx-auto">
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
                        onClick={() => handleViewChange('shopping')}
                        className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${currentView === 'shopping' ? 'bg-white text-primary shadow' : 'text-text-secondary hover:bg-gray-100'}`}
                    >
                        <ShoppingCartIcon className="h-4 w-4" />
                        <span>Shopping List</span>
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
                         {!isPremium && <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full ml-1">Premium</span>}
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
                    isGeneratingList={isShoppingListLoading}
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