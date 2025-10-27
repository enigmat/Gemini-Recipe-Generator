import React, { useState, useMemo, useEffect } from 'react';
import { recipes as initialRecipes } from './data/recipes';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import TagFilter from './components/TagFilter';
import { Recipe, User, ShoppingList, MealPlan, Video, CookingClass, Newsletter, Lead, Product, AboutUsContent, CocktailRecipe, SavedCocktail, ExpertQuestion } from './types';
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
import { newRecipes as initialNewRecipes } from './data/newRecipes';
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
import Marketplace from './components/Marketplace';
import * as marketplaceService from './services/marketplaceService';
import * as aboutUsService from './services/aboutUsService';
import AboutUsModal from './components/AboutUsModal';
import PrivacyPolicy from './components/PrivacyPolicy';
import * as cocktailService from './services/cocktailService';
import MyBar from './components/MyBar';
import AdvancedClasses from './components/AdvancedClasses';
import ExpertQAPremiumOffer from './components/ExpertQAPremiumOffer';
import { initialExpertQuestions } from './data/expertQuestions';

const RECIPES_PER_PAGE = 12;

const ALL_CATEGORY_TAGS = [
    'Appetizer', 'Asian', 'Baking', 'Breakfast', 'Caribbean', 'Chinese', 'Classic', 'Comfort Food', 'Curry',
    'Dessert', 'Dinner', 'Family-Friendly', 'Gluten-Free', 'Grill', 'Healthy', 'Indian', 'Italian', 'Jamaican',
    'Japanese', 'Lunch', 'Meal Prep', 'Mexican', 'One-Pan', 'Party Food', 'Pasta', 'Quick & Easy', 'Roast',
    'Salad', 'Seafood', 'Soup', 'Spicy', 'Stir-fry', 'Vegan', 'Vegetarian'
];

const applyRatings = (recipes: Recipe[]): Recipe[] => {
    return recipes.map(recipe => {
        const storedRating = ratingService.getRating(recipe.id);
        return storedRating ? { ...recipe, rating: storedRating } : recipe;
    });
};

