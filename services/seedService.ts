import { getSupabaseClient } from './supabaseClient';

// Import all initial data
import { recipes } from '../data/recipes';
import { newRecipes } from '../data/newRecipes';
import { affiliateProducts } from '../data/affiliateProducts';
import { standardCocktails } from '../data/cocktails';
import { aboutUsData } from '../data/aboutUs';
import { mealPlans } from '../data/mealPlans';
import { videos } from '../data/videos';
import { cookingClasses } from '../data/cookingClasses';
import { initialExpertQuestions } from '../data/expertQuestions';

const SEED_FLAG_KEY = 'database_seeded_v2';

export const seedDatabaseIfEmpty = async (): Promise<void> => {
    // 1. Check if seeding has already been done
    if (localStorage.getItem(SEED_FLAG_KEY)) {
        return;
    }
    
    console.log("Checking if database needs seeding...");

    const supabase = getSupabaseClient();

    try {
        // 2. Check if the 'recipes' table is empty
        const { error, count } = await supabase
            .from('recipes')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error("Error checking recipes table:", error.message);
            return; // Don't proceed if we can't check the table
        }

        if (count !== null && count > 0) {
            console.log("Database already contains data. Skipping seed.");
            localStorage.setItem(SEED_FLAG_KEY, 'true');
            return;
        }

        // 3. If empty, perform the seeding
        console.log("Database is empty. Seeding initial data...");

        // Seed Recipes
        const recipesForDb = recipes.map(({ cookTime, winePairing, ...rest }) => ({ ...rest, cook_time: cookTime, wine_pairing: winePairing }));
        const { error: recipesError } = await supabase.from('recipes').insert(recipesForDb);
        if (recipesError) throw new Error(`Seeding recipes failed: ${recipesError.message}`);
        console.log(`Seeded ${recipes.length} recipes.`);

        // Seed New Recipes
        const newRecipesForDb = newRecipes.map(({ cookTime, winePairing, ...rest }) => ({ ...rest, cook_time: cookTime, wine_pairing: winePairing }));
        const { error: newRecipesError } = await supabase.from('new_recipes').insert(newRecipesForDb);
        if (newRecipesError) throw new Error(`Seeding new_recipes failed: ${newRecipesError.message}`);
        console.log(`Seeded ${newRecipes.length} new recipes.`);

        // Seed Products
        const productsForDb = affiliateProducts.map(({ imageUrl, affiliateUrl, ...rest }) => ({ ...rest, image_url: imageUrl, affiliate_url: affiliateUrl }));
        const { error: productsError } = await supabase.from('products').insert(productsForDb);
        if (productsError) throw new Error(`Seeding products failed: ${productsError.message}`);
        console.log(`Seeded ${affiliateProducts.length} products.`);
        
        // Seed Standard Cocktails
        const cocktailsForDb = standardCocktails.map(({ imagePrompt, ...rest }) => ({ ...rest, image_prompt: imagePrompt }));
        const { error: cocktailsError } = await supabase.from('standard_cocktails').insert(cocktailsForDb);
        if (cocktailsError) throw new Error(`Seeding standard_cocktails failed: ${cocktailsError.message}`);
        console.log(`Seeded ${standardCocktails.length} standard cocktails.`);

        // Seed About Us
        const { companyName, missionStatement, companyHistory, contactEmail, address } = aboutUsData;
        const aboutUsForDb = { id: 1, company_name: companyName, mission_statement: missionStatement, company_history: companyHistory, contact_email: contactEmail, address };
        const { error: aboutUsError } = await supabase.from('about_us').upsert(aboutUsForDb);
        if (aboutUsError) throw new Error(`Seeding about_us failed: ${aboutUsError.message}`);
        console.log("Seeded about us info.");
        
        // Seed Meal Plans
        const { error: mealPlansError } = await supabase.from('meal_plans').insert(mealPlans.map(mp => ({ id: mp.id, title: mp.title, description: mp.description, recipe_ids: mp.recipeIds })));
        if (mealPlansError) throw new Error(`Seeding meal_plans failed: ${mealPlansError.message}`);
        console.log(`Seeded ${mealPlans.length} meal plans.`);

        // Seed Videos
        const { error: videosError } = await supabase.from('videos').insert(videos.map(v => ({ id: v.id, category: v.category, title: v.title, description: v.description, video_url: v.videoUrl, thumbnail_url: v.thumbnailUrl })));
        if (videosError) throw new Error(`Seeding videos failed: ${videosError.message}`);
        console.log(`Seeded ${videos.length} videos.`);

        // Seed Cooking Classes
        const { error: classesError } = await supabase.from('cooking_classes').insert(cookingClasses.map(c => ({ id: c.id, title: c.title, description: c.description, chef: c.chef, thumbnail_url: c.thumbnailUrl, steps: c.steps, what_you_will_learn: c.whatYouWillLearn, techniques_covered: c.techniquesCovered, pro_tips: c.proTips })));
        if (classesError) throw new Error(`Seeding cooking_classes failed: ${classesError.message}`);
        console.log(`Seeded ${cookingClasses.length} cooking classes.`);

        // Seed Expert Questions
        const { error: questionsError } = await supabase.from('expert_questions').insert(initialExpertQuestions.map(q => ({ id: q.id, question: q.question, topic: q.topic, status: q.status, submitted_date: q.submittedDate, answer: q.answer })));
        if (questionsError) throw new Error(`Seeding expert_questions failed: ${questionsError.message}`);
        console.log(`Seeded ${initialExpertQuestions.length} expert questions.`);


        // 4. Set the flag to prevent running again
        localStorage.setItem(SEED_FLAG_KEY, 'true');
        console.log("Database seeding complete.");

    } catch (e) {
        console.error("A critical error occurred during database seeding:", e);
        // Don't set the flag so it can be retried
    }
};
