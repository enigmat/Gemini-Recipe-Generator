import React, { useState, useMemo, useEffect } from 'react';
import { Recipe, ShoppingList, MealPlan, Video, VideoCategory, Lesson, CookingClass, User, Lead, DrinkRecipe } from './types';
import Header from './components/Header';
import RecipeCard from './components/RecipeCard';
import SearchBar from './components/SearchBar';
import RecipeModal from './components/RecipeModal';
import TagFilter from './components/TagFilter';
import { recipes as allRecipesData } from './data/recipes';
import { mealPlans } from './data/mealPlans';
import { videoData as initialVideoData } from './data/videos';
import { cookingClasses as cookingClassesData } from './data/cookingClasses';
import * as favoritesService from './services/favoritesService';
import * as userService from './services/userService';
import * as leadService from './services/leadService';
import * as imageStore from './services/imageStore';
import * as ratingService from './services/ratingService';
import IngredientInput from './components/IngredientInput';
import { generateRecipes, generateShoppingList, importRecipeFromUrl, fixRecipeImage, generateImage, generateRecipeFromPrompt, categorizeShoppingListItem, generateRecipeVariation } from './services/geminiService';
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
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import AboutUsModal from './components/AboutUsModal';
import ShoppingListModal from './components/ShoppingListModal';
import VariationModal from './components/VariationModal';
import FavoriteRecipes from './components/FavoriteRecipes';
import CalendarDaysIcon from './components/icons/CalendarDaysIcon';
import FilmIcon from './components/icons/FilmIcon';
import MortarPestleIcon from './components/icons/MortarPestleIcon';
import QuestionMarkCircleIcon from './components/icons/QuestionMarkCircleIcon';
import IdeaInput from './components/IdeaInput';


const ITEMS_PER_PAGE = 12;
const RECIPES_STORAGE_KEY = 'recipeextracter_allRecipes';
const CLASSES_STORAGE_KEY = 'recipeextracter_cookingClasses';
const VIDEOS_STORAGE_KEY = 'recipeextracter_videos';
const SHOPPING_LIST_KEY = 'recipeextracter_shoppingList';

type View = 'all' | 'saved' | 'plans' | 'videos' | 'bartender' | 'shopping' | 'classes' | 'expert';

