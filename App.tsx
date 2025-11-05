import React, { useState, useMemo, useEffect, useCallback, useReducer } from 'react';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import TagFilter from './components/TagFilter';
import { Recipe, User, ShoppingList, MealPlan, Video, CookingClass, Newsletter, Lead, Product, CocktailRecipe, SavedCocktail, ExpertQuestion, ChatMessage, AppDatabase, UserData, Chef } from './types';
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
import MealPlanCard from './components/MealPlanCard';
import CalendarDaysIcon from './components/icons/CalendarDaysIcon';
import CheckIcon from './components/icons/CheckIcon';
import ChevronLeftIcon from './components/icons/ChevronLeftIcon';
import MainTabs from './components/MainTabs';
import CookMode from './components/CookMode';
import VideoCard from './components/VideoCard';
import VideoPlayerModal from './components/VideoPlayerModal';
import FilmIcon from './components/icons/FilmIcon';
import PremiumContent from './components/PremiumContent';
import UpgradeModal from './components/UpgradeModal';
import LockClosedIcon from './components/icons/LockClosedIcon';
import CookingClassCard from './components/CookingClassCard';
import CookingClassDetail from './components/CookingClassDetail';
import MortarPestleIcon from './components/icons/MortarPestleIcon';
import XIcon from './components/icons/XIcon';
import { generateImageFromPrompt, generateImage, generateRecipeDetailsFromTitle, generateRecipeFromUrl } from './services/geminiService';
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
import PantryChef from './components/PantryChef';
import AboutUsPage from './components/AboutUsPage';
import * as imageStore from './services/imageStore';
import MealPlanGenerator from './components/MealPlanGenerator';
import FeaturedChef from './components/RecipeOfTheDay';
import * as recipeOfTheDayService from './services/recipeOfTheDayService';
import UnitToggleButton from './components/UnitToggleButton';
import CocktailBook from './components/CocktailBook';
import CommunityChat from './components/CommunityChat';
import * as chatService from './services/chatService';
import { importDatabaseWithImages } from './services/dataSyncService';
import CookbookMakerModal from './components/CookbookMakerModal';
import * as databaseService from './services/database';
import Spinner from './components/Spinner';
import DishIdentifier from './components/DishIdentifier';
import AdminDashboard from './components/AdminDashboard';
import AdminDataSync from './components/AdminDataSync';
import * as shoppingListManager from './services/shoppingListManager';
import FeaturedChefs from './components/FeaturedChefs';


const RECIPES_PER_PAGE = 12;

