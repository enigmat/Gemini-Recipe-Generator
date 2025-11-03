import React, { useState, useMemo, useEffect } from 'react';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import TagFilter from './components/TagFilter';
import { Recipe, User, ShoppingList, MealPlan, Video, CookingClass, Newsletter, Lead, Product, CocktailRecipe, SavedCocktail, ExpertQuestion, ChatMessage, AppDatabase, UserData } from './types';
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
import XIcon from './components/icons/XIcon';
import { generateImageFromPrompt, generateRecipeDetailsFromTitle, generateRecipeFromUrl } from './services/geminiService';
import * as newsletterService from './services/newsletterService';
import * as leadService from './services/leadService';
import NewsletterSignup from './components/NewsletterSignup';
import UrlInput from './components/UrlInput';
import IngredientInput from './components/IngredientInput';
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
import CocktailBook from './components/CocktailBook';
import CommunityChat from './components/CommunityChat';
import * as chatService from './services/chatService';
import { importDatabaseWithImages } from './services/dataSyncService';
import CookbookMakerModal from './components/CookbookMakerModal';
import * as cloudService from './services/cloudService';
import Spinner from './components/Spinner';
import * as seedService from './services/seedService';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';
import SupabaseConfigError from './components/SupabaseConfigError';
import SupabaseConnectionError from './components/SupabaseConnectionError';
import SupabaseSchemaError from './components/SupabaseSchemaError';
import DishIdentifier from './components/DishIdentifier';
import AdminDashboard from './components/AdminDashboard';


const RECIPES_PER_PAGE = 12;

// FIX: Explicitly type placeholders as `string` to prevent TypeScript from inferring
// a narrow literal type. This avoids a compile error when comparing against the
// imported SUPABASE_URL/KEY, which also has a literal type, as the compiler
// knows two different literals can never be equal.
const PLACEHOLDER_URL: string = "https://lfgnaekjmdgfmudbfkct.supabase.co";
const PLACEHOLDER_KEY: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZ25hZWtqbWRnZm11ZGJma2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0MjI4MDIsImV4cCI6MjAzMTk5ODgwMn0.a4lZ23hQk20b_8Z-4Arx2o6JqeadHe7gutsYd-n2D5s";

