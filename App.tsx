


import React, { useState, useMemo, useEffect } from 'react';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import TagFilter from './components/TagFilter';
import { Recipe, User, ShoppingList, MealPlan, Video, CookingClass, Newsletter, Lead, Product, CocktailRecipe, SavedCocktail, ExpertQuestion } from './types';
import * as favoritesService from './services/favoritesService';
import EmptyState from './components/EmptyState';
import BookOpenIcon from './components/icons/BookOpenIcon';
import SearchIcon from './components/icons/SearchIcon';
import HeartIcon from './components/icons/HeartIcon';
import LoginModal from './components/LoginModal';
import * as userService from './services/userService';
import ProfileModal from './components/ProfileModal';
import ChefHatIcon from './components/icons/ChefHatIcon';
import ShoppingListModal from './components/ShoppingListModal';
import ShoppingCartIcon from './components/icons/ShoppingCartIcon';
import RecipeCarousel from './components/RecipeCarousel';
import * as shoppingListManager from './services/shoppingListManager';
import SaveListModal from './components/SaveListModal';
import ListsOverviewModal from './components/ListsOverviewModal';
import { mealPlans } from './data/mealPlans';
import MealPlanCard from './components/MealPlanCard';
import CalendarDaysIcon from './components/icons/CalendarDaysIcon';
import CheckIcon from './components/icons/CheckIcon';
import ChevronLeftIcon from './components/icons/ChevronLeftIcon';
import MainTabs from './components/MainTabs';
import CookMode from './components/CookMode';
import { videos } from './data/videos';
import VideoCard from './components/VideoCard';
import VideoPlayerModal from './components/VideoPlayerModal';
import FilmIcon from './components/icons/FilmIcon';
import PremiumContent from './components/PremiumContent';
import UpgradeModal from './components/UpgradeModal';
import LockClosedIcon from './components/icons/LockClosedIcon';
import { cookingClasses } from './data/cookingClasses';
import CookingClassCard from './components/CookingClassCard';
import CookingClassDetail from './components/CookingClassDetail';
import MortarPestleIcon from './components/icons/MortarPestleIcon';
import AdminDashboard from './components/AdminDashboard';
import LayoutDashboardIcon from './components/icons/LayoutDashboardIcon';
import XIcon from './components/icons/XIcon';
import { generateImageFromPrompt, generateRecipeDetailsFromTitle, generateRecipeFromUrl } from './services/geminiService';
import * as newsletterService from './services/newsletterService';
import * as leadService from './services/leadService';
import NewsletterSignup from './components/NewsletterSignup';
import UrlInput from './components/UrlInput';
import IngredientInput from './components/IngredientInput';
import CameraInput from './components/CameraInput';
import Footer from './components/Footer';
import DownloadIcon from './components/icons/DownloadIcon';
import SearchBar from './components/SearchBar';
import CookbookTagFilter from './components/CookbookTagFilter';
import CheckCircleIcon from './components/icons/CheckCircleIcon';
import UserMenu from './components/UserMenu';
import UserCircleIcon from './components/icons/UserCircleIcon';
import BartenderHelper from './components/BartenderHelper';
import AskAnExpert from './components/AskAnExpert';
import * as ratingService from './services/ratingService';
import * as recipeService from './services/recipeService';
import Marketplace from './components/Marketplace';
import * as marketplaceService from './services/marketplaceService';
import PrivacyPolicy from './components/PrivacyPolicy';
import * as cocktailService from './services/cocktailService';
import MyBar from './components/MyBar';
import AdvancedClasses from './components/AdvancedClasses';
import ExpertQAPremiumOffer from './components/ExpertQAPremiumOffer';
import { initialExpertQuestions } from './data/expertQuestions';
import PantryChef from './components/PantryChef';
import AboutUsPage from './components/AboutUsPage';
import * as imageStore from './services/imageStore';
import MealPlanGenerator from './components/MealPlanGenerator';
import RecipeOfTheDay from './components/RecipeOfTheDay';
import * as recipeOfTheDayService from './services/recipeOfTheDayService';
import UnitToggleButton from './components/UnitToggleButton';
import { runMigration } from './services/migrationService';
import CocktailMenu from './components/CocktailMenu';

const RECIPES_PER_PAGE = 12;

const applyRatings = (recipes: Recipe[]): Recipe[] => {
    return recipes.map(recipe => {
        const storedRating = ratingService.getRating(recipe.id);
        return storedRating ? { ...recipe, rating: storedRating } : recipe;
    });
};