// Debounce hook to prevent excessive API calls while typing
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const App: React.FC = () => {
    const [dbVersion, forceUpdate] = useReducer(x => x + 1, 0);
    const [isLoading, setIsLoading] = useState(true);
    
    // --- Data State ---
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [page, setPage] = useState(1);
    const [totalRecipeCount, setTotalRecipeCount] = useState(0);
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [allRecipeTitles, setAllRecipeTitles] = useState<string[]>([]);
    const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

    // --- Static Public Data ---
    const [newThisMonthRecipes, setNewThisMonthRecipes] = useState<Recipe[]>([]);
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [allMealPlanRecipes, setAllMealPlanRecipes] = useState<Recipe[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [cookingClasses, setCookingClasses] = useState<CookingClass[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [standardCocktails, setStandardCocktails] = useState<SavedCocktail[]>([]);
    const [featuredChefRecipe, setFeaturedChefRecipe] = useState<Recipe | null>(null);
    
    // --- Authenticated Data ---
    const [expertQuestions, setExpertQuestions] = useState<ExpertQuestion[]>([]);
    const [communityChat, setCommunityChat] = useState<ChatMessage[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [newsletters, setNewsletters] = useState<{ sent: Newsletter[]; leads: Lead[] }>({ sent: [], leads: [] });
    
    // --- UI State ---
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [previewRecipe, setPreviewRecipe] = useState<Recipe | null>(null);
    const [activeTab, setActiveTab] = useState<string>('All Recipes');
    const [selectedTag, setSelectedTag] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData>({ favorites: [], shoppingLists: [], cocktails: [] });
    
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [measurementSystem, setMeasurementSystem] = useState<'metric' | 'us'>('us');
    const [selectedRecipeIds, setSelectedRecipeIds] = useState<number[]>([]);
    const [cookbookSelectedTag, setCookbookSelectedTag] = useState<string>('All');
    
    const [viewingList, setViewingList] = useState<ShoppingList | null>(null);
    const [isSaveListModalOpen, setIsSaveListModalOpen] = useState(false);
    const [isListsOverviewOpen, setIsListsOverviewOpen] = useState(false);
    const [viewingMealPlan, setViewingMealPlan] = useState<MealPlan | null>(null);
    const [viewingMealPlanRecipes, setViewingMealPlanRecipes] = useState<Recipe[]>([]);
    const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
    const [cookModeRecipe, setCookModeRecipe] = useState<Recipe | null>(null);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [viewingCookingClass, setViewingCookingClass] = useState<CookingClass | null>(null);
    
    const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
    const [isCookbookMakerOpen, setIsCookbookMakerOpen] = useState(false);
    const [isAdminView, setIsAdminView] = useState(false);
    
    // --- Data Loading ---
    
    const fetchRecipes = useCallback((pageToFetch: number, search: string, tag: string) => {
        setIsLoadingRecipes(true);
        const { recipes: fetchedRecipes, count } = recipeService.getPaginatedFilteredRecipes(
            pageToFetch,
            RECIPES_PER_PAGE,
            search,
            tag
        );
        setRecipes(prev => pageToFetch === 1 ? fetchedRecipes : [...prev, ...fetchedRecipes]);
        if (count) setTotalRecipeCount(count);
        setIsLoadingRecipes(false);
    }, []);

    useEffect(() => {
        setPage(1); 
        fetchRecipes(1, debouncedSearchQuery, selectedTag);
    }, [debouncedSearchQuery, selectedTag, fetchRecipes]);


    const loadMoreRecipes = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchRecipes(nextPage, debouncedSearchQuery, selectedTag);
    };
    
    // Initial App Load
    useEffect(() => {
        const initializeApp = () => {
            const db = databaseService.getDatabase();
            
            const fetchedMealPlans = db.mealPlans || [];
            setMealPlans(fetchedMealPlans);
            
            if (fetchedMealPlans.length > 0) {
                const allPlanRecipeIds = [...new Set(fetchedMealPlans.flatMap(p => p.recipeIds))];
                if (allPlanRecipeIds.length > 0) {
                    const planRecipes = recipeService.getRecipesByIds(allPlanRecipeIds);
                    setAllMealPlanRecipes(planRecipes);
                }
            }

            setVideos(db.videos || []);
            setCookingClasses(db.cookingClasses || []);
            setProducts(db.products || []);
            setStandardCocktails(db.standardCocktails || []);
            setNewThisMonthRecipes(db.recipes?.new || []);
            
            const rotd = recipeOfTheDayService.getTodaysRecipe(db.recipes?.scheduled || []);
            setFeaturedChefRecipe(rotd);

            const tags = recipeService.getDistinctRecipeTags();
            setAllTags(tags);
            
            const titles = recipeService.getAllRecipeTitles();
            setAllRecipeTitles(titles);

            setExpertQuestions(db.expertQuestions || []);
            setCommunityChat(db.communityChat || []);
            setUsers(db.users || []);
            setNewsletters(db.newsletters || { sent: [], leads: [] });
            
            setIsLoading(false);
        };

        initializeApp();

        const unsubscribeFromAuth = userService.onAuthStateChange((user) => {
            setCurrentUser(user);
            if (user) {
                setIsLoginModalOpen(false);
                setUserData(userService.getUserData(user.email));
            } else {
                setUserData({ favorites: [], shoppingLists: [], cocktails: [] });
            }
        });

        const unsubscribeFromDb = databaseService.subscribe(forceUpdate);

        const savedSystem = localStorage.getItem('recipeAppMeasurementSystem');
        if (savedSystem === 'us' || savedSystem === 'metric') {
            setMeasurementSystem(savedSystem as 'metric' | 'us');
        }
        
        return () => {
            unsubscribeFromAuth();
            unsubscribeFromDb();
        };
    }, [dbVersion]);

    useEffect(() => {
        if (viewingMealPlan) {
            const recipes = recipeService.getRecipesByIds(viewingMealPlan.recipeIds);
            setViewingMealPlanRecipes(recipes);
        } else {
            setViewingMealPlanRecipes([]); 
        }
    }, [viewingMealPlan]);
    
    useEffect(() => {
        if (currentUser && userData.favorites.length > 0) {
            const recipes = recipeService.getRecipesByIds(userData.favorites);
            setFavoriteRecipes(recipes);
        } else {
            setFavoriteRecipes([]);
        }
    }, [currentUser, userData.favorites]);

    const allRecipes = useMemo(() => recipes, [recipes]);
    
    const handleSystemChange = (system: 'metric' | 'us') => {
        setMeasurementSystem(system);
        localStorage.setItem('recipeAppMeasurementSystem', system);
    };

    const handleToggleFavorite = (recipeId: number) => {
        if (!currentUser) { setIsLoginModalOpen(true); return; }
        if (!currentUser.isPremium && !currentUser.isAdmin) { setIsUpgradeModalOpen(true); return; }
        userService.toggleFavorite(currentUser.email, recipeId);
        forceUpdate();
    };

    const handleAddRating = (recipeId: number, score: number) => {
        if (!currentUser) { setIsLoginModalOpen(true); return; }
        ratingService.addRating(recipeId, score, currentUser.email);
        forceUpdate();
    };

    const handleToggleSelect = (recipeId: number) => {
        if (!currentUser) { setIsLoginModalOpen(true); return; }
        if (!currentUser.isPremium && !currentUser.isAdmin) { setIsUpgradeModalOpen(true); return; }
        setSelectedRecipeIds(prev => prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]);
    };

    const handleLogout = async () => {
        await userService.signOut();
        setIsAdminView(false);
        setActiveTab('All Recipes');
        setSelectedTag('All'); 
    };

    const handleUpdateUser = (updatedUser: User) => {
        userService.updateUser(updatedUser);
        if (currentUser && currentUser.id === updatedUser.id) setCurrentUser(updatedUser);
        forceUpdate();
    };

    const handleUpgradeUser = (preferences: string[]) => {
        if (!currentUser) return;
        const upgradedUser: User = { ...currentUser, isPremium: true, foodPreferences: preferences };
        handleUpdateUser(upgradedUser);
        setIsUpgradeModalOpen(false);
    };

    const handleCardClick = (recipe: Recipe) => {
        if (previewRecipe) return;
        if (!currentUser?.isPremium && !currentUser?.isAdmin) { setIsUpgradeModalOpen(true); return; }
        setSelectedRecipe(recipe);
    };

    const handleCloseModal = () => { setSelectedRecipe(null); setPreviewRecipe(null); };
    const handleEnterCookMode = (recipe: Recipe) => { setSelectedRecipe(null); setCookModeRecipe(recipe); };
    const handleExitCookMode = () => { setCookModeRecipe(null); };
    
    const handleSelectTab = (tab: string) => {
        if (tab === 'Admin Dashboard') { setIsAdminView(true); return; }
        setIsAdminView(false);
        if (['My Cookbook', 'Shopping List', 'Cocktail Book', 'AI Meal Planner', 'Community Chat', 'Bartender Helper', 'Data Sync'].includes(tab)) {
            if (!currentUser) { setIsLoginModalOpen(true); return; }
        }
        if (tab === 'Shopping List') {
            if (currentUser && !currentUser.isPremium && !currentUser.isAdmin) { setIsUpgradeModalOpen(true); return; }
            setIsListsOverviewOpen(true); return; 
        }
        setActiveTab(tab);
        setSearchQuery('');
        setSelectedTag('All');
        setViewingMealPlan(null);
        setViewingCookingClass(null);
    };

    const handleSaveList = (name: string) => {
        if (!currentUser) return;
        shoppingListManager.saveList(currentUser.email, name, selectedRecipeIds);
        setSelectedRecipeIds([]);
        setIsSaveListModalOpen(false);
        forceUpdate();
    };

    const handleDeleteList = (listId: string) => {
        if (!currentUser) return;
        shoppingListManager.deleteList(currentUser.email, listId);
        forceUpdate();
    };

    const handleRenameList = (listId: string, newName: string) => {
        if (!currentUser) return;
        shoppingListManager.renameList(currentUser.email, listId, newName);
        forceUpdate();
    };
    
    const handleSaveCocktail = (recipe: CocktailRecipe, image: string) => {
        if (!currentUser) { setIsLoginModalOpen(true); return; }
        if (!currentUser.isPremium && !currentUser.isAdmin) { setIsUpgradeModalOpen(true); return; }
        cocktailService.saveCocktail(recipe, image, currentUser.email);
        forceUpdate();
    };

    const handleSaveStandardCocktail = (cocktail: SavedCocktail) => {
        if (!currentUser) { setIsLoginModalOpen(true); return; }
        if (!currentUser.isPremium && !currentUser.isAdmin) { setIsUpgradeModalOpen(true); return; }
        cocktailService.saveCocktail(cocktail, cocktail.image, currentUser.email);
        forceUpdate();
    };

    const handleDeleteCocktail = (cocktailId: string) => {
        if (!currentUser) return;
        cocktailService.deleteCocktail(cocktailId, currentUser.email);
        forceUpdate();
    };

    const handleAddExpertQuestion = (question: string, topic: string) => {
        databaseService.updateDatabase(db => {
            db.expertQuestions.unshift({
                id: `q${Date.now()}`,
                question,
                topic,
                status: 'Pending',
                submittedDate: new Date().toISOString()
            });
        });
    };

    const handleSendMessage = (text: string) => {
        if (!currentUser) return;
        chatService.addChatMessage({ userId: currentUser.email, userName: currentUser.name, userProfileImage: currentUser.profileImage, isAdmin: !!currentUser.isAdmin, text, timestamp: new Date().toISOString() });
    };

    const handleRecipeGenerated = async (recipeDetails: any, image: string) => {
       const newId = Date.now();
       let finalChef: Chef | undefined;
       if (recipeDetails.chef && recipeDetails.chef.imagePrompt) {
         const chefImage = await generateImage(recipeDetails.chef.imagePrompt);
         await imageStore.setImage(`chef-${newId}`, chefImage);
         finalChef = { name: recipeDetails.chef.name, bio: recipeDetails.chef.bio, signatureDish: recipeDetails.chef.signatureDish, image: `indexeddb:chef-${newId}` };
       }
       const newRecipe: Recipe = { id: newId, image: image, ...recipeDetails, chef: finalChef };
       setPreviewRecipe(newRecipe);
    };
    
    const handleSaveNewRecipe = (recipe: Recipe) => {
        recipeService.addRecipe(recipe);
        setPreviewRecipe(null);
    };

    const handleDiscardNewRecipe = (recipe: Recipe) => {
        if (recipe.image.startsWith('indexeddb:')) imageStore.deleteImage(String(recipe.id));
        if (recipe.chef?.image.startsWith('indexeddb:')) imageStore.deleteImage(`chef-${recipe.id}`);
        setPreviewRecipe(null);
    };

    const handleSearchForDish = (dishName: string) => { setActiveTab('All Recipes'); setSearchQuery(dishName); };

    // --- Admin Handlers ---
    const handleAddRecipeAdmin = async (title: string, addToNew: boolean, addToRotd: boolean) => {
        const recipeDetails = await generateRecipeDetailsFromTitle(title);
        const image = await generateImageFromPrompt(recipeDetails.title);
        const newId = Date.now();
        let finalChef: Chef | undefined;
        if (recipeDetails.chef && (recipeDetails.chef as any).imagePrompt) {
            const chefImage = await generateImage((recipeDetails.chef as any).imagePrompt);
            await imageStore.setImage(`chef-${newId}`, chefImage);
            finalChef = { name: recipeDetails.chef.name, bio: recipeDetails.chef.bio, signatureDish: recipeDetails.chef.signatureDish, image: `indexeddb:chef-${newId}` };
        }
        const newRecipe: Recipe = { id: newId, image: image, ...recipeDetails, chef: finalChef };
        recipeService.addRecipe(newRecipe, addToNew, addToRotd);
    };
    
    const handleDeleteRecipeAdmin = (recipeId: number) => recipeService.deleteRecipe(recipeId);
    const handleUpdateRecipeAdmin = async (recipeId: number, title: string) => { await recipeService.updateRecipeWithAI(recipeId, title) };
    const handleUpdateAllRecipeImagesAdmin = async () => { /* Complex logic, might need a dedicated progress state */ };
    const handleDeleteUserAdmin = (userEmail: string) => { userService.deleteUser(userEmail) };
    const handleSendNewsletterAdmin = (newsletter: Omit<Newsletter, 'id' | 'sentDate'>) => { newsletterService.sendNewsletter(newsletter) };
    const handleUpdateProductsAdmin = (updatedProducts: Product[]) => { marketplaceService.saveProducts(updatedProducts) };
    const handleDeleteProductAdmin = (productId: string) => { marketplaceService.deleteProduct(productId) };
    const handleUpdateStandardCocktailsAdmin = (cocktails: SavedCocktail[]) => { cocktailService.saveStandardCocktails(cocktails) };
    const handleRemoveFromNewAdmin = (recipeId: number) => { recipeService.removeFromNew(recipeId) };
    const handleAddToNewAdmin = (recipeId: number) => { recipeService.addToNew(recipeId) };
    const handleAddToRotdAdmin = (recipeId: number) => { recipeService.addToRotd(recipeId) };
    const handleMoveRecipeFromRotdToMainAdmin = async (recipe: Recipe) => { return await recipeOfTheDayService.archiveRecipe(recipe) };
    const handleUpdateScheduledRecipesAdmin = async (newScheduledRecipes: Recipe[]) => { await recipeService.saveScheduledRecipes(newScheduledRecipes); };
    const handleImportDataAdmin = async (db: AppDatabase) => { await importDatabaseWithImages(db); window.location.reload(); };

    // --- Render Logic ---
    const recommendedRecipes = useMemo(() => newThisMonthRecipes, [newThisMonthRecipes]);
    const carouselTitle = (currentUser?.isPremium && currentUser.foodPreferences?.length) ? "Recommended For You" : "New This Month";

    const filteredAndSortedCookbook = useMemo(() => {
        return favoriteRecipes
            .filter(r => cookbookSelectedTag === 'All' || r.tags?.includes(cookbookSelectedTag))
            .sort((a, b) => a.title.localeCompare(b.title));
    }, [favoriteRecipes, cookbookSelectedTag]);
    
    const cookbookTags = useMemo(() => {
        return [...new Set(favoriteRecipes.flatMap(r => r.tags || []))].sort();
    }, [favoriteRecipes]);
    
    if (isLoading) return <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50"><Spinner size="w-12 h-12" /><p className="mt-4 text-slate-600 font-semibold">Loading your kitchen...</p></div>;
    if (isAdminView && currentUser?.isAdmin) return <AdminDashboard currentUser={currentUser} onExit={() => setIsAdminView(false)} allRecipes={allRecipes} newRecipes={newThisMonthRecipes} scheduledRecipes={databaseService.getDatabase().recipes.scheduled} users={users} sentNewsletters={newsletters.sent} collectedLeads={newsletters.leads} products={products} standardCocktails={standardCocktails} onAddRecipe={handleAddRecipeAdmin} onDeleteRecipe={handleDeleteRecipeAdmin} onUpdateRecipeWithAI={handleUpdateRecipeAdmin} onUpdateAllRecipeImages={handleUpdateAllRecipeImagesAdmin} isUpdatingAllImages={false} imageUpdateProgress={null} onUpdateUserRoles={handleUpdateUser} onDeleteUser={handleDeleteUserAdmin} onSendNewsletter={handleSendNewsletterAdmin} onUpdateProducts={handleUpdateProductsAdmin} onDeleteProduct={handleDeleteProductAdmin} onUpdateStandardCocktails={handleUpdateStandardCocktailsAdmin} onRemoveFromNew={handleRemoveFromNewAdmin} onAddToNew={handleAddToNewAdmin} onAddToRotd={handleAddToRotdAdmin} onMoveRecipeFromRotdToMain={handleMoveRecipeFromRotdToMainAdmin} onUpdateScheduledRecipes={handleUpdateScheduledRecipesAdmin} onImportData={handleImportDataAdmin} />;
    if (cookModeRecipe) return <CookMode recipe={cookModeRecipe} onExit={handleExitCookMode} measurementSystem={measurementSystem} />;
    
    const renderContent = () => {
        switch(activeTab) {
            case 'Pantry Chef': return <PantryChef onRecipeGenerated={handleRecipeGenerated} />;
            case "Where's This From?": return <DishIdentifier onSearchForDish={handleSearchForDish} />;
            case 'Featured Chefs': return <FeaturedChefs />;
            case 'AI Meal Planner': return currentUser?.isPremium || currentUser?.isAdmin ? <MealPlanGenerator allRecipes={allRecipes} allRecipeTitles={allRecipeTitles} onRecipeClick={handleCardClick} /> : <PremiumContent onUpgradeClick={() => setIsUpgradeModalOpen(true)} featureTitle="AI Meal Planner" features={["Generate custom meal plans", "Use any prompt", "AI selects from our recipes"]} isPremium={false} />;
            case 'My Cookbook': return currentUser?.isPremium || currentUser?.isAdmin ? (
                 <div className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/4"><CookbookTagFilter tags={cookbookTags} selectedTag={cookbookSelectedTag} onSelectTag={setCookbookSelectedTag} /></div>
                        <div className="w-full md:w-3/4">
                             <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">My Favorite Recipes</h2>{favoriteRecipes.length >= 3 && (<button onClick={() => setIsCookbookMakerOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg"><BookOpenIcon className="w-5 h-5" /><span>Create Cookbook</span></button>)}</div>
                             {filteredAndSortedCookbook.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{filteredAndSortedCookbook.map(recipe => (<RecipeCard key={recipe.id} recipe={recipe} onClick={handleCardClick} isFavorite={true} onToggleFavorite={handleToggleFavorite} variant="cookbook" />))}</div>) : (<EmptyState icon={<HeartIcon />} title="Your Cookbook is Empty" message="Add favorites by clicking the heart icon." actionText="Browse Recipes" onActionClick={() => handleSelectTab('All Recipes')} />)}
                        </div>
                    </div>
                 </div>
            ) : <PremiumContent onUpgradeClick={() => setIsUpgradeModalOpen(true)} featureTitle="Your Digital Cookbook" features={["Save unlimited favorite recipes", "Organize with custom tags", "Access on any device"]} isPremium={false} />;
            case 'Cocktail Book': return <CocktailBook standardCocktails={standardCocktails} savedCocktails={userData.cocktails} currentUser={currentUser} onSaveStandard={handleSaveStandardCocktail} onDelete={handleDeleteCocktail} onLoginRequest={() => setIsLoginModalOpen(true)} onUpgradeRequest={() => setIsUpgradeModalOpen(true)} onGoToBartender={() => handleSelectTab('Bartender Helper')} />;
            case 'Community Chat': return !currentUser ? <PremiumContent onUpgradeClick={() => setIsLoginModalOpen(true)} featureTitle="Join the Community Chat" isPremium={false} /> : <CommunityChat messages={communityChat} currentUser={currentUser} onSendMessage={handleSendMessage} />;
            case 'Data Sync': return <AdminDataSync onImportData={handleImportDataAdmin} />;
            case 'About Us': return <AboutUsPage />;
            case 'Marketplace': return <Marketplace allProducts={products} />;
            case 'Ask an Expert': return !(currentUser?.isPremium || currentUser?.isAdmin) ? <ExpertQAPremiumOffer onUpgradeClick={() => setIsUpgradeModalOpen(true)} /> : <AskAnExpert questions={expertQuestions} onAskQuestion={handleAddExpertQuestion} />;
            case 'Bartender Helper': return !currentUser ? <PremiumContent onUpgradeClick={() => setIsLoginModalOpen(true)} featureTitle="AI Bartender Helper" isPremium={false} /> : <BartenderHelper currentUser={currentUser} savedCocktails={userData.cocktails} onSaveCocktail={handleSaveCocktail} onUpgradeRequest={() => setIsUpgradeModalOpen(true)} />;
            case 'Cooking Classes': if (viewingCookingClass) { return <CookingClassDetail cookingClass={viewingCookingClass} onBack={() => setViewingCookingClass(null)} /> } return !(currentUser?.isPremium || currentUser?.isAdmin) ? <AdvancedClasses onUpgradeClick={() => setIsUpgradeModalOpen(true)} /> : <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{cookingClasses.map(c => <CookingClassCard key={c.id} cookingClass={c} onClick={setViewingCookingClass} />)}</div>;
            case 'Video Tutorials': const vidsByCat = videos.reduce((acc, v) => { (acc[v.category] = acc[v.category] || []).push(v); return acc; }, {} as Record<string, Video[]>); return <div className="space-y-12">{Object.keys(vidsByCat).map(cat => <div key={cat}><h2 className="text-2xl font-bold mb-4">{cat}</h2><div className="grid grid-cols-1 sm:grid-cols-4 gap-6">{vidsByCat[cat].map(vid => <VideoCard key={vid.id} video={vid} onPlay={setPlayingVideo} />)}</div></div>)}</div>;
            case 'Meal Plans': if (viewingMealPlan) { return (<div className="animate-fade-in"><button onClick={() => setViewingMealPlan(null)} className="flex items-center gap-2 mb-4"><ChevronLeftIcon className="w-5 h-5"/>Back</button><div className="text-center mb-8"><h2 className="text-3xl font-bold">{viewingMealPlan.title}</h2><p className="mt-2 text-lg">{viewingMealPlan.description}</p></div><div className="grid grid-cols-1 sm:grid-cols-4 gap-6">{viewingMealPlanRecipes.map(r => <RecipeCard key={r.id} recipe={r} onClick={handleCardClick} isFavorite={userData.favorites.includes(r.id)} onToggleFavorite={handleToggleFavorite} isSelected={selectedRecipeIds.includes(r.id)} onToggleSelect={handleToggleSelect} />)}</div></div>); } return <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">{mealPlans.map(plan => <MealPlanCard key={plan.id} plan={plan} allRecipes={allMealPlanRecipes} onViewPlan={setViewingMealPlan} />)}</div>;
            default: return (
                <div className="space-y-12">
                    <FeaturedChef recipe={featuredChefRecipe} isLoading={false} onClick={handleCardClick} />
                    <RecipeCarousel title={carouselTitle} recipes={recommendedRecipes.slice(0, 10)} favorites={userData.favorites} selectedRecipeIds={selectedRecipeIds} onCardClick={handleCardClick} onToggleFavorite={handleToggleFavorite} onToggleSelect={handleToggleSelect} />
                    <div>
                        <div className="text-center mb-8"><h2 className="text-3xl font-bold tracking-tight">Discover Our Recipes</h2><p className="mt-2 text-lg">Browse from <span className="font-bold text-green-600">{totalRecipeCount.toLocaleString()}</span> authentic recipes</p></div>
                        <div className="max-w-2xl mx-auto mb-8"><SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by recipe name, description, etc..."/></div>
                        <TagFilter tags={allTags} selectedTag={selectedTag} onSelectTag={setSelectedTag} />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} onClick={handleCardClick} isFavorite={userData.favorites.includes(recipe.id)} onToggleFavorite={handleToggleFavorite} isSelected={selectedRecipeIds.includes(recipe.id)} onToggleSelect={handleToggleSelect} />)}
                        </div>
                        
                        {(isLoadingRecipes && recipes.length === 0) && <div className="text-center mt-12"><Spinner size="w-10 h-10"/></div>}
                        
                        {(!isLoadingRecipes && recipes.length === 0) && <EmptyState icon={<SearchIcon />} title="No Recipes Found" message="Try adjusting your search or filters." actionText="Clear Filters" onActionClick={() => setSelectedTag('All')} />}
                        
                        {recipes.length < totalRecipeCount && !isLoadingRecipes && (
                            <div className="text-center mt-12">
                                <button onClick={loadMoreRecipes} className="px-6 py-3 bg-white border-2 border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50">Load More Recipes</button>
                            </div>
                        )}
                        {isLoadingRecipes && recipes.length > 0 && <div className="text-center mt-12"><Spinner size="w-8 h-8"/></div>}
                    </div>
                </div>
            );
        }
    }

    const recipeForModal = previewRecipe || selectedRecipe;

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
             <header className="bg-white shadow-sm sticky top-0 z-40 print:hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-16 sm:h-20"><button onClick={() => handleSelectTab('All Recipes')} className="flex items-center gap-3"><ChefHatIcon className="w-10 h-10 text-amber-500" /><span className="hidden sm:block text-xl sm:text-2xl font-bold tracking-tight">Recipe Extracter</span></button><div className="flex items-center gap-4"><UnitToggleButton system={measurementSystem} onSystemChange={handleSystemChange} />{currentUser ? (<UserMenu user={currentUser} onLogout={handleLogout} onShowFavorites={() => handleSelectTab('My Cookbook')} onOpenProfile={() => setIsProfileModalOpen(true)} onOpenLists={() => handleSelectTab('Shopping List')} />) : (<button onClick={() => setIsLoginModalOpen(true)} className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600">Login / Sign Up</button>)}</div></div></div>
            </header>
    
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <MainTabs activeTab={activeTab} onSelectTab={handleSelectTab} currentUser={currentUser} />
                <div className="mt-8">{renderContent()}</div>
                <section className="mt-16 max-w-4xl mx-auto"><NewsletterSignup onSubscribe={leadService.addLead} currentUser={currentUser} /></section>
            </main>
            
            {recipeForModal && <RecipeModal recipe={recipeForModal} onClose={handleCloseModal} measurementSystem={measurementSystem} onEnterCookMode={handleEnterCookMode} onAddRating={handleAddRating} isPreview={!!previewRecipe} onSave={handleSaveNewRecipe} onDiscard={handleDiscardNewRecipe} />}
            {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
            {isProfileModalOpen && currentUser && <ProfileModal user={currentUser} onClose={() => setIsProfileModalOpen(false)} onSave={handleUpdateUser} />}
            {viewingList && <ShoppingListModal list={viewingList} onClose={() => setViewingList(null)} measurementSystem={measurementSystem} />}
            {isSaveListModalOpen && <SaveListModal isOpen={isSaveListModalOpen} onClose={() => setIsSaveListModalOpen(false)} onSave={handleSaveList} existingListNames={userData.shoppingLists.map(l => l.name)} />}
            {isListsOverviewOpen && <ListsOverviewModal isOpen={isListsOverviewOpen} onClose={() => setIsListsOverviewOpen(false)} lists={userData.shoppingLists} onView={(list) => { setViewingList(list); setIsListsOverviewOpen(false); }} onDelete={handleDeleteList} onRename={handleRenameList} />}
            {playingVideo && <VideoPlayerModal video={playingVideo} onClose={() => setPlayingVideo(null)} />}
            {isUpgradeModalOpen && <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} onUpgrade={handleUpgradeUser} currentUser={currentUser} onLoginRequest={() => { setIsUpgradeModalOpen(false); setIsLoginModalOpen(true); }} />}
            {isCookbookMakerOpen && currentUser?.isPremium && <CookbookMakerModal isOpen={isCookbookMakerOpen} onClose={() => setIsCookbookMakerOpen(false)} favoriteRecipes={favoriteRecipes} measurementSystem={measurementSystem} />}
            {isPrivacyPolicyOpen && <PrivacyPolicy isOpen={isPrivacyPolicyOpen} onClose={() => setIsPrivacyPolicyOpen(false)} />}
    
            <Footer onAboutClick={() => handleSelectTab('About Us')} onPrivacyClick={() => setIsPrivacyPolicyOpen(true)} />
    
            {selectedRecipeIds.length > 0 && (<div className="fixed bottom-6 right-6 z-30"><button onClick={() => setIsSaveListModalOpen(true)} className="flex items-center gap-3 px-5 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg hover:bg-green-600 animate-fade-in"><ShoppingCartIcon className="w-6 h-6"/><span>Save {selectedRecipeIds.length} Recipe{selectedRecipeIds.length > 1 && 's'}</span><span className="ml-2 w-7 h-7 bg-white text-green-600 flex items-center justify-center rounded-full text-sm font-bold">{selectedRecipeIds.length}</span></button></div>)}
        </div>
    );
};

export default App;