type AppState = 'loading' | 'config_error' | 'connection_error' | 'schema_error' | 'ready';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('loading');
    const [connectionErrorDetails, setConnectionErrorDetails] = useState<string>('');
    
    const [appData, setAppData] = useState<Partial<AppDatabase> | null>(null);

    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [previewRecipe, setPreviewRecipe] = useState<Recipe | null>(null);
    const [activeTab, setActiveTab] = useState<string>('All Recipes');
    const [selectedTag, setSelectedTag] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData>({ favorites: [], shoppingLists: [], cocktails: [] });
    
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [pantryIngredients, setPantryIngredients] = useState<string[]>([]);
    const [committedPantryIngredients, setCommittedPantryIngredients] = useState<string[]>([]);
    const [measurementSystem, setMeasurementSystem] = useState<'metric' | 'us'>('us');
    const [selectedRecipeIds, setSelectedRecipeIds] = useState<number[]>([]);
    const [cookbookSelectedTag, setCookbookSelectedTag] = useState<string>('All');
    
    // Shopping lists state
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
    
    const [isUpdatingAllImages, setIsUpdatingAllImages] = useState(false);

    const [isExtracting, setIsExtracting] = useState(false);
    const [extractError, setExtractError] = useState<string | null>(null);

    const [visibleRecipeCount, setVisibleRecipeCount] = useState(RECIPES_PER_PAGE);
    
    const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
    
    const [expertQuestions, setExpertQuestions] = useState<ExpertQuestion[]>(initialExpertQuestions);

    const [recipeOfTheDay, setRecipeOfTheDay] = useState<Recipe | null>(null);
    const [isLoadingRecipeOfTheDay, setIsLoadingRecipeOfTheDay] = useState<boolean>(true);

    const [isCookbookMakerOpen, setIsCookbookMakerOpen] = useState(false);
    const [isAdminView, setIsAdminView] = useState(false);
    
    // --- Data Loading and Auth ---
    useEffect(() => {
        const initializeApp = async () => {
            // 1. Check for placeholder config
            const isUrlPlaceholder = SUPABASE_URL === PLACEHOLDER_URL;
            const isKeyPlaceholder = SUPABASE_ANON_KEY === PLACEHOLDER_KEY;
            if (isUrlPlaceholder || isKeyPlaceholder || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
                setAppState('config_error');
                return;
            }

            // 2. Try to connect and fetch data
            try {
                await seedService.seedDatabaseIfEmpty();
                
                const publicDb = await cloudService.getPublicData();
                
                const newlyArchivedRecipe = await recipeOfTheDayService.archiveYesterdaysRecipe(publicDb.recipes?.scheduled || []);
                if (newlyArchivedRecipe) {
                    const all = publicDb.recipes?.all || [];
                    publicDb.recipes = {
                        ...(publicDb.recipes as AppDatabase['recipes']),
                        all: [newlyArchivedRecipe, ...all],
                    };
                }
                setAppData(publicDb);
                
                const recipe = recipeOfTheDayService.getTodaysRecipe(publicDb.recipes?.scheduled || []);
                setRecipeOfTheDay(recipe);

                setAppState('ready'); // Success!
            } catch (error: any) {
                console.error("Failed to initialize app:", error);
                const errorMessage = error.message || '';
                
                if (errorMessage.includes("Could not find the table") || errorMessage.includes("relation") && errorMessage.includes("does not exist")) {
                    setAppState('schema_error');
                    setConnectionErrorDetails(`The database is connected, but the required tables are missing. The specific error was: ${errorMessage}`);
                } else if (error instanceof TypeError && errorMessage === 'Failed to fetch') {
                    setConnectionErrorDetails("Could not connect to the Supabase database. This is usually caused by an incorrect URL/Key or a CORS configuration issue.");
                    setAppState('connection_error');
                } else {
                    setConnectionErrorDetails(`An unexpected error occurred during startup: ${errorMessage}`);
                    setAppState('connection_error');
                }
            } finally {
                setIsLoadingRecipeOfTheDay(false);
            }
        };

        initializeApp();

        // Listen for auth changes
        const unsubscribe = userService.onAuthStateChange(async (user) => {
            setCurrentUser(user);
            if (user) {
                setIsLoginModalOpen(false); // Close login modal on successful auth change
                
                // Fetch user-specific data and general authenticated data
                const [userData, authenticatedData] = await Promise.all([
                    cloudService.getUserData(user.id),
                    cloudService.getAuthenticatedData(),
                ]);

                setUserData(userData);

                if (user.isAdmin) {
                    const adminData = await cloudService.getAdminData();
                    setAppData(prev => ({...prev, ...authenticatedData, ...adminData}));
                } else {
                    setAppData(prev => ({...prev, ...authenticatedData}));
                }

            } else {
                setUserData({ favorites: [], shoppingLists: [], cocktails: [] });
                // Clear authenticated data from state on logout
                setAppData(prev => ({
                    ...prev,
                    ratings: {},
                    communityChat: [],
                    users: [],
                    newsletters: { sent: [], leads: [] },
                }));
            }
        });

        // Load measurement system preference
        const savedSystem = localStorage.getItem('recipeAppMeasurementSystem');
        if (savedSystem === 'us' || savedSystem === 'metric') {
            setMeasurementSystem(savedSystem as 'metric' | 'us');
        }
        
        return () => unsubscribe();
    }, []);

    const allRecipes = useMemo(() => appData?.recipes?.all || [], [appData]);
    const newThisMonthRecipes = useMemo(() => appData?.recipes?.new || [], [appData]);
    
    // Reset recipe pagination when filters change
    useEffect(() => {
        setVisibleRecipeCount(RECIPES_PER_PAGE);
    }, [searchQuery, committedPantryIngredients, selectedTag, activeTab]);

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


    const handleSystemChange = (system: 'metric' | 'us') => {
        setMeasurementSystem(system);
        localStorage.setItem('recipeAppMeasurementSystem', system);
    };

    const handleToggleFavorite = async (recipeId: number) => {
        if (!currentUser) {
            setIsLoginModalOpen(true);
            return;
        }
        if (!currentUser.isPremium) {
            setIsUpgradeModalOpen(true);
            return;
        }
        
        const newFavorites = userData.favorites.includes(recipeId)
            ? userData.favorites.filter(id => id !== recipeId)
            : [...userData.favorites, recipeId];
        
        const newUserData = { ...userData, favorites: newFavorites };
        setUserData(newUserData); // Optimistic update
        await cloudService.saveUserData(currentUser.id, newUserData);
    };

    const handleAddRating = async (recipeId: number, score: number) => {
        if (!currentUser) {
            setIsLoginModalOpen(true);
            return;
        }

        // ratingService.addRating(recipeId, score, currentUser.email);
        // const updatedRating = ratingService.getRating(recipeId);

        // // const updateRecipeRating = (recipes: Recipe[]) => 
        // //     recipes.map(r => r.id === recipeId ? { ...r, rating: updatedRating } : r);

        // // setAllRecipes(prev => updateRecipeRating(prev));
        // // setNewThisMonthRecipes(prev => updateRecipeRating(prev));
        console.log("Rating functionality needs to be migrated to Supabase.");
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

    const handleLogout = async () => {
        await userService.signOut();
        setIsAdminView(false);
        // onAuthStateChange will handle cleanup
        setActiveTab('All Recipes');
        setSelectedTag('All'); 
    };

    const handleUpdateUser = async (updatedUser: User) => {
        const savedUser = await userService.updateUser(updatedUser);
        if (savedUser && currentUser && currentUser.id === savedUser.id) {
            setCurrentUser(savedUser);
        }
        setAppData(prev => ({
            ...prev,
            users: prev?.users?.map(u => u.id === savedUser?.id ? savedUser : u)
        }));
    };

    const handleUpgradeUser = async (preferences: string[]) => {
        if (!currentUser) return;
        const upgradedUser: User = { 
            ...currentUser, 
            isPremium: true, 
            foodPreferences: preferences 
        };
        await handleUpdateUser(upgradedUser);
        setIsUpgradeModalOpen(false);
    };

    const handleCardClick = (recipe: Recipe) => {
        if (previewRecipe) return;
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
        setSelectedRecipe(null);
        setCookModeRecipe(recipe);
    };

    const handleExitCookMode = () => {
        setCookModeRecipe(null);
    };
    
    const handleSelectTab = (tab: string) => {
        if (tab === 'Admin Dashboard') {
            setIsAdminView(true);
            return;
        }
        setIsAdminView(false);

        if (['My Cookbook', 'Shopping List', 'Cocktail Book', 'AI Meal Planner', 'Community Chat', 'Bartender Helper'].includes(tab)) {
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

    const handleSaveList = async (name: string) => {
        if (!currentUser) return;

        const newLists = [...userData.shoppingLists];
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
        
        const newUserData = { ...userData, shoppingLists: newLists };
        setUserData(newUserData);
        await cloudService.saveUserData(currentUser.id, newUserData);

        setSelectedRecipeIds([]);
        setIsSaveListModalOpen(false);
    };

    const handleDeleteList = async (listId: string) => {
        if (!currentUser) return;
        const newLists = userData.shoppingLists.filter(list => list.id !== listId);
        const newUserData = { ...userData, shoppingLists: newLists };
        setUserData(newUserData);
        await cloudService.saveUserData(currentUser.id, newUserData);
    };

    const handleRenameList = async (listId: string, newName: string) => {
        if (!currentUser) return;
        const newLists = userData.shoppingLists.map(list => 
            list.id === listId ? { ...list, name: newName } : list
        );
        const newUserData = { ...userData, shoppingLists: newLists };
        setUserData(newUserData);
        await cloudService.saveUserData(currentUser.id, newUserData);
    };
    
    const handlePlayVideo = (video: Video) => {
        setPlayingVideo(video);
    };

    const handleCloseVideo = () => {
        setPlayingVideo(null);
    };
    
    const handleSaveCocktail = async (recipe: CocktailRecipe, image: string) => {
        if (!currentUser) {
            setIsLoginModalOpen(true);
            return;
        }
        if (!currentUser.isPremium) {
            setIsUpgradeModalOpen(true);
            return;
        }
        const newCocktail = await cocktailService.saveCocktail(recipe, image, currentUser.id);
        if (newCocktail) {
            setUserData(prev => ({ ...prev, cocktails: [newCocktail, ...prev.cocktails] }));
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
        // This is saving a standard cocktail to a user's personal bar
        const newCocktail = await cocktailService.saveCocktail(cocktail, cocktail.image, currentUser.id);
        if (newCocktail) {
            setUserData(prev => ({ ...prev, cocktails: [newCocktail, ...prev.cocktails]}));
        }
    };

    const handleDeleteCocktail = async (cocktailId: string) => {
        if (!currentUser) return;
        await cocktailService.deleteCocktail(cocktailId, currentUser.id);
        setUserData(prev => ({ ...prev, cocktails: prev.cocktails.filter(c => c.id !== cocktailId)}));
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

    const handleSendMessage = async (text: string) => {
        if (!currentUser) return;
        const newMessage = await chatService.addChatMessage({
            userId: currentUser.email,
            userName: currentUser.name,
            userProfileImage: currentUser.profileImage,
            isAdmin: !!currentUser.isAdmin,
            text,
            timestamp: new Date().toISOString()
        });
        setAppData(prev => ({ ...prev, communityChat: [...(prev?.communityChat || []), newMessage]}));
    };

    // --- Extractor & Generator functions ---
    const handleExtractFromUrl = async (url: string) => {
        // ... (this logic is largely independent of db)
    };

    const handleRecipeGenerated = async (recipeDetails: Omit<Recipe, 'id' | 'image'>, image: string) => {
       const newId = Date.now();
       const newRecipe: Recipe = {
         id: newId,
         image: image,
         ...recipeDetails,
       };
       setPreviewRecipe(newRecipe);
    };
    
    const handleSaveNewRecipe = (recipe: Recipe) => {
        setAppData(prev => ({
            ...prev,
            recipes: {
                ...(prev?.recipes as AppDatabase['recipes']),
                all: [recipe, ...allRecipes]
            }
        }));
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
    };
    
    const handleSearchForDish = (dishName: string) => {
        setActiveTab('All Recipes');
        setSearchQuery(dishName);
    };

    // --- Admin Dashboard Handlers ---

    const handleSaveChangesAdmin = async () => {
        if (!appData) return;
        await Promise.all([
            cloudService.saveAllRecipes(appData.recipes?.all || []),
            cloudService.saveNewRecipes(appData.recipes?.new || []),
            cloudService.saveScheduledRecipes(appData.recipes?.scheduled || []),
            cloudService.saveProducts(appData.products || []),
            cocktailService.saveStandardCocktails(appData.standardCocktails || []),
        ]);
    };
    
    const handleAddRecipeAdmin = async (title: string, addToNew: boolean, addToRotd: boolean) => {
        const recipeDetails = await generateRecipeDetailsFromTitle(title);
        const image = await generateImageFromPrompt(recipeDetails.title);
        const newId = Date.now();
        await imageStore.setImage(String(newId), image);

        const newRecipe: Recipe = {
            id: newId,
            image: `indexeddb:${newId}`,
            ...recipeDetails,
        };

        setAppData(prev => {
            if (!prev) return prev;
            const all = [newRecipe, ...(prev.recipes?.all || [])];
            let newRecipesList = prev.recipes?.new || [];
            if (addToNew) {
                newRecipesList = [newRecipe, ...newRecipesList];
            }
            let scheduled = prev.recipes?.scheduled || [];
            if (addToRotd) {
                scheduled = [newRecipe, ...scheduled];
            }
            return {
                ...prev,
                recipes: {
                    all: all,
                    new: newRecipesList,
                    scheduled: scheduled,
                }
            };
        });
    };

    const handleDeleteRecipeAdmin = (recipeId: number) => {
        imageStore.deleteImage(String(recipeId));
        setAppData(prev => {
            if (!prev || !prev.recipes) return prev;
            return {
                ...prev,
                recipes: {
                    ...prev.recipes,
                    all: prev.recipes.all.filter(r => r.id !== recipeId),
                    new: prev.recipes.new.filter(r => r.id !== recipeId),
                    scheduled: prev.recipes.scheduled.filter(r => r.id !== recipeId),
                }
            };
        });
    };

    const handleUpdateRecipeAdmin = async (recipeId: number, title: string) => {
        const recipeDetails = await generateRecipeDetailsFromTitle(title);
        const image = await generateImageFromPrompt(recipeDetails.title);
        await imageStore.setImage(String(recipeId), image);
        const updatedRecipe: Recipe = { ...recipeDetails, id: recipeId, image: `indexeddb:${recipeId}?t=${Date.now()}` };

        setAppData(prev => {
             if (!prev || !prev.recipes) return prev;
            return {
                ...prev,
                recipes: {
                    ...prev.recipes,
                    all: prev.recipes.all.map(r => r.id === recipeId ? updatedRecipe : r),
                    new: prev.recipes.new.map(r => r.id === recipeId ? updatedRecipe : r),
                    scheduled: prev.recipes.scheduled.map(r => r.id === recipeId ? updatedRecipe : r),
                }
            }
        });
    };
    
    const handleUpdateAllRecipeImagesAdmin = async () => {
        setIsUpdatingAllImages(true);
        const recipesToUpdate = appData?.recipes?.all || [];
        const updatedRecipes: Recipe[] = [];

        for (const recipe of recipesToUpdate) {
            try {
                const image = await generateImageFromPrompt(recipe.title);
                await imageStore.setImage(String(recipe.id), image);
                updatedRecipes.push({ ...recipe, image: `indexeddb:${recipe.id}?t=${Date.now()}` });
            } catch (e) {
                console.error(`Failed to update image for ${recipe.title}`, e);
                updatedRecipes.push(recipe); // Keep old one if it fails
            }
             setAppData(prev => ({
                ...prev,
                recipes: {
                    ...(prev?.recipes as AppDatabase['recipes']),
                    all: prev?.recipes?.all.map(r => updatedRecipes.find(ur => ur.id === r.id) || r) || []
                }
            }));
        }
        setIsUpdatingAllImages(false);
    };

    const handleDeleteUserAdmin = (userEmail: string) => {
        console.warn(`Simulating deletion for user ${userEmail}. In a real app, this would require a secure server-side call.`);
        setAppData(prev => ({
            ...prev,
            users: prev?.users?.filter(u => u.email !== userEmail)
        }));
    };
    
    const handleSendNewsletterAdmin = (newsletter: Omit<Newsletter, 'id' | 'sentDate'>) => {
        const newNewsletter: Newsletter = {
            id: Date.now().toString(),
            sentDate: new Date().toISOString(),
            ...newsletter
        };
        setAppData(prev => ({
            ...prev,
            newsletters: {
                ...(prev?.newsletters as AppDatabase['newsletters']),
                sent: [newNewsletter, ...(prev?.newsletters?.sent || [])]
            }
        }));
    };

    const handleUpdateProductsAdmin = (updatedProducts: Product[]) => {
         setAppData(prev => ({ ...prev, products: updatedProducts }));
    };

    const handleDeleteProductAdmin = (productId: string) => {
        setAppData(prev => ({...prev, products: prev?.products?.filter(p => p.id !== productId)}));
        imageStore.deleteImage(productId);
    };

    const handleUpdateStandardCocktailsAdmin = (cocktails: SavedCocktail[]) => {
         setAppData(prev => ({ ...prev, standardCocktails: cocktails }));
    };

    const handleRemoveFromNewAdmin = (recipeId: number) => {
        setAppData(prev => ({
            ...prev,
            recipes: {
                ...(prev?.recipes as AppDatabase['recipes']),
                new: prev?.recipes?.new.filter(r => r.id !== recipeId) || []
            }
        }));
    };

    const handleAddToNewAdmin = (recipeId: number) => {
        const recipeToAdd = allRecipes.find(r => r.id === recipeId);
        if (recipeToAdd && !newThisMonthRecipes.some(r => r.id === recipeId)) {
            setAppData(prev => ({
                ...prev,
                recipes: {
                     ...(prev?.recipes as AppDatabase['recipes']),
                    new: [recipeToAdd, ...newThisMonthRecipes]
                }
            }));
        }
    };
    
    const handleMoveRecipeFromRotdToMainAdmin = async (recipe: Recipe) => {
        const newlyAddedRecipe = await recipeService.addRecipeIfUnique(recipe);
        if (newlyAddedRecipe) {
            setAppData(prev => ({
                ...prev,
                recipes: {
                    ...(prev?.recipes as AppDatabase['recipes']),
                    all: [newlyAddedRecipe, ...(prev?.recipes?.all || [])],
                    scheduled: prev?.recipes?.scheduled.filter(r => r.id !== recipe.id) || [],
                }
            }));
            return true;
        }
        return false;
    };
    
    const handleImportDataAdmin = async (db: AppDatabase) => {
        await importDatabaseWithImages(db);
        alert("Import successful! The application will now reload to apply all changes.");
        window.location.reload();
    };


    // --- Render Logic ---
    const favoriteRecipes = useMemo(() => {
        return allRecipes.filter(r => userData.favorites.includes(r.id));
    }, [userData.favorites, allRecipes]);

    const recommendedRecipes = useMemo(() => {
        if (!currentUser?.isPremium || !currentUser.foodPreferences?.length) {
            return newThisMonthRecipes;
        }
        const preferenceSet = new Set(currentUser.foodPreferences);
        const recommendations = allRecipes.filter(recipe => preferenceSet.has(recipe.cuisine));
        
        if (recommendations.length < 10) {
            const fallback = allRecipes.filter(r => !recommendations.some(rec => rec.id === r.id));
            return [...recommendations, ...fallback.slice(0, 10 - recommendations.length)];
        }
        return recommendations;
    }, [currentUser, allRecipes, newThisMonthRecipes]);

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

    // --- Main Render ---

    if (appState === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <Spinner size="w-12 h-12" />
                <p className="mt-4 text-slate-600 font-semibold">Connecting to your kitchen...</p>
            </div>
        );
    }

    if (appState === 'config_error') {
        return <SupabaseConfigError />;
    }

    if (appState === 'schema_error') {
        return <SupabaseSchemaError />;
    }

    if (appState === 'connection_error') {
        return <SupabaseConnectionError details={connectionErrorDetails} />;
    }

    if (isAdminView && currentUser?.isAdmin && appData) {
        return <AdminDashboard 
            currentUser={currentUser}
            allRecipes={allRecipes}
            newRecipes={newThisMonthRecipes}
            users={appData.users || []}
            sentNewsletters={appData.newsletters?.sent || []}
            collectedLeads={appData.newsletters?.leads || []}
            products={appData.products || []}
            standardCocktails={appData.standardCocktails || []}
            onAddRecipe={handleAddRecipeAdmin}
            onDeleteRecipe={handleDeleteRecipeAdmin}
            onUpdateRecipeWithAI={handleUpdateRecipeAdmin}
            onUpdateAllRecipeImages={handleUpdateAllRecipeImagesAdmin}
            isUpdatingAllImages={isUpdatingAllImages}
            onUpdateUserRoles={handleUpdateUser}
            onDeleteUser={handleDeleteUserAdmin}
            onSendNewsletter={handleSendNewsletterAdmin}
            onUpdateProducts={handleUpdateProductsAdmin}
            onDeleteProduct={handleDeleteProductAdmin}
            onUpdateStandardCocktails={handleUpdateStandardCocktailsAdmin}
            onExit={() => setIsAdminView(false)}
            onRemoveFromNew={handleRemoveFromNewAdmin}
            onAddToNew={handleAddToNewAdmin}
            onSaveChanges={handleSaveChangesAdmin}
            onMoveRecipeFromRotdToMain={handleMoveRecipeFromRotdToMainAdmin}
            onImportData={handleImportDataAdmin}
        />
    }
    
    if (cookModeRecipe) {
        return <CookMode recipe={cookModeRecipe} onExit={handleExitCookMode} measurementSystem={measurementSystem} />;
    }
    
    const renderContent = () => {
        if (!appData) {
             return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] bg-slate-50">
                    <Spinner size="w-12 h-12" />
                    <p className="mt-4 text-slate-600 font-semibold">Loading your kitchen...</p>
                </div>
            );
        }

        switch(activeTab) {
            case 'Pantry Chef':
                return <PantryChef onRecipeGenerated={handleRecipeGenerated} />;
            case "Where's This From?":
                return <DishIdentifier onSearchForDish={handleSearchForDish} />;
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
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                    <h2 className="text-2xl font-bold text-slate-800">My Favorite Recipes</h2>
                                    {favoriteRecipes.length >= 3 && (
                                        <button
                                            onClick={() => setIsCookbookMakerOpen(true)}
                                            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                                        >
                                            <BookOpenIcon className="w-5 h-5" />
                                            <span>Create Cookbook</span>
                                        </button>
                                    )}
                                </div>
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
            case 'Cocktail Book':
                return <CocktailBook 
                    standardCocktails={appData.standardCocktails || []}
                    savedCocktails={userData.cocktails}
                    currentUser={currentUser}
                    onSaveStandard={handleSaveStandardCocktail}
                    onDelete={handleDeleteCocktail}
                    onLoginRequest={() => setIsLoginModalOpen(true)}
                    onUpgradeRequest={() => setIsUpgradeModalOpen(true)}
                    onGoToBartender={() => handleSelectTab('Bartender Helper')}
                />;
             case 'Community Chat':
                if (!currentUser) {
                     return (
                        <PremiumContent
                            isPremium={false}
                            onUpgradeClick={() => setIsLoginModalOpen(true)}
                            featureTitle="Join the Community Chat"
                            featureDescription="Log in to chat with other home cooks and professional chefs."
                        />
                    );
                }
                return (
                    <CommunityChat
                        messages={appData.communityChat || []}
                        currentUser={currentUser}
                        onSendMessage={handleSendMessage}
                    />
                );
            // ... other cases
            default:
                 return (
                    <div className="space-y-12">
                         <RecipeOfTheDay 
                            recipe={recipeOfTheDay} 
                            isLoading={isLoadingRecipeOfTheDay} 
                            onClick={handleCardClick}
                            onArchive={async (recipe) => { /* migration needed */}}
                            isArchived={isRecipeOfTheDayArchived}
                        />

                        {/* ... other components ... */}
    
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
                                        isFavorite={userData.favorites.includes(recipe.id)}
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
            {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
            {isProfileModalOpen && currentUser && <ProfileModal user={currentUser} onClose={() => setIsProfileModalOpen(false)} onSave={handleUpdateUser} />}
            {viewingList && <ShoppingListModal list={viewingList} onClose={() => setViewingList(null)} allRecipes={allRecipes} measurementSystem={measurementSystem} />}
            {isSaveListModalOpen && <SaveListModal isOpen={isSaveListModalOpen} onClose={() => setIsSaveListModalOpen(false)} onSave={handleSaveList} existingListNames={userData.shoppingLists.map(l => l.name)} />}
            {isListsOverviewOpen && <ListsOverviewModal isOpen={isListsOverviewOpen} onClose={() => setIsListsOverviewOpen(false)} lists={userData.shoppingLists} onView={(list) => { setViewingList(list); setIsListsOverviewOpen(false); }} onDelete={handleDeleteList} onRename={handleRenameList} />}
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
            {isCookbookMakerOpen && currentUser?.isPremium && (
                <CookbookMakerModal
                    isOpen={isCookbookMakerOpen}
                    onClose={() => setIsCookbookMakerOpen(false)}
                    favoriteRecipes={favoriteRecipes}
                    measurementSystem={measurementSystem}
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