const App: React.FC = () => {
    const [allRecipes, setAllRecipes] = useState<Recipe[]>(() => applyRatings(initialRecipes));
    const [newThisMonthRecipes, setNewThisMonthRecipes] = useState<Recipe[]>(() => applyRatings(initialNewRecipes));
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [activeTab, setActiveTab] = useState<string>('All Recipes');
    const [selectedTag, setSelectedTag] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [favorites, setFavorites] = useState<number[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [pantryIngredients, setPantryIngredients] = useState<string[]>([]);
    const [committedPantryIngredients, setCommittedPantryIngredients] = useState<string[]>([]);
    const [measurementSystem, setMeasurementSystem] = useState<'metric' | 'us'>('metric');
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

    // Extractor state
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractError, setExtractError] = useState<string | null>(null);

    // Pagination state
    const [visibleRecipeCount, setVisibleRecipeCount] = useState(RECIPES_PER_PAGE);

    // Marketplace state
    const [products, setProducts] = useState<Product[]>([]);
    
    // Static Pages State
    const [aboutUsContent, setAboutUsContent] = useState<AboutUsContent | null>(null);
    const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
    const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
    
    // My Bar state
    const [savedCocktails, setSavedCocktails] = useState<SavedCocktail[]>([]);

    // Expert Q&A state
    const [expertQuestions, setExpertQuestions] = useState<ExpertQuestion[]>(initialExpertQuestions);

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
        setAboutUsContent(aboutUsService.getAboutUsContent());
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

    const handleUpgradeUser = () => {
        if (!currentUser) return;
        const upgradedUser = { ...currentUser, isPremium: true };
        handleUpdateUser(upgradedUser);
        setIsUpgradeModalOpen(false);
    };

    const handleCardClick = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
    };

    const handleCloseModal = () => {
        setSelectedRecipe(null);
    };

    const handleEnterCookMode = (recipe: Recipe) => {
        setSelectedRecipe(null); // Close the modal first
        setCookModeRecipe(recipe);
    };

    const handleExitCookMode = () => {
        setCookModeRecipe(null);
    };
    
    const handleSelectTab = (tab: string) => {
        if (['My Cookbook', 'Shopping List', 'My Bar'].includes(tab)) {
            if (!currentUser) {
                setIsLoginModalOpen(true);
                return;
            }
            if (tab === 'Shopping List') {
                setIsListsOverviewOpen(true);
                return; 
            }
        }
        if (['Cooking Classes', 'Ask an Expert'].includes(tab) && !currentUser?.isPremium) {
            setActiveTab(tab); // Allow navigation to see the upsell
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
        const newCocktail = cocktailService.saveCocktail(recipe, image, currentUser.email);
        if (newCocktail) {
            setSavedCocktails(prev => [newCocktail, ...prev]);
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

    // Admin panel functions
    const handleAddNewRecipe = async (title: string, addToNew: boolean): Promise<void> => {
        // This function will call the Gemini service
        const recipeDetails = await generateRecipeDetailsFromTitle(title);
        const image = await generateImageFromPrompt(recipeDetails.title);
        
        const newRecipe: Recipe = {
            id: Date.now(),
            image,
            ...recipeDetails
        };
        
        setAllRecipes(prev => [newRecipe, ...prev]);

        if (addToNew) {
            setNewThisMonthRecipes(prev => [newRecipe, ...prev]);
        }
    };

    const handleDeleteRecipe = (recipeId: number) => {
        setAllRecipes(prev => prev.filter(r => r.id !== recipeId));
        setNewThisMonthRecipes(prev => prev.filter(r => r.id !== recipeId));
    };

    const handleUpdateRecipeWithAI = async (recipeId: number, title: string) => {
        const recipeDetails = await generateRecipeDetailsFromTitle(title);
        const image = await generateImageFromPrompt(recipeDetails.title);

        const updatedRecipe: Recipe = {
            id: recipeId,
            image,
            ...recipeDetails
        };

        setAllRecipes(prev => prev.map(r => r.id === recipeId ? updatedRecipe : r));
        setNewThisMonthRecipes(prev => prev.map(r => r.id === recipeId ? updatedRecipe : r));
    };

    const handleDeleteUser = (userEmail: string) => {
        userService.deleteUser(userEmail);
        setAllUsers(userService.getAllUsers());
    };

    const handleSendNewsletter = (newsletterData: Omit<Newsletter, 'id' | 'sentDate'>) => {
        const newNewsletter = newsletterService.sendNewsletter(newsletterData);
        setSentNewsletters(prev => [newNewsletter, ...prev]);
    };

    // --- Extractor functions ---
    const handleExtractFromUrl = async (url: string) => {
        setIsExtracting(true);
        setExtractError(null);
        try {
            const recipeDetails = await generateRecipeFromUrl(url);
            const image = await generateImageFromPrompt(recipeDetails.title);
            const newRecipe: Recipe = {
                id: Date.now(),
                image,
                ...recipeDetails
            };
            setAllRecipes(prev => [newRecipe, ...prev]);
            setSelectedRecipe(newRecipe); // Open the new recipe in a modal
        } catch (e: any) {
            setExtractError(e.message || 'An unknown error occurred.');
        } finally {
            setIsExtracting(false);
        }
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
                onAddRecipe={handleAddNewRecipe}
                onDeleteRecipe={handleDeleteRecipe}
                onUpdateRecipeWithAI={handleUpdateRecipeWithAI}
                onUpdateUserRoles={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                onSendNewsletter={handleSendNewsletter}
                onExit={() => handleSelectTab('All Recipes')}
            />
        );
    }
    
    const renderContent = () => {
        switch(activeTab) {
            case 'My Cookbook':
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
                                    <EmptyState icon={<HeartIcon />} title="Your Cookbook is Empty" message="Add your favorite recipes by clicking the heart icon." />
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'My Bar':
                return <MyBar savedCocktails={savedCocktails} onDelete={handleDeleteCocktail} />;
            case 'Meal Plans':
                 return (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mealPlans.map(plan => (
                            <MealPlanCard key={plan.id} plan={plan} allRecipes={allRecipes} onViewPlan={setViewingMealPlan} />
                        ))}
                    </div>
                );
            case 'Video Tutorials':
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
                return <BartenderHelper currentUser={currentUser} savedCocktails={savedCocktails} onSaveCocktail={handleSaveCocktail} />;
            case 'Ask an Expert':
                if (!currentUser?.isPremium) {
                    return <ExpertQAPremiumOffer onUpgradeClick={() => setIsUpgradeModalOpen(true)} />;
                }
                return <AskAnExpert questions={expertQuestions} onAskQuestion={handleAddExpertQuestion} />;
            case 'Marketplace':
                return <Marketplace allProducts={products} />;
            case 'All Recipes':
            default:
                return (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white p-8 rounded-lg shadow-sm">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800">Recipe Extractor</h1>
                                <p className="mt-4 text-gray-600">Have a recipe link you love? Paste it here, and our AI will extract, format, and save it for you.</p>
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
                                    "12 exclusive recipes each month",
                                    "Chef-curated seasonal specialties",
                                    "Early access to trending dishes",
                                    "Premium ingredient recommendations",
                                ]}
                            />
                        )}

                        {currentUser?.isPremium && (
                            <RecipeCarousel
                                title="New This Month"
                                recipes={newThisMonthRecipes}
                                favorites={favorites}
                                selectedRecipeIds={selectedRecipeIds}
                                onCardClick={handleCardClick}
                                onToggleFavorite={handleToggleFavorite}
                                onToggleSelect={handleToggleSelect}
                            />
                        )}
    
                        <div>
                             <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Discover Our Recipes</h2>
                                <p className="mt-2 text-lg text-gray-500">
                                    Discover from <span className="font-bold text-green-600">{allRecipes.length.toLocaleString()}</span> authentic recipes
                                </p>
                            </div>
                            <TagFilter tags={ALL_CATEGORY_TAGS} selectedTag={selectedTag} onSelectTag={handleSelectTag} />
                            
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
                                <EmptyState icon={<SearchIcon />} title="No Recipes Found" message="Try adjusting your search or filters." />
                            )}
                            
                            {visibleRecipeCount < filteredRecipes.length && (
                                <div className="text-center mt-12">
                                    <button onClick={() => setVisibleRecipeCount(c => c + RECIPES_PER_PAGE)} className="px-6 py-3 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                                        Load More Recipes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
             <header className="bg-white shadow-sm sticky top-0 z-40 print:hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <button onClick={() => handleSelectTab('All Recipes')} className="flex items-center gap-3">
                            <ChefHatIcon className="w-10 h-10 text-amber-500" />
                            <span className="text-2xl font-bold text-gray-800 tracking-tight">Recipe Extracter</span>
                        </button>
                        <div className="flex items-center gap-4">
                            {currentUser ? (
                                <UserMenu
                                    user={currentUser}
                                    onLogout={handleLogout}
                                    onShowFavorites={() => handleSelectTab('My Cookbook')}
                                    onOpenProfile={() => setIsProfileModalOpen(true)}
                                    onOpenLists={() => setIsListsOverviewOpen(true)}
                                    onOpenAdmin={() => handleSelectTab('Admin Dashboard')}
                                />
                            ) : (
                                <button
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors"
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
            
            {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={handleCloseModal} measurementSystem={measurementSystem} onEnterCookMode={handleEnterCookMode} onAddRating={handleAddRating} />}
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
            {isAboutUsOpen && <AboutUsModal isOpen={isAboutUsOpen} onClose={() => setIsAboutUsOpen(false)} content={aboutUsContent} />}
            {isPrivacyPolicyOpen && <PrivacyPolicy isOpen={isPrivacyPolicyOpen} onClose={() => setIsPrivacyPolicyOpen(false)} />}
    
            <Footer onAboutClick={() => setIsAboutUsOpen(true)} onPrivacyClick={() => setIsPrivacyPolicyOpen(true)} />
    
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