const App: React.FC = () => {
    // Run data migration before any state is initialized
    runMigration();
    
    const [allRecipes, setAllRecipes] = useState<Recipe[]>(() => applyRatings(recipeService.getAllRecipes()));
    const [newThisMonthRecipes, setNewThisMonthRecipes] = useState<Recipe[]>(() => applyRatings(recipeService.getNewRecipes()));
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [previewRecipe, setPreviewRecipe] = useState<Recipe | null>(null);
    const [activeTab, setActiveTab] = useState<string>('All Recipes');
    const [selectedTag, setSelectedTag] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [favorites, setFavorites] = useState<number[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [pantryIngredients, setPantryIngredients] = useState<string[]>([]);
    const [committedPantryIngredients, setCommittedPantryIngredients] = useState<string[]>([]);
    const [measurementSystem, setMeasurementSystem] = useState<'metric' | 'us'>('us');
    const [selectedRecipeIds, setSelectedRecipeIds] = useState<number[]>([]);
    const [cookbookSelectedTag, setCookbookSelectedTag] = useState<string>('All');
    
    // Shopping lists state
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [viewingList, setViewingList] = useState<ShoppingList | null>(null);
    const [isSaveListModalOpen, setIsSaveListModalOpen] = useState(false);
    const [isListsOverviewOpen, setIsListsOverviewOpen] = useState(false);

    // Meal plans state
    const [viewingMealPlan, setViewingMealPlan] = useState<MealPlan | null>(null);

    // Video player state
    const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

    // Cook mode state
    const [cookModeRecipe, setCookModeRecipe] = useState<Recipe | null>(null);

    // Premium feature state
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [viewingCookingClass, setViewingCookingClass] = useState<CookingClass | null>(null);
    
    // Admin state
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [sentNewsletters, setSentNewsletters] = useState<Newsletter[]>([]);
    const [collectedLeads, setCollectedLeads] = useState<Lead[]>([]);
    const [isUpdatingAllImages, setIsUpdatingAllImages] = useState(false);

    // Extractor state
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractError, setExtractError] = useState<string | null>(null);

    // Pagination state
    const [visibleRecipeCount, setVisibleRecipeCount] = useState(RECIPES_PER_PAGE);

    // Marketplace state
    const [products, setProducts] = useState<Product[]>([]);
    
    // Static Pages State
    const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
    
    // My Bar state
    const [savedCocktails, setSavedCocktails] = useState<SavedCocktail[]>([]);
    const [standardCocktails, setStandardCocktails] = useState<SavedCocktail[]>([]);

    // Expert Q&A state
    const [expertQuestions, setExpertQuestions] = useState<ExpertQuestion[]>(initialExpertQuestions);

    // Recipe of the Day state
    const [recipeOfTheDay, setRecipeOfTheDay] = useState<Recipe | null>(null);
    const [isLoadingRecipeOfTheDay, setIsLoadingRecipeOfTheDay] = useState<boolean>(true);

    const isRecipeOfTheDayArchived = useMemo(() => {
        if (!recipeOfTheDay) return false;
        return allRecipes.some(r => r.title.toLowerCase() === recipeOfTheDay.title.toLowerCase());
    }, [recipeOfTheDay, allRecipes]);


    const allCategoryTags = useMemo(() => {
        const tags = new Set<string>();
        allRecipes.forEach(recipe => {
            recipe.tags?.forEach(tag => tags.add(tag.trim()));
        });
        return Array.from(tags).sort((a, b) => a.localeCompare(b));
    }, [allRecipes]);

    useEffect(() => {
        const savedSystem = localStorage.getItem('recipeAppMeasurementSystem');
        if (savedSystem === 'us' || savedSystem === 'metric') {
            setMeasurementSystem(savedSystem as 'metric' | 'us');
        }
        const user = userService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        // Load all data for admin panel
        setAllUsers(userService.getAllUsers());
        setSentNewsletters(newsletterService.getSentNewsletters());
        setCollectedLeads(leadService.getLeads());
        ratingService.loadRatings();
        setProducts(marketplaceService.getProducts());
        setStandardCocktails(cocktailService.getStandardCocktails());

        const initializeDailyFeatures = async () => {
            setIsLoadingRecipeOfTheDay(true);
            try {
                const newlyArchivedRecipe = await recipeOfTheDayService.archiveYesterdaysRecipe();
                if (newlyArchivedRecipe) {
                    setAllRecipes(prev => [newlyArchivedRecipe, ...prev]);
                }
                const recipe = await recipeOfTheDayService.getTodaysRecipe();
                setRecipeOfTheDay(recipe);
            } catch (error) {
                console.error("Failed to load Recipe of the Day", error);
                setRecipeOfTheDay(null);
            } finally {
                setIsLoadingRecipeOfTheDay(false);
            }
        };

        initializeDailyFeatures();
    }, []);

    useEffect(() => {
        const userEmail = currentUser?.email || null;
        setFavorites(favoritesService.getFavorites(userEmail));
        setShoppingLists(shoppingListManager.getLists(userEmail));
        setSavedCocktails(cocktailService.getSavedCocktails(userEmail));
    }, [currentUser]);

    // Reset recipe pagination when filters change
    useEffect(() => {
        setVisibleRecipeCount(RECIPES_PER_PAGE);
    }, [searchQuery, committedPantryIngredients, selectedTag, activeTab]);

    const handleSystemChange = (system: 'metric' | 'us') => {
        setMeasurementSystem(system);
        localStorage.setItem('recipeAppMeasurementSystem', system);
    };

    const handleToggleFavorite = (recipeId: number) => {
        if (!currentUser) {
            setIsLoginModalOpen(true);
            return;
        }
        if (!currentUser.isPremium) {
            setIsUpgradeModalOpen(true);
            return;
        }
        const userEmail = currentUser.email;
        if (favorites.includes(recipeId)) {
            favoritesService.removeFavorite(recipeId, userEmail);
            setFavorites(favorites.filter(id => id !== recipeId));
        } else {
            favoritesService.addFavorite(recipeId, userEmail);
            setFavorites([...favorites, recipeId]);
        }
    };

    const handleAddRating = (recipeId: number, score: number) => {
        if (!currentUser) {
            setIsLoginModalOpen(true);
            return;
        }

        ratingService.addRating(recipeId, score, currentUser.email);
        const updatedRating = ratingService.getRating(recipeId);

        const updateRecipeRating = (recipes: Recipe[]) => 
            recipes.map(r => r.id === recipeId ? { ...r, rating: updatedRating } : r);

        setAllRecipes(prev => updateRecipeRating(prev));
        setNewThisMonthRecipes(prev => updateRecipeRating(prev));
    };

    const handleToggleSelect = (recipeId: number) => {
        if (!currentUser) {
            setIsLoginModalOpen(true);
            return;
        }
        if (!currentUser.isPremium) {
            setIsUpgradeModalOpen(true);
            return;
        }
        setSelectedRecipeIds(prevSelected =>
            prevSelected.includes(recipeId)
                ? prevSelected.filter(id => id !== recipeId)
                : [...prevSelected, recipeId]
        );
    };

    const handleLoginSuccess = (user: User) => {
        setCurrentUser(user);
        setIsLoginModalOpen(false);
        // Refresh users list in case of new signup
        setAllUsers(userService.getAllUsers());
    };

    const handleLogout = () => {
        userService.logout();
        setCurrentUser(null);
        setFavorites([]);
        setActiveTab('All Recipes');
        setSelectedTag('All'); 
        setShoppingLists([]);
        setViewingMealPlan(null);
        setViewingCookingClass(null);
        setSavedCocktails([]);
    };

    const handleUpdateUser = (updatedUser: User) => {
        // If the user being updated is the one currently logged in, update their session too.
        if (currentUser && currentUser.email === updatedUser.email) {
            const userInSession = userService.updateUser(updatedUser); // This updates session and master list
            if (userInSession) {
                setCurrentUser(userInSession);
            }
        } else {
            // Otherwise, just update the master list
            userService.updateUserInList(updatedUser);
        }
        // Refresh the user list for the admin panel.
        setAllUsers(userService.getAllUsers());
    };

    const handleUpgradeUser = (preferences: string[]) => {
        if (!currentUser) return;
        const upgradedUser: User = { 
            ...currentUser, 
            isPremium: true, 
            foodPreferences: preferences 
        };
        handleUpdateUser(upgradedUser);
        setIsUpgradeModalOpen(false);
    };

    const handleCardClick = (recipe: Recipe) => {
        if (previewRecipe) return; // Don't open another recipe while one is in preview
        if (!currentUser?.isPremium) {
            setIsUpgradeModalOpen(true);
            return;
        }
        setSelectedRecipe(recipe);
    };

    const handleCloseModal = () => {
        setSelectedRecipe(null);
        setPreviewRecipe(null);
    };

    const handleEnterCookMode = (recipe: Recipe) => {
        setSelectedRecipe(null); // Close the modal first
        setCookModeRecipe(recipe);
    };

    const handleExitCookMode = () => {
        setCookModeRecipe(null);
    };
    
    const handleSelectTab = (tab: string) => {
        if (['My Cookbook', 'Shopping List', 'My Bar', 'AI Meal Planner', 'Cocktail Menu'].includes(tab)) {
            if (!currentUser) {
                setIsLoginModalOpen(true);
                return;
            }
        }

        if (tab === 'Shopping List') {
            if (currentUser && !currentUser.isPremium) {
                setIsUpgradeModalOpen(true);
                return;
            }
            setIsListsOverviewOpen(true);
            return; 
        }

        setActiveTab(tab);
        setSearchQuery('');
        setPantryIngredients([]);
        setCommittedPantryIngredients([]);
        setSelectedTag('All');
        setViewingMealPlan(null);
        setViewingCookingClass(null);
    };

    const handleSelectTag = (tag: string) => {
        setSelectedTag(tag);
    };
    
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const handlePantryIngredientsChange = (ingredients: string[]) => {
        setPantryIngredients(ingredients);
    };

    const handleFindRecipesFromIngredients = () => {
        setCommittedPantryIngredients(pantryIngredients);
    };

    const handleSaveList = (name: string) => {
        if (!currentUser) return;

        const newLists = [...shoppingLists];
        const existingList = newLists.find(list => list.name.toLowerCase() === name.toLowerCase());

        if (existingList) {
            const updatedRecipeIds = Array.from(new Set([...existingList.recipeIds, ...selectedRecipeIds]));
            existingList.recipeIds = updatedRecipeIds;
        } else {
            const newList: ShoppingList = {
                id: Date.now().toString(),
                name: name,
                recipeIds: selectedRecipeIds
            };
            newLists.push(newList);
        }
        
        setShoppingLists(newLists);
        shoppingListManager.saveLists(newLists, currentUser.email);
        setSelectedRecipeIds([]);
        setIsSaveListModalOpen(false);
    };

    const handleDeleteList = (listId: string) => {
        if (!currentUser) return;
        const newLists = shoppingLists.filter(list => list.id !== listId);
        setShoppingLists(newLists);
        shoppingListManager.saveLists(newLists, currentUser.email);
    };

    const handleRenameList = (listId: string, newName: string) => {
        if (!currentUser) return;
        const newLists = shoppingLists.map(list => 
            list.id === listId ? { ...list, name: newName } : list
        );
        setShoppingLists(newLists);
        shoppingListManager.saveLists(newLists, currentUser.email);
    };
    
    const handlePlayVideo = (video: Video) => {
        setPlayingVideo(video);
    };

    const handleCloseVideo = () => {
        setPlayingVideo(null);
    };
    
    const handleSaveCocktail = (recipe: CocktailRecipe, image: string) => {
        if (!currentUser) {
            setIsLoginModalOpen(true);
            return;
        }
        if (!currentUser.isPremium) {
            setIsUpgradeModalOpen(true);
            return;
        }
        const newCocktail = cocktailService.saveCocktail(recipe, image, currentUser.email);
        if (newCocktail) {
            setSavedCocktails(prev => [newCocktail, ...prev]);
        }
    };

    const handleSaveStandardCocktail = async (cocktail: SavedCocktail) => {
        if (!currentUser) {
            setIsLoginModalOpen(true);
            return;
        }
        if (!currentUser.isPremium) {
            setIsUpgradeModalOpen(true);
            return;
        }

        let imageBase64 = cocktail.image;
        if (cocktail.image.startsWith('indexeddb:')) {
            const imageId = cocktail.image.split(':')[1];
            const imageData = await imageStore.getImage(imageId);
            if (!imageData) {
                alert("Sorry, there was an error saving this cocktail's image.");
                return;
            }
            imageBase64 = imageData;
        }

        const newCocktail = cocktailService.saveCocktail(cocktail, imageBase64, currentUser.email);
        if (newCocktail) {
            setSavedCocktails(prev => [newCocktail, ...prev]);
        } else {
            alert(`${cocktail.title} is already in your bar!`);
        }
    };

    const handleDeleteCocktail = (cocktailId: string) => {
        if (!currentUser) return;
        cocktailService.deleteCocktail(cocktailId, currentUser.email);
        setSavedCocktails(prev => prev.filter(c => c.id !== cocktailId));
    };

    const handleAddExpertQuestion = (question: string, topic: string) => {
        const newQuestion: ExpertQuestion = {
            id: `q${Date.now()}`,
            question,
            topic,
            status: 'Pending',
            submittedDate: new Date().toISOString(),
        };
        setExpertQuestions(prev => [newQuestion, ...prev]);
    };

    const handleSaveChanges = () => {
        recipeService.saveAllRecipes(allRecipes);
        recipeService.saveNewRecipes(newThisMonthRecipes);
        return Promise.resolve();
    };

    const handleArchiveRecipeOfTheDay = async (recipeToArchive: Recipe) => {
        if (!recipeToArchive) return;

        if (allRecipes.some(r => r.title.toLowerCase() === recipeToArchive.title.toLowerCase())) {
            alert(`Recipe "${recipeToArchive.title}" already exists in the main recipe list.`);
            return;
        }

        const newlyAddedRecipe = await recipeService.addRecipeIfUnique(recipeToArchive);
        if (newlyAddedRecipe) {
            setAllRecipes(prev => [newlyAddedRecipe, ...prev]);
            alert(`Recipe "${newlyAddedRecipe.title}" has been added to the main recipe list.`);
        } else {
            alert(`Could not add "${recipeToArchive.title}". It might already exist.`);
        }
    };

    const handleMoveRecipeFromRotdToMain = async (recipeToMove: Recipe): Promise<boolean> => {
        const newlyAddedRecipe = await recipeService.addRecipeIfUnique(recipeToMove);
        
        if (newlyAddedRecipe) {
            setAllRecipes(prev => [newlyAddedRecipe, ...prev]);
    
            const scheduledRecipes = recipeService.getScheduledRecipes();
            const updatedScheduledRecipes = scheduledRecipes.filter(r => r.id !== recipeToMove.id);
            recipeService.saveScheduledRecipes(updatedScheduledRecipes);
    
            alert(`Recipe "${newlyAddedRecipe.title}" has been moved to the main recipe list.`);
            return true;
        } else {
            alert(`Could not move "${recipeToMove.title}". It might already exist in the main list.`);
            return false;
        }
    };


    // Admin panel functions
    const handleAddNewRecipe = async (title: string, addToNew: boolean, addToRecipeOfTheDayPool: boolean): Promise<void> => {
        const recipeDetails = await generateRecipeDetailsFromTitle(title);
        const image = await generateImageFromPrompt(recipeDetails.title);
        
        const newRecipeId = Date.now();
        await imageStore.setImage(newRecipeId.toString(), image);

        const newRecipe: Recipe = {
            id: newRecipeId,
            image: `indexeddb:${newRecipeId}`,
            ...recipeDetails
        };
        
        if (addToRecipeOfTheDayPool) {
            const scheduledRecipes = recipeService.getScheduledRecipes();
            recipeService.saveScheduledRecipes([newRecipe, ...scheduledRecipes]);
        } else {
            // Only add to main lists if it's NOT for the ROTD pool
            setAllRecipes(prev => [newRecipe, ...prev]);
    
            if (addToNew) {
                setNewThisMonthRecipes(prev => [newRecipe, ...prev]);
            }
        }
    };

    const handleDeleteRecipe = (recipeId: number) => {
        setAllRecipes(prev => prev.filter(r => r.id !== recipeId));
        setNewThisMonthRecipes(prev => prev.filter(r => r.id !== recipeId));
    };

    const handleRemoveFromNew = (recipeId: number) => {
        setNewThisMonthRecipes(prev => prev.filter(r => r.id !== recipeId));
    };

    const handleAddToNew = (recipeId: number) => {
        const recipeToAdd = allRecipes.find(r => r.id === recipeId);
        if (recipeToAdd && !newThisMonthRecipes.some(r => r.id === recipeId)) {
            setNewThisMonthRecipes(prev => [recipeToAdd, ...prev]);
        }
    };

    const handleUpdateRecipeWithAI = async (recipeId: number, title: string) => {
        const recipeDetails = await generateRecipeDetailsFromTitle(title);
        const image = await generateImageFromPrompt(recipeDetails.title);
    
        await imageStore.setImage(recipeId.toString(), image);

        const updateFunction = (prevRecipes: Recipe[]): Recipe[] => {
            const index = prevRecipes.findIndex(r => r.id === recipeId);
            if (index === -1) {
                return prevRecipes;
            }
    
            const originalRecipe = prevRecipes[index];
            const updatedRecipe: Recipe = {
                ...originalRecipe,
                ...recipeDetails,
                image: `indexeddb:${recipeId}`,
            };
            
            const newRecipes = [...prevRecipes];
            newRecipes[index] = updatedRecipe;
            return newRecipes;
        };
        
        setAllRecipes(updateFunction);
        setNewThisMonthRecipes(updateFunction);
    };

    const handleUpdateAllRecipeImages = async (): Promise<void> => {
        setIsUpdatingAllImages(true);
        try {
            // Iterate sequentially to avoid overwhelming the browser with concurrent requests.
            for (const recipeToUpdate of allRecipes) {
                try {
                    const imageData = await generateImageFromPrompt(recipeToUpdate.title);
                    await imageStore.setImage(recipeToUpdate.id.toString(), imageData);
                    
                    const newImageSrc = `indexeddb:${recipeToUpdate.id}`;

                    // Update state incrementally for better feedback and stability.
                    const updateRecipeInList = (recipes: Recipe[]) => recipes.map(r => 
                        r.id === recipeToUpdate.id ? { ...r, image: newImageSrc } : r
                    );

                    setAllRecipes(prevRecipes => updateRecipeInList(prevRecipes));
                    setNewThisMonthRecipes(prevRecipes => updateRecipeInList(prevRecipes));
                
                } catch (error) {
                    console.error(`Failed to generate image for recipe "${recipeToUpdate.title}":`, error);
                    // We just log the error and continue with the next one.
                }
            }
            alert("Finished updating all recipe images."); // Add a final confirmation.
        } catch (error) {
            console.error("A critical error occurred during bulk image update:", error);
            alert("A critical error occurred during the update process. Check the console for details.");
        } finally {
            setIsUpdatingAllImages(false);
        }
    };

    const handleDeleteUser = (userEmail: string) => {
        userService.deleteUser(userEmail);
        setAllUsers(userService.getAllUsers());
    };

    const handleSendNewsletter = (newsletterData: Omit<Newsletter, 'id' | 'sentDate'>) => {
        const newNewsletter = newsletterService.sendNewsletter(newsletterData);
        setSentNewsletters(prev => [newNewsletter, ...prev]);
    };

    const handleUpdateProducts = (updatedProducts: Product[]) => {
        setProducts(updatedProducts);
        marketplaceService.saveProducts(updatedProducts);
    };

    const handleUpdateStandardCocktails = (cocktails: SavedCocktail[]) => {
        setStandardCocktails(cocktails);
        cocktailService.saveStandardCocktails(cocktails);
    };

    // --- Extractor & Generator functions ---
    const handleExtractFromUrl = async (url: string) => {
        if (!currentUser?.isPremium) {
            setIsUpgradeModalOpen(true);
            return;
        }
        setIsExtracting(true);
        setExtractError(null);
        try {
            const recipeDetails = await generateRecipeFromUrl(url);
            const image = await generateImageFromPrompt(recipeDetails.title);
            
            const newRecipeId = Date.now();
            await imageStore.setImage(newRecipeId.toString(), image);

            const newRecipe: Recipe = {
                id: newRecipeId,
                image: `indexeddb:${newRecipeId}`,
                ...recipeDetails
            };
            setPreviewRecipe(newRecipe);
        } catch (e: any) {
            setExtractError(e.message || 'An unknown error occurred.');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleRecipeGenerated = async (recipeDetails: Omit<Recipe, 'id' | 'image'>, image: string) => {
        const newRecipeId = Date.now();
        await imageStore.setImage(newRecipeId.toString(), image);

        const newRecipe: Recipe = {
            id: newRecipeId,
            image: `indexeddb:${newRecipeId}`,
            ...recipeDetails
        };
        setPreviewRecipe(newRecipe);
    };
    
    const handleSaveNewRecipe = (recipe: Recipe) => {
        setAllRecipes(prev => [recipe, ...prev]);
        if (currentUser && currentUser.isPremium) {
            handleToggleFavorite(recipe.id);
        }
        setPreviewRecipe(null);
    };

    const handleDiscardNewRecipe = (recipe: Recipe) => {
        if (recipe.image.startsWith('indexeddb:')) {
            imageStore.deleteImage(recipe.id.toString());
        }
        setPreviewRecipe(null);
    };

    const handleSubscribe = (email: string) => {
        newsletterService.subscribeByEmail(email);
        leadService.addLead(email);
        // Refresh data for admin dashboard if it's open
        setCollectedLeads(leadService.getLeads());
        setAllUsers(userService.getAllUsers());
    };

    // --- Render Logic ---
    const favoriteRecipes = useMemo(() => {
        return allRecipes.filter(r => favorites.includes(r.id));
    }, [favorites, allRecipes]);

    const recommendedRecipes = useMemo(() => {
        if (!currentUser?.isPremium || !currentUser.foodPreferences?.length) {
            // Fallback for premium users without preferences or for calculation before state update
            return newThisMonthRecipes;
        }
        const preferenceSet = new Set(currentUser.foodPreferences);
        const recommendations = allRecipes.filter(recipe => preferenceSet.has(recipe.cuisine));
        
        // Ensure there's always a good number of recommendations
        if (recommendations.length < 10) {
            const fallback = allRecipes.filter(r => !recommendations.some(rec => rec.id === r.id));
            return [...recommendations, ...fallback.slice(0, 10 - recommendations.length)];
        }
        return recommendations;
    }, [currentUser, allRecipes, newThisMonthRecipes]);

    // FIX: Add component render logic and default export to fix module resolution error.
    const filteredAndSortedCookbook = useMemo(() => {
        return favoriteRecipes
            .filter(r => cookbookSelectedTag === 'All' || r.tags?.includes(cookbookSelectedTag))
            .sort((a, b) => a.title.localeCompare(b.title));
    }, [favoriteRecipes, cookbookSelectedTag]);
    
    const cookbookTags = useMemo(() => {
        return [...new Set(favoriteRecipes.flatMap(r => r.tags || []))].sort();
    }, [favoriteRecipes]);
    
    
    const filteredRecipes = useMemo(() => {
        let recipesToFilter = allRecipes;
        
        if (searchQuery) {
            recipesToFilter = recipesToFilter.filter(r =>
                r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        if (selectedTag !== 'All') {
            recipesToFilter = recipesToFilter.filter(r => r.tags?.includes(selectedTag));
        }
        
        if (committedPantryIngredients.length > 0) {
            recipesToFilter = recipesToFilter.filter(recipe =>
                committedPantryIngredients.every(pantryIng =>
                    recipe.ingredients.some(recipeIng =>
                        recipeIng.name.toLowerCase().includes(pantryIng.toLowerCase())
                    )
                )
            );
        }
    
        return recipesToFilter;
    }, [allRecipes, searchQuery, selectedTag, committedPantryIngredients]);


    if (cookModeRecipe) {
        return <CookMode recipe={cookModeRecipe} onExit={handleExitCookMode} measurementSystem={measurementSystem} />;
    }
    
    if (activeTab === 'Admin Dashboard' && currentUser?.isAdmin) {
        return (
            <AdminDashboard
                allRecipes={allRecipes}
                newRecipes={newThisMonthRecipes}
                users={allUsers}
                sentNewsletters={sentNewsletters}
                collectedLeads={collectedLeads}
                products={products}
                standardCocktails={standardCocktails}
                onAddRecipe={handleAddNewRecipe}
                onDeleteRecipe={handleDeleteRecipe}
                onUpdateRecipeWithAI={handleUpdateRecipeWithAI}
                onUpdateAllRecipeImages={handleUpdateAllRecipeImages}
                isUpdatingAllImages={isUpdatingAllImages}
                onUpdateUserRoles={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                onSendNewsletter={handleSendNewsletter}
                onUpdateProducts={handleUpdateProducts}
                onUpdateStandardCocktails={handleUpdateStandardCocktails}
                onExit={() => handleSelectTab('All Recipes')}
                onRemoveFromNew={handleRemoveFromNew}
                onAddToNew={handleAddToNew}
                onSaveChanges={handleSaveChanges}
                onMoveRecipeFromRotdToMain={handleMoveRecipeFromRotdToMain}
            />
        );
    }
    
    const renderContent = () => {
        switch(activeTab) {
            case 'Pantry Chef':
                if (!currentUser?.isPremium) {
                    return (
                        <PremiumContent
                            isPremium={false}
                            onUpgradeClick={() => setIsUpgradeModalOpen(true)}
                            featureTitle="Your Personal Pantry Chef"
                            featureDescription="Don't know what to cook? Let our AI chef create a recipe from the ingredients you already have."
                            features={[
                                "Unlock unlimited AI-powered recipe generation",
                                "Reduce food waste",
                                "Discover new meal ideas",
                                "Get creative with your pantry"
                            ]}
                        />
                    );
                }
                return <PantryChef onRecipeGenerated={handleRecipeGenerated} />;
            case 'AI Meal Planner':
                if (!currentUser?.isPremium) {
                    return (
                        <PremiumContent
                            isPremium={false}
                            onUpgradeClick={() => setIsUpgradeModalOpen(true)}
                            featureTitle="AI Meal Planner"
                            featureDescription="Let our AI chef create a personalized meal plan for you based on your dietary needs and preferences."
                            features={[
                                "Generate custom meal plans on demand",
                                "Use any prompt, like 'a week of healthy lunches'",
                                "AI selects from our existing recipe collection",
                                "Take the guesswork out of planning"
                            ]}
                        />
                    );
                }
                return <MealPlanGenerator allRecipes={allRecipes} onRecipeClick={handleCardClick} />;
            case 'My Cookbook':
                 if (!currentUser?.isPremium) {
                    return (
                         <PremiumContent
                            isPremium={false}
                            onUpgradeClick={() => setIsUpgradeModalOpen(true)}
                            featureTitle="Your Digital Cookbook"
                            featureDescription="Save all your favorite recipes in one place for easy access anytime."
                            features={[
                                "Save unlimited favorite recipes",
                                "Organize with custom tags",
                                "Access your cookbook on any device",
                                "Never lose a recipe again"
                            ]}
                        />
                    );
                }
                return (
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-1/4">
                                <CookbookTagFilter tags={cookbookTags} selectedTag={cookbookSelectedTag} onSelectTag={setCookbookSelectedTag} />
                            </div>
                            <div className="w-full md:w-3/4">
                                {filteredAndSortedCookbook.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredAndSortedCookbook.map(recipe => (
                                            <RecipeCard
                                                key={recipe.id}
                                                recipe={recipe}
                                                onClick={handleCardClick}
                                                isFavorite={true}
                                                onToggleFavorite={handleToggleFavorite}
                                                variant="cookbook"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        icon={<HeartIcon />}
                                        title="Your Cookbook is Empty"
                                        message="Add your favorite recipes by clicking the heart icon."
                                        actionText="Browse Recipes"
                                        onActionClick={() => handleSelectTab('All Recipes')}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'Cocktail Menu':
                return <CocktailMenu 
                    standardCocktails={standardCocktails} 
                    savedCocktails={savedCocktails}
                    currentUser={currentUser}
                    onSave={handleSaveStandardCocktail}
                    onLoginRequest={() => setIsLoginModalOpen(true)}
                    onUpgradeRequest={() => setIsUpgradeModalOpen(true)}
                />;
            case 'My Bar':
                if (!currentUser?.isPremium) {
                    return (
                        <PremiumContent
                            isPremium={false}
                            onUpgradeClick={() => setIsUpgradeModalOpen(true)}
                            featureTitle="My Bar: Your Personal Cocktail Collection"
                            featureDescription="Save and organize all the unique cocktail recipes you create with our AI Bartender Helper."
                            features={[
                                "Save unlimited cocktail recipes",
                                "Quickly access your favorite drinks",
                                "Perfect for entertaining guests",
                                "Build your personal mixology book"
                            ]}
                        />
                    );
                }
                return <MyBar savedCocktails={savedCocktails} onDelete={handleDeleteCocktail} onGoToBartender={() => handleSelectTab('Bartender Helper')} />;
            case 'Meal Plans':
                if (!currentUser?.isPremium) {
                    return (
                        <PremiumContent
                            isPremium={false}
                            onUpgradeClick={() => setIsUpgradeModalOpen(true)}
                            featureTitle="Effortless Meal Planning"
                            featureDescription="Take the stress out of meal prep with our curated weekly meal plans."
                            features={[
                                "Weekly themed meal plans",
                                "Recipes for every occasion",
                                "Simplify your grocery shopping",
                                "Healthy and delicious options"
                            ]}
                        />
                    );
                }
                 return (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mealPlans.map(plan => (
                            <MealPlanCard key={plan.id} plan={plan} allRecipes={allRecipes} onViewPlan={setViewingMealPlan} />
                        ))}
                    </div>
                );
            case 'Video Tutorials':
                 if (!currentUser?.isPremium) {
                    return (
                        <PremiumContent
                            isPremium={false}
                            onUpgradeClick={() => setIsUpgradeModalOpen(true)}
                            featureTitle="Step-by-Step Video Tutorials"
                            featureDescription="Master basic cooking skills and techniques with our short, easy-to-follow video guides."
                            features={[
                                "Learn essential knife skills",
                                "Perfect core cooking techniques",
                                "Visual, easy-to-understand lessons",
                                "Build your confidence in the kitchen"
                            ]}
                        />
                    );
                }
                return (
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {videos.map(video => (
                            <VideoCard key={video.id} video={video} onPlay={handlePlayVideo} />
                        ))}
                    </div>
                );
            case 'Cooking Classes':
                if (!currentUser?.isPremium) {
                    return <AdvancedClasses onUpgradeClick={() => setIsUpgradeModalOpen(true)} />;
                }
                return (
                    <>
                        {viewingCookingClass ? (
                            <CookingClassDetail cookingClass={viewingCookingClass} onBack={() => setViewingCookingClass(null)} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {cookingClasses.map(cc => (
                                    <CookingClassCard key={cc.id} cookingClass={cc} onClick={setViewingCookingClass} />
                                ))}
                            </div>
                        )}
                    </>
                );
            case 'Bartender Helper':
                if (!currentUser?.isPremium) {
                    return (
                        <PremiumContent
                            isPremium={false}
                            onUpgradeClick={() => setIsUpgradeModalOpen(true)}
                            featureTitle="AI-Powered Bartender Helper"
                            featureDescription="Feeling creative? Describe any drink you can imagine, and our AI mixologist will invent a recipe for you on the spot."
                            features={[
                                "Generate unique cocktail recipes from a description",
                                "Get AI-generated images of your creations",
                                "Save your best drinks to 'My Bar'",
                                "Impress your friends with custom drinks"
                            ]}
                        />
                    );
                }
                return <BartenderHelper currentUser={currentUser} savedCocktails={savedCocktails} onSaveCocktail={handleSaveCocktail} />;
            case 'Ask an Expert':
                if (!currentUser?.isPremium) {
                    return <ExpertQAPremiumOffer onUpgradeClick={() => setIsUpgradeModalOpen(true)} />;
                }
                return <AskAnExpert questions={expertQuestions} onAskQuestion={handleAddExpertQuestion} />;
            case 'Marketplace':
                if (!currentUser?.isPremium) {
                    return (
                        <PremiumContent
                            isPremium={false}
                            onUpgradeClick={() => setIsUpgradeModalOpen(true)}
                            featureTitle="Curated Marketplace & Product Analyzer"
                            featureDescription="Shop our chef-approved kitchen tools and pantry staples, and get instant health analysis on any food product."
                            features={[
                                "Browse and shop affiliate products",
                                "Use the AI Product Analyzer for health scores",
                                "Find the best tools and ingredients",
                                "Make informed choices about what you buy"
                            ]}
                        />
                    );
                }
                return <Marketplace allProducts={products} />;
            case 'About Us':
                return <AboutUsPage />;
            case 'All Recipes':
            default:
                return (
                    <div className="space-y-12">
                        <RecipeOfTheDay 
                            recipe={recipeOfTheDay} 
                            isLoading={isLoadingRecipeOfTheDay} 
                            onClick={handleCardClick}
                            onArchive={handleArchiveRecipeOfTheDay}
                            isArchived={isRecipeOfTheDayArchived}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white p-8 rounded-lg shadow-sm">
                            <div>
                                <h1 className="text-4xl font-bold text-slate-800">Recipe Extracter</h1>
                                <p className="mt-4 text-slate-600">Extract recipes from any URL and save them to your digital cookbook. <span className="font-semibold text-amber-600">(Premium Feature)</span></p>
                            </div>
                            <UrlInput onExtract={handleExtractFromUrl} isExtracting={isExtracting} error={extractError} />
                        </div>

                        {!currentUser?.isPremium && (
                            <PremiumContent
                                isPremium={false}
                                onUpgradeClick={() => setIsUpgradeModalOpen(true)}
                                featureTitle="New This Month"
                                featureDescription="Discover exclusive premium recipes curated monthly by our chef experts"
                                features={[
                                    "Personalized recipe recommendations",
                                    "Chef-curated seasonal specialties",
                                    "Early access to trending dishes",
                                    "Premium ingredient recommendations",
                                ]}
                            >
                              <RecipeCarousel
                                  title=""
                                  recipes={newThisMonthRecipes}
                                  favorites={favorites}
                                  selectedRecipeIds={selectedRecipeIds}
                                  onCardClick={handleCardClick}
                                  onToggleFavorite={handleToggleFavorite}
                                  onToggleSelect={handleToggleSelect}
                              />
                            </PremiumContent>
                        )}

                        {currentUser?.isPremium && (
                            <RecipeCarousel
                                title="Recommended For You"
                                recipes={recommendedRecipes}
                                favorites={favorites}
                                selectedRecipeIds={selectedRecipeIds}
                                onCardClick={handleCardClick}
                                onToggleFavorite={handleToggleFavorite}
                                onToggleSelect={handleToggleSelect}
                            />
                        )}
    
                        <div>
                             <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Discover Our Recipes</h2>
                                <p className="mt-2 text-lg text-slate-500">
                                    Discover from <span className="font-bold text-green-600">{allRecipes.length.toLocaleString()}</span> authentic recipes
                                </p>
                            </div>
                            <div className="max-w-2xl mx-auto mb-8">
                                <SearchBar 
                                    value={searchQuery} 
                                    onChange={handleSearchChange} 
                                    placeholder="Search by recipe name, description, etc..."
                                />
                            </div>
                            <TagFilter tags={allCategoryTags} selectedTag={selectedTag} onSelectTag={handleSelectTag} />
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredRecipes.slice(0, visibleRecipeCount).map(recipe => (
                                    <RecipeCard 
                                        key={recipe.id}
                                        recipe={recipe}
                                        onClick={handleCardClick}
                                        isFavorite={favorites.includes(recipe.id)}
                                        onToggleFavorite={handleToggleFavorite}
                                        isSelected={selectedRecipeIds.includes(recipe.id)}
                                        onToggleSelect={handleToggleSelect}
                                    />
                                ))}
                            </div>
                            
                            {filteredRecipes.length === 0 && (
                                <EmptyState
                                    icon={<SearchIcon />}
                                    title="No Recipes Found"
                                    message="Try adjusting your search or filters."
                                    actionText="Clear Filter"
                                    onActionClick={() => handleSelectTag('All')}
                                />
                            )}
                            
                            {visibleRecipeCount < filteredRecipes.length && (
                                <div className="text-center mt-12">
                                    <button onClick={() => setVisibleRecipeCount(c => c + RECIPES_PER_PAGE)} className="px-6 py-3 bg-white border-2 border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                                        Load More Recipes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
        }
    }

    const recipeForModal = previewRecipe || selectedRecipe;

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
             <header className="bg-white shadow-sm sticky top-0 z-40 print:hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        <button onClick={() => handleSelectTab('All Recipes')} className="flex items-center gap-3">
                            <ChefHatIcon className="w-10 h-10 text-amber-500" />
                            <span className="hidden sm:block text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Recipe Extracter</span>
                        </button>
                        <div className="flex items-center gap-4">
                            <UnitToggleButton system={measurementSystem} onSystemChange={handleSystemChange} />
                            {currentUser ? (
                                <UserMenu
                                    user={currentUser}
                                    onLogout={handleLogout}
                                    onShowFavorites={() => handleSelectTab('My Cookbook')}
                                    onOpenProfile={() => setIsProfileModalOpen(true)}
                                    onOpenLists={() => handleSelectTab('Shopping List')}
                                    onOpenAdmin={() => handleSelectTab('Admin Dashboard')}
                                />
                            ) : (
                                <button
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors"
                                >
                                    Login / Sign Up
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>
    
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <MainTabs activeTab={activeTab} onSelectTab={handleSelectTab} currentUser={currentUser} />
                
                <div className="mt-8">
                    {renderContent()}
                </div>
                
                 <section className="mt-16 max-w-4xl mx-auto">
                    <NewsletterSignup onSubscribe={handleSubscribe} currentUser={currentUser} />
                 </section>
            </main>
            
            {recipeForModal && (
                <RecipeModal 
                    recipe={recipeForModal} 
                    onClose={handleCloseModal} 
                    measurementSystem={measurementSystem} 
                    onEnterCookMode={handleEnterCookMode} 
                    onAddRating={handleAddRating} 
                    isPreview={!!previewRecipe}
                    onSave={handleSaveNewRecipe}
                    onDiscard={handleDiscardNewRecipe}
                />
            )}
            {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={handleLoginSuccess} />}
            {isProfileModalOpen && currentUser && <ProfileModal user={currentUser} onClose={() => setIsProfileModalOpen(false)} onSave={handleUpdateUser} />}
            {viewingList && <ShoppingListModal list={viewingList} onClose={() => setViewingList(null)} allRecipes={allRecipes} measurementSystem={measurementSystem} />}
            {isSaveListModalOpen && <SaveListModal isOpen={isSaveListModalOpen} onClose={() => setIsSaveListModalOpen(false)} onSave={handleSaveList} existingListNames={shoppingLists.map(l => l.name)} />}
            {isListsOverviewOpen && <ListsOverviewModal isOpen={isListsOverviewOpen} onClose={() => setIsListsOverviewOpen(false)} lists={shoppingLists} onView={(list) => { setViewingList(list); setIsListsOverviewOpen(false); }} onDelete={handleDeleteList} onRename={handleRenameList} />}
            {playingVideo && <VideoPlayerModal video={playingVideo} onClose={handleCloseVideo} />}
            {isUpgradeModalOpen && (
                <UpgradeModal 
                    isOpen={isUpgradeModalOpen} 
                    onClose={() => setIsUpgradeModalOpen(false)} 
                    onUpgrade={handleUpgradeUser} 
                    currentUser={currentUser}
                    onLoginRequest={() => {
                        setIsUpgradeModalOpen(false);
                        setIsLoginModalOpen(true);
                    }}
                />
            )}
            {isPrivacyPolicyOpen && <PrivacyPolicy isOpen={isPrivacyPolicyOpen} onClose={() => setIsPrivacyPolicyOpen(false)} />}
    
            <Footer onAboutClick={() => handleSelectTab('About Us')} onPrivacyClick={() => setIsPrivacyPolicyOpen(true)} />
    
            {selectedRecipeIds.length > 0 && (
                <div className="fixed bottom-6 right-6 z-30">
                    <button
                        onClick={() => setIsSaveListModalOpen(true)}
                        className="flex items-center gap-3 px-5 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-105 animate-fade-in"
                    >
                        <ShoppingCartIcon className="w-6 h-6"/>
                        <span>Save {selectedRecipeIds.length} Recipe{selectedRecipeIds.length > 1 && 's'}</span>
                        <span className="ml-2 w-7 h-7 bg-white text-green-600 flex items-center justify-center rounded-full text-sm font-bold">{selectedRecipeIds.length}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;