const App: React.FC = () => {
    // Single source of truth for all recipes, with localStorage persistence
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [areRecipesLoading, setAreRecipesLoading] = useState(true);

    const [cookingClasses, setCookingClasses] = useState<CookingClass[]>([]);
    const [videos, setVideos] = useState<VideoCategory[]>([]);

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
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    
    // States for recipe from idea generation
    const [recipePrompt, setRecipePrompt] = useState('');
    const [promptError, setPromptError] = useState<string | null>(null);
    const [isGeneratingFromIdea, setIsGeneratingFromIdea] = useState(false);

    // States for URL import
    const [recipeUrl, setRecipeUrl] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [importError, setImportError] = useState<string | null>(null);
    const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);

    // State for Camera Modal
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

    // States for shopping list
    const [shoppingList, setShoppingList] = useState<ShoppingList>([]);
    const [isShoppingListLoading, setIsShoppingListLoading] = useState(false);
    const [shoppingListError, setShoppingListError] = useState<string | null>(null);
    const [shoppingListModalRecipe, setShoppingListModalRecipe] = useState<Recipe | MealPlan | null>(null);
    const [isAddingItem, setIsAddingItem] = useState(false);

    // States for Meal Plans
    const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);

    // State for Cook Mode
    const [cookingRecipe, setCookingRecipe] = useState<Recipe | null>(null);
    
    // State for Recipe Variation
    const [variationRecipe, setVariationRecipe] = useState<Recipe | null>(null);
    const [isGeneratingVariation, setIsGeneratingVariation] = useState(false);
    const [variationError, setVariationError] = useState<string | null>(null);

    // State for Videos
    const [playingVideo, setPlayingVideo] = useState<Video | Lesson | null>(null);

    // State for Advanced Classes
    const [selectedClass, setSelectedClass] = useState<CookingClass | null>(null);

    // State for Ask an Expert
    const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);

    // State for privacy policy modal
    const [isPrivacyPolicyVisible, setIsPrivacyPolicyVisible] = useState(false);
    // State for about us modal
    const [isAboutUsVisible, setIsAboutUsVisible] = useState(false);


    // --- Data Loading and Persistence ---
    useEffect(() => {
        const loadInitialData = async () => {
            const user = userService.getCurrentUser();
            setCurrentUser(user);
            setIsPremium(userService.getPremiumStatus());
            setAllUsers(userService.getAllUsers());
            setLeads(leadService.getAllLeads());
            setSavedRecipeTitles(favoritesService.getSavedRecipeTitles());

            // Load recipes
            let recipesFromStorage: Recipe[] = [];
            try {
                const storedRecipesJson = localStorage.getItem(RECIPES_STORAGE_KEY);
                recipesFromStorage = storedRecipesJson ? JSON.parse(storedRecipesJson) : allRecipesData;
            } catch (error) {
                console.error("Error parsing recipes from localStorage", error);
                recipesFromStorage = allRecipesData;
            }

            const hydratedRecipes = await Promise.all(
                recipesFromStorage.map(async (recipe) => {
                    if (recipe.imageUrl && recipe.imageUrl.startsWith('indexeddb:')) {
                        const key = recipe.imageUrl.substring(10);
                        const storedImage = await imageStore.getImage(key);
                        return storedImage ? { ...recipe, imageUrl: storedImage } : recipe;
                    }
                    return recipe;
                })
            );
            setAllRecipes(hydratedRecipes);
            setAreRecipesLoading(false);
            
            // Load classes, videos, shopping list
            setCookingClasses(JSON.parse(localStorage.getItem(CLASSES_STORAGE_KEY) || JSON.stringify(cookingClassesData)));
            setVideos(JSON.parse(localStorage.getItem(VIDEOS_STORAGE_KEY) || JSON.stringify(initialVideoData)));
            setShoppingList(JSON.parse(localStorage.getItem(SHOPPING_LIST_KEY) || '[]'));
            
            // Stripe checkout redirect handling
            const query = new URLSearchParams(window.location.search);
            if (query.get('checkout') === 'success') {
                userService.setPremiumStatus(true);
                setCurrentUser(userService.getCurrentUser());
                setIsPremium(true);
                setShowUpgradeConfirmation(true);
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        };

        loadInitialData();
    }, []);

    const saveAllRecipesToStorage = (updatedRecipes: Recipe[]) => {
        try {
            const recipesToStore = updatedRecipes.map(r => ({...r, imageUrl: r.imageUrl.startsWith('data:') ? `indexeddb:${r.title}` : r.imageUrl}));
            localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipesToStore));
            setAllRecipes(updatedRecipes);
        } catch (error) {
            console.error("Failed to save recipes to localStorage", error);
        }
    };
    
    // --- Derived Data ---
    const activeRecipes = useMemo(() => allRecipes.filter(r => r.status === 'active'), [allRecipes]);
    const newThisMonthRecipes = useMemo(() => allRecipes.filter(r => r.status === 'new_this_month'), [allRecipes]);
    const savedRecipes = useMemo(() => allRecipes.filter(r => savedRecipeTitles.includes(r.title)), [allRecipes, savedRecipeTitles]);
    
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        activeRecipes.forEach(recipe => recipe.tags.forEach(tag => tags.add(tag)));
        return Array.from(tags).sort();
    }, [activeRecipes]);
    
    const filteredRecipes = useMemo(() => {
        let recipes = currentView === 'saved' ? savedRecipes : activeRecipes;
        return recipes.filter(recipe => {
            const query = searchQuery.toLowerCase();
            const matchesQuery = recipe.title.toLowerCase().includes(query) ||
                                 recipe.ingredients.some(ing => ing.toLowerCase().includes(query)) ||
                                 recipe.tags.some(tag => tag.toLowerCase().includes(query));
            const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => recipe.tags.includes(tag));
            return matchesQuery && matchesTags;
        });
    }, [searchQuery, selectedTags, activeRecipes, savedRecipes, currentView]);

    const topRatedRecipes = useMemo(() => {
        return allRecipes
            .map(recipe => {
                const ratings = ratingService.getRatingsForRecipe(recipe.title);
                const ratingCount = ratings.length;
                const averageRating = ratingCount > 0 ? ratings.reduce((a, b) => a + b, 0) / ratingCount : 0;
                return { ...recipe, averageRating, ratingCount };
            })
            .filter(recipe => recipe.averageRating >= 4 && recipe.ratingCount >= 3)
            .sort((a, b) => b.averageRating - a.averageRating);
    }, [allRecipes]);
    

    // --- Handlers ---
    const handleSelectRecipe = (recipe: Recipe) => setSelectedRecipe(recipe);
    const handleCloseModal = () => setSelectedRecipe(null);

    const addRecipeToCookbook = async (recipe: Recipe): Promise<boolean> => {
        if (allRecipes.some(r => r.title.toLowerCase() === recipe.title.toLowerCase())) {
            return false; // Indicate it was not added
        }
        if (recipe.imageUrl.startsWith('data:')) {
            await imageStore.saveImage(recipe.title, recipe.imageUrl);
        }
        saveAllRecipesToStorage([recipe, ...allRecipes]);
        return true; // Indicate success
    }
    
    const handleToggleSave = async (itemTitle: string, itemData?: DrinkRecipe) => {
        const isSaved = savedRecipeTitles.includes(itemTitle);
    
        if (isSaved) {
            // Un-saving is simple, just remove from the favorites list.
            favoritesService.unsaveRecipe(itemTitle);
        } else {
            // Saving
            favoritesService.saveRecipe(itemTitle);
    
            // If it's a new drink (itemData is provided), convert and add it to the main recipe list.
            if (itemData) {
                const recipeFromDrink: Recipe = {
                    title: itemData.name,
                    description: itemData.description,
                    imageUrl: itemData.imageUrl,
                    ingredients: itemData.ingredients,
                    instructions: itemData.instructions,
                    tags: ['Cocktail', 'Drink', itemData.glassware].filter(Boolean),
                    servings: '1 serving',
                    prepTime: '5 min',
                    cookTime: '5 min',
                    status: 'active',
                    nutrition: { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A' },
                };
                await addRecipeToCookbook(recipeFromDrink);
            }
        }
        // This setState will trigger a re-render
        setSavedRecipeTitles(favoritesService.getSavedRecipeTitles());
    };
    
    const handleTagClick = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };
    const handleLogin = (email: string) => {
        userService.loginUser(email);
        setCurrentUser(userService.getCurrentUser());
        setIsPremium(userService.getPremiumStatus());
        setIsLoginModalOpen(false);
    };
    const handleLogout = () => {
        userService.logoutUser();
        setCurrentUser(null);
        setIsPremium(false);
        setIsDashboardVisible(false);
    };
    const handleGenerateFromIngredients = async () => {
        if (ingredients.length === 0) {
            setGenerationError("Please add at least one ingredient.");
            return;
        }
        setIsGenerating(true);
        setGenerationError(null);
        setPromptError(null);
        setImportSuccessMessage(null);
        try {
            const generatedRecipes = await generateRecipes(ingredients);
            
            const recipesToAdd: Recipe[] = [];
            const existingTitles = new Set(allRecipes.map(r => r.title.toLowerCase()));
    
            for (const recipe of generatedRecipes) {
                if (!existingTitles.has(recipe.title.toLowerCase())) {
                    recipesToAdd.push(recipe);
                    existingTitles.add(recipe.title.toLowerCase());
                }
            }
            
            if (recipesToAdd.length > 0) {
                // Save images for all new recipes
                for (const recipe of recipesToAdd) {
                    if (recipe.imageUrl.startsWith('data:')) {
                        await imageStore.saveImage(recipe.title, recipe.imageUrl);
                    }
                }
                // Prepend new recipes and save all at once
                saveAllRecipesToStorage([...recipesToAdd.reverse(), ...allRecipes]);
                setImportSuccessMessage(`Success! We've added ${recipesToAdd.length} new recipes to your collection.`);
            } else {
                setImportSuccessMessage("All generated recipes were already in your collection.");
            }
    
            setIngredients([]);
            document.getElementById('all-recipes-section')?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            setGenerationError(error instanceof Error ? error.message : "An unknown error occurred.");
        } finally {
            setIsGenerating(false);
        }
    };
    const handleImportFromUrl = async () => {
        if (!recipeUrl.trim()) {
            setImportError("Please enter a URL.");
            return;
        }
        setIsImporting(true);
        setImportError(null);
        setImportSuccessMessage(null);
        setPromptError(null);
        try {
            const newRecipe = await importRecipeFromUrl(recipeUrl);
            const added = await addRecipeToCookbook(newRecipe);
            if(added) {
                setImportSuccessMessage(`Successfully imported "${newRecipe.title}"!`);
            } else {
                setImportSuccessMessage(`"${newRecipe.title}" is already in your collection.`);
            }
            setRecipeUrl('');
        } catch (error) {
            setImportError(error instanceof Error ? error.message : "Failed to import.");
        } finally {
            setIsImporting(false);
        }
    };
    const handleGenerateFromIdea = async () => {
        if (!recipePrompt.trim()) {
            setPromptError("Please describe the recipe you'd like to create.");
            return;
        }
        setIsGeneratingFromIdea(true);
        setPromptError(null);
        setGenerationError(null);
        setImportError(null);
        setImportSuccessMessage(null);

        try {
            const recipe = await generateRecipeFromPrompt(recipePrompt);
            const added = await addRecipeToCookbook(recipe);
            if (added) {
                setImportSuccessMessage(`Success! "${recipe.title}" has been added to your collection.`);
            } else {
                setImportSuccessMessage(`"${recipe.title}" is already in your cookbook.`);
            }
            setRecipePrompt('');
            document.getElementById('all-recipes-section')?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            setPromptError(error instanceof Error ? error.message : "An unknown error occurred.");
        } finally {
            setIsGeneratingFromIdea(false);
        }
    };
    const handleIngredientsScanned = (scannedIngredients: string[]) => {
        setIngredients(prev => [...new Set([...prev, ...scannedIngredients])]);
        setIsCameraModalOpen(false);
    };
    
    const handleGenerateShoppingList = async (source: Recipe | MealPlan) => {
        setShoppingListModalRecipe(source);
        setIsShoppingListLoading(true);
        setShoppingListError(null);
        try {
            let ingredientsToList: string[] = [];
            if ('ingredients' in source) {
                ingredientsToList = source.ingredients;
            } else {
                source.plan.forEach(day => {
                    const recipe = allRecipes.find(r => r.title === day.recipeTitle);
                    if (recipe) ingredientsToList.push(...recipe.ingredients);
                });
            }
            const list = await generateShoppingList(ingredientsToList);
            setShoppingList(list);
            localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(list));
        } catch (error) {
            setShoppingListError(error instanceof Error ? error.message : "Failed to generate list.");
        } finally {
            setIsShoppingListLoading(false);
        }
    };
    const handleAddItemToList = async (item: string) => {
        setIsAddingItem(true);
        const category = await categorizeShoppingListItem(item);
        setShoppingList(prevList => {
            const newList = JSON.parse(JSON.stringify(prevList));
            const categoryIndex = newList.findIndex((c: { category: string; }) => c.category === category);
            if (categoryIndex > -1) {
                newList[categoryIndex].items.push(item);
            } else {
                newList.push({ category, items: [item] });
            }
            localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(newList));
            return newList;
        });
        setIsAddingItem(false);
    };
    const handleDeleteItem = (category: string, item: string) => {
        setShoppingList(prevList => {
            const newList = prevList.map(cat => {
                if (cat.category === category) {
                    return { ...cat, items: cat.items.filter(i => i !== item) };
                }
                return cat;
            }).filter(cat => cat.items.length > 0);
            localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(newList));
            return newList;
        });
    };
    const handleClearShoppingList = () => {
        if (window.confirm("Are you sure you want to clear the entire shopping list?")) {
            setShoppingList([]);
            localStorage.removeItem(SHOPPING_LIST_KEY);
        }
    };
    
    const handleGenerateVariation = async (originalRecipe: Recipe, variationRequest: string) => {
        setIsGeneratingVariation(true);
        setVariationError(null);
        try {
            const newRecipe = await generateRecipeVariation(originalRecipe, variationRequest, ingredients);
            await addRecipeToCookbook(newRecipe);
            setVariationRecipe(null); 
            setSelectedRecipe(newRecipe); 
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setVariationError(errorMessage);
        } finally {
            setIsGeneratingVariation(false);
        }
    };

    // Admin Handlers
    const handleAddRecipe = (recipe: Recipe) => {
        addRecipeToCookbook(recipe);
    };
    const handleDeleteRecipe = (title: string) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            saveAllRecipesToStorage(allRecipes.filter(r => r.title !== title));
        }
    };
    const handleUpdateRecipeStatus = (title: string, status: Recipe['status']) => {
        const updatedRecipes = allRecipes.map(r => r.title === title ? { ...r, status } : r);
        saveAllRecipesToStorage(updatedRecipes);
    };
    const handleFixRecipeImage = async (title: string) => {
        const recipe = allRecipes.find(r => r.title === title);
        if (!recipe) return;
        try {
            const newImageUrl = await fixRecipeImage(recipe);
            if (newImageUrl.startsWith('data:')) {
                await imageStore.saveImage(recipe.title, newImageUrl);
            }
            const updatedRecipes = allRecipes.map(r => r.title === title ? { ...r, imageUrl: newImageUrl } : r);
            saveAllRecipesToStorage(updatedRecipes);
        } catch (error) {
            alert(`Failed to fix image for ${title}.`);
        }
    };
    const handleUpdateUser = (email: string, updatedData: Partial<User>) => {
        userService.updateUser(email, updatedData);
        setAllUsers(userService.getAllUsers());
        if (currentUser?.email === email) {
            setCurrentUser(userService.getCurrentUser());
        }
    };

    // --- Cooking Class Management Handlers ---
    const saveCookingClassesToStorage = (updatedClasses: CookingClass[]) => {
        localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(updatedClasses));
        setCookingClasses(updatedClasses);
    };

    const handleAddCookingClass = (newClassData: Omit<CookingClass, 'id'>) => {
        const newClass: CookingClass = {
            id: `class-${Date.now()}`,
            ...newClassData,
        };
        saveCookingClassesToStorage([newClass, ...cookingClasses]);
    };

    const handleUpdateCookingClass = (classId: string, updatedData: Partial<Omit<CookingClass, 'id' | 'lessons'>>) => {
        const updatedClasses = cookingClasses.map(cls =>
            cls.id === classId ? { ...cls, ...updatedData } : cls
        );
        saveCookingClassesToStorage(updatedClasses);
    };

    const handleDeleteCookingClass = (classId: string) => {
        if (window.confirm("Are you sure you want to delete this class and all its lessons?")) {
            saveCookingClassesToStorage(cookingClasses.filter(cls => cls.id !== classId));
        }
    };

    const handleAddLesson = (classId: string) => {
        const newLesson: Lesson = {
            id: `lesson-${Date.now()}`,
            title: 'New Lesson',
            duration: '00:00',
            thumbnailUrl: 'https://placehold.co/800x450/cccccc/ffffff/png?text=New',
            videoUrl: '',
        };
        const updatedClasses = cookingClasses.map(cls =>
            cls.id === classId ? { ...cls, lessons: [...cls.lessons, newLesson] } : cls
        );
        saveCookingClassesToStorage(updatedClasses);
    };

    const handleUpdateLesson = (classId: string, lessonId: string, updatedData: Partial<Omit<Lesson, 'id'>>) => {
        const updatedClasses = cookingClasses.map(cls => {
            if (cls.id === classId) {
                const updatedLessons = cls.lessons.map(lsn =>
                    lsn.id === lessonId ? { ...lsn, ...updatedData } : lsn
                );
                return { ...cls, lessons: updatedLessons };
            }
            return cls;
        });
        saveCookingClassesToStorage(updatedClasses);
    };

    const handleDeleteLesson = (classId: string, lessonId: string) => {
        if (window.confirm("Are you sure you want to delete this lesson?")) {
            const updatedClasses = cookingClasses.map(cls => {
                if (cls.id === classId) {
                    return { ...cls, lessons: cls.lessons.filter(lsn => lsn.id !== lessonId) };
                }
                return cls;
            });
            saveCookingClassesToStorage(updatedClasses);
        }
    };

    const handleUpdateClassImage = async (classId: string, prompt: string) => {
        try {
            const newImageUrl = await generateImage(prompt);
            const updatedClasses = cookingClasses.map(cls =>
                cls.id === classId ? { ...cls, imageUrl: newImageUrl } : cls
            );
            saveCookingClassesToStorage(updatedClasses);
        } catch (error) {
            alert(`Failed to generate image for class ${classId}.`);
            console.error(error);
        }
    };


    // --- Video Management Handlers ---
    const saveVideosToStorage = (updatedVideos: VideoCategory[]) => {
        localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(updatedVideos));
        setVideos(updatedVideos);
    };
    const handleAddVideoCategory = () => saveVideosToStorage([...videos, { id: `cat-${Date.now()}`, title: 'New Category', videos: [] }]);
    const handleUpdateVideoCategory = (categoryId: string, newTitle: string) => saveVideosToStorage(videos.map(cat => cat.id === categoryId ? { ...cat, title: newTitle } : cat));
    const handleDeleteVideoCategory = (categoryId: string) => {
        if (window.confirm("Delete this category and all its videos?")) {
            saveVideosToStorage(videos.filter(cat => cat.id !== categoryId));
        }
    };
    const handleAddVideo = (categoryId: string, video?: Omit<Video, 'id'>) => {
        const newVideo: Video = {
            id: `video-${Date.now()}`,
            title: video?.title || 'New Video',
            description: video?.description || 'Description',
            thumbnailUrl: video?.thumbnailUrl || 'https://placehold.co/800x450/cccccc/ffffff/png?text=New',
            videoUrl: video?.videoUrl || '',
        };
        saveVideosToStorage(videos.map(cat => cat.id === categoryId ? { ...cat, videos: [...cat.videos, newVideo] } : cat));
    };
    const handleUpdateVideo = (categoryId: string, videoId: string, updatedData: Partial<Omit<Video, 'id'>>) => {
        saveVideosToStorage(videos.map(cat => cat.id === categoryId ? { ...cat, videos: cat.videos.map(vid => vid.id === videoId ? { ...vid, ...updatedData } : vid) } : cat));
    };
    const handleDeleteVideo = (categoryId: string, videoId: string) => {
        if (window.confirm("Delete this video?")) {
            saveVideosToStorage(videos.map(cat => cat.id === categoryId ? { ...cat, videos: cat.videos.filter(vid => vid.id !== videoId) } : cat));
        }
    };

    if (isDashboardVisible && currentUser?.isAdmin) {
        return (
            <div className="container mx-auto px-4">
                <AdminDashboard
                    onBackToApp={() => setIsDashboardVisible(false)}
                    allUsers={allUsers}
                    allRecipes={allRecipes}
                    allLeads={leads}
                    cookingClasses={cookingClasses}
                    onAddRecipe={handleAddRecipe}
                    onDeleteUser={(email) => { userService.deleteUser(email); setAllUsers(userService.getAllUsers()); }}
                    onGiveFreeTime={(email, months) => { userService.giveFreeTime(email, months); setAllUsers(userService.getAllUsers()); }}
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
                    videos={videos}
                    onAddVideoCategory={handleAddVideoCategory}
                    onUpdateVideoCategory={handleUpdateVideoCategory}
                    onDeleteVideoCategory={handleDeleteVideoCategory}
                    onAddVideo={handleAddVideo}
                    onUpdateVideo={handleUpdateVideo}
                    onDeleteVideo={handleDeleteVideo}
                />
            </div>
        );
    }
    
    const renderNavButton = (view: View, label: string, icon?: React.ReactNode) => (
        <button
            onClick={() => setCurrentView(view)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 flex items-center gap-2 ${currentView === view ? 'bg-primary text-white' : 'bg-white text-text-secondary hover:bg-gray-100'}`}
        >
            {icon} {label}
        </button>
    );

    return (
        <div className="bg-secondary min-h-screen text-text-primary">
            {selectedRecipe && (
                <RecipeModal
                    recipe={selectedRecipe}
                    onClose={handleCloseModal}
                    isSaved={savedRecipeTitles.includes(selectedRecipe.title)}
                    onToggleSave={() => handleToggleSave(selectedRecipe.title)}
                    onGenerateShoppingList={() => handleGenerateShoppingList(selectedRecipe)}
                    isGeneratingList={isShoppingListLoading && shoppingListModalRecipe?.title === selectedRecipe.title}
                    onStartCookMode={() => { setCookingRecipe(selectedRecipe); setSelectedRecipe(null); }}
                    onPlayVideo={(url) => setPlayingVideo({ ...selectedRecipe, videoUrl: url, id: 'recipe-video', thumbnailUrl: '', description: '' })}
                    onStartVariation={() => setVariationRecipe(selectedRecipe)}
                />
            )}
            {shoppingListModalRecipe && !isShoppingListLoading && (
                 <ShoppingListModal
                    shoppingList={shoppingList}
                    error={shoppingListError}
                    recipeTitle={shoppingListModalRecipe.title}
                    onClose={() => setShoppingListModalRecipe(null)}
                />
            )}
            {cookingRecipe && <CookMode recipe={cookingRecipe} onExit={() => setCookingRecipe(null)} />}
            {variationRecipe && (
                <VariationModal
                    recipe={variationRecipe}
                    onClose={() => { setVariationRecipe(null); setVariationError(null); }}
                    onGenerate={handleGenerateVariation}
                    isLoading={isGeneratingVariation}
                    error={variationError}
                />
            )}
            {playingVideo && <VideoPlayerModal video={playingVideo as Video} onClose={() => setPlayingVideo(null)} />}
            {selectedClass && <CookingClassDetail cookingClass={selectedClass} onBack={() => setSelectedClass(null)} onPlayLesson={(lesson) => setPlayingVideo(lesson)} />}
            {isUpgradeModalOpen && <UpgradeModal onClose={() => setIsUpgradeModalOpen(false)} />}
            {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />}
            {isCameraModalOpen && <CameraModal onClose={() => setIsCameraModalOpen(false)} onIngredientsScanned={handleIngredientsScanned} />}
            {isPrivacyPolicyVisible && <PrivacyPolicy onClose={() => setIsPrivacyPolicyVisible(false)} />}
            {isAboutUsVisible && <AboutUsModal onClose={() => setIsAboutUsVisible(false)} />}

            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex-1">
                        {/* This space can be used for a logo or can be left empty */}
                    </div>
                    <div className="flex-shrink-0">
                        {currentUser ? (
                            <UserMenu user={currentUser} onLogout={handleLogout} onShowDashboard={() => setIsDashboardVisible(true)} />
                        ) : (
                            <button
                                onClick={() => setIsLoginModalOpen(true)}
                                className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-focus transition-colors"
                            >
                                Login / Sign Up
                            </button>
                        )}
                    </div>
                </div>

                <Header />

                <main className="mt-8">
                    <nav className="mb-8 flex flex-wrap justify-center gap-2">
                        {renderNavButton('all', 'All Recipes')}
                        {renderNavButton('saved', 'My Cookbook', <HeartIcon isFilled={false} className="w-4 h-4" />)}
                        {renderNavButton('plans', 'Meal Plans', <CalendarDaysIcon className="w-4 h-4" />)}
                        {renderNavButton('videos', 'Video Tutorials', <FilmIcon className="w-4 h-4" />)}
                        {renderNavButton('classes', 'Cooking Classes', <MortarPestleIcon className="w-4 h-4" />)}
                        {renderNavButton('bartender', 'Bartender Helper', <CocktailIcon className="w-4 h-4" />)}
                        {renderNavButton('expert', 'Ask an Expert', <QuestionMarkCircleIcon className="w-4 h-4" />)}
                        {renderNavButton('shopping', 'Shopping List', <ShoppingCartIcon className="w-4 h-4" />)}
                    </nav>
                    
                    {currentView === 'all' || currentView === 'saved' ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-white rounded-lg shadow-sm border">
                                <div className="md:col-span-2">
                                    <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                                    <UrlInput
                                        recipeUrl={recipeUrl}
                                        setRecipeUrl={setRecipeUrl}
                                        onFetch={handleImportFromUrl}
                                        isLoading={isImporting}
                                    />
                                    <CameraInput onClick={() => setIsCameraModalOpen(true)} disabled={isImporting || isGenerating} />
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <button
                                    onClick={handleGenerateFromIngredients}
                                    disabled={isGenerating || ingredients.length === 0}
                                    className="px-8 py-3 bg-primary text-white font-bold text-lg rounded-lg shadow-md hover:bg-primary-focus disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                                >
                                    {isGenerating ? 'Finding Recipes...' : 'Find Recipes from Ingredients'}
                                </button>
                                {generationError && <p className="mt-2 text-red-500">{generationError}</p>}
                                {importError && <p className="mt-2 text-red-500">{importError}</p>}
                                {importSuccessMessage && <p className="mt-2 text-green-600">{importSuccessMessage}</p>}
                            </div>

                            <div className="relative flex py-4 items-center mb-8">
                                <div className="flex-grow border-t border-border-color"></div>
                                <span className="flex-shrink mx-4 text-sm font-semibold uppercase text-gray-400">OR</span>
                                <div className="flex-grow border-t border-border-color"></div>
                            </div>
                            
                            <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border">
                                <IdeaInput
                                    prompt={recipePrompt}
                                    setPrompt={setRecipePrompt}
                                    onGenerate={handleGenerateFromIdea}
                                    isLoading={isGeneratingFromIdea}
                                />
                                {promptError && <p className="mt-4 text-red-500 text-center">{promptError}</p>}
                            </div>
                            
                            {(isGenerating || isGeneratingFromIdea) && <Spinner />}

                            <div id="all-recipes-section">
                                {currentView === 'all' && <FavoriteRecipes recipes={topRatedRecipes} onSelectRecipe={handleSelectRecipe} savedRecipeTitles={savedRecipeTitles} onToggleSave={handleToggleSave}/>}
                                {currentView === 'all' && <PremiumContent isPremium={isPremium} onUpgrade={() => setIsUpgradeModalOpen(true)} recipes={newThisMonthRecipes} onSelectRecipe={handleSelectRecipe} savedRecipeTitles={savedRecipeTitles} onToggleSave={handleToggleSave} />}
                                
                                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                                    <h2 className="text-2xl font-bold">{currentView === 'saved' ? 'My Saved Recipes' : 'All Recipes'}</h2>
                                    {currentView === 'saved' && savedRecipes.length > 0 && (
                                        <CookbookButton elementIdToPrint="all-recipes-section" />
                                    )}
                                </div>
                                <div className="space-y-6 mb-8">
                                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                                    <TagFilter allTags={allTags} selectedTags={selectedTags} onTagClick={handleTagClick} />
                                </div>

                                {areRecipesLoading ? <Spinner /> : (
                                    filteredRecipes.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                            {filteredRecipes.slice(0, itemsToShow).map(recipe => (
                                                <RecipeCard
                                                    key={recipe.title}
                                                    recipe={recipe}
                                                    onClick={() => handleSelectRecipe(recipe)}
                                                    isSaved={savedRecipeTitles.includes(recipe.title)}
                                                    onToggleSave={() => handleToggleSave(recipe.title)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
                                            <p className="text-lg text-text-secondary">
                                                {currentView === 'saved' ? 'You haven\'t saved any recipes yet.' : 'No recipes match your search.'}
                                            </p>
                                        </div>
                                    )
                                )}

                                {itemsToShow < filteredRecipes.length && (
                                    <div className="mt-12 text-center">
                                        <button
                                            onClick={() => setItemsToShow(itemsToShow + ITEMS_PER_PAGE)}
                                            className="px-8 py-3 bg-white border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/10 transition-colors"
                                        >
                                            Load More
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : selectedPlan ? (
                        <MealPlanDetail 
                            plan={selectedPlan} 
                            recipes={allRecipes} 
                            onSelectRecipe={handleSelectRecipe}
                            onBack={() => setSelectedPlan(null)}
                            onGenerateList={() => handleGenerateShoppingList(selectedPlan)}
                            isGeneratingList={isShoppingListLoading && shoppingListModalRecipe?.title === selectedPlan.title}
                        />
                    ) : selectedClass ? (
                        <CookingClassDetail
                            cookingClass={selectedClass}
                            onBack={() => { setCurrentView('all'); setSelectedClass(null); }}
                            onPlayLesson={(lesson) => setPlayingVideo(lesson)}
                        />
                    ) : currentView === 'plans' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {mealPlans.map(plan => (
                                <MealPlanCard key={plan.title} plan={plan} onClick={() => setSelectedPlan(plan)} />
                            ))}
                        </div>
                    ) : currentView === 'videos' ? (
                        <div className="space-y-12">
                            {videos.map(category => (
                                <div key={category.id}>
                                    <h2 className="text-2xl font-bold mb-6">{category.title}</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {category.videos.map(video => (
                                            <VideoCard key={video.id} video={video} onClick={() => setPlayingVideo(video)} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : currentView === 'bartender' ? (
                        <BartenderHelper 
                            savedItemNames={savedRecipeTitles}
                            onToggleSave={handleToggleSave}
                        />
                    ) : currentView === 'classes' ? (
                        <AdvancedClasses
                            isPremium={isPremium}
                            onUpgrade={() => setIsUpgradeModalOpen(true)}
                            classes={cookingClasses}
                            onSelectClass={setSelectedClass}
                        />
                    ) : currentView === 'expert' ? (
                        <AskAnExpert
                            isPremium={isPremium}
                            onUpgrade={() => setIsUpgradeModalOpen(true)}
                            isSubmitted={isQuestionSubmitted}
                            onSubmitQuestion={() => setIsQuestionSubmitted(true)}
                            onAskAnother={() => setIsQuestionSubmitted(false)}
                        />
                    ) : currentView === 'shopping' ? (
                        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border">
                            <h2 className="text-3xl font-bold mb-6 text-center text-text-primary">My Shopping List</h2>
                            <div className="mb-6">
                                <ManualAddItem onAddItem={handleAddItemToList} isLoading={isAddingItem} />
                            </div>
                            {shoppingList.length > 0 ? (
                                <div className="space-y-6">
                                    {shoppingList.map(({ category, items }) => (
                                        <div key={category}>
                                            <h3 className="text-lg font-semibold text-primary mb-2 border-b-2 border-primary/20 pb-1">
                                                {category}
                                            </h3>
                                            <ul className="space-y-2">
                                                {items.map((item, index) => (
                                                    <li key={index} className="flex items-center justify-between group">
                                                        <div className="flex items-center">
                                                            <input
                                                                id={`shop-item-${category}-${index}`}
                                                                type="checkbox"
                                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-3"
                                                            />
                                                            <label htmlFor={`shop-item-${category}-${index}`} className="text-text-secondary group-hover:line-through">{item}</label>
                                                        </div>
                                                        <button onClick={() => handleDeleteItem(category, item)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <TrashIcon className="w-4 h-4 text-red-500" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                    <div className="pt-6 border-t mt-6 flex justify-end">
                                        <button
                                            onClick={handleClearShoppingList}
                                            className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                                        >
                                            <TrashIcon className="w-5 h-5"/>
                                            Clear List
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-text-secondary border-2 border-dashed rounded-lg">
                                    <ShoppingCartIcon className="w-12 h-12 mx-auto text-gray-300 mb-2"/>
                                    <p>Your shopping list is empty.</p>
                                    <p className="text-sm">Add items from recipes or manually above.</p>
                                </div>
                            )}
                        </div>
                    ) : null}

                    <NewsletterSignup />

                </main>
            </div>
            <Footer onShowPrivacyPolicy={() => setIsPrivacyPolicyVisible(false)} onShowAboutUs={() => setIsAboutUsVisible(false)} />
        </div>
    );
};

export default App;