import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, ShoppingList, DrinkRecipe } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const singleRecipeSchemaProperties = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "The title of the recipe."
        },
        description: {
            type: Type.STRING,
            description: "A short, enticing description of the dish."
        },
        tags: {
            type: Type.ARRAY,
            description: "A list of relevant tags for the recipe (e.g., 'Vegan', 'Quick & Easy', 'Pasta').",
            items: {
                type: Type.STRING
            }
        },
        ingredients: {
            type: Type.ARRAY,
            description: "A list of ingredients. For each ingredient, specify if it was from the user's provided list.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Ingredient name." },
                    quantity: { type: Type.STRING, description: "e.g., '100g' or '250ml'. Must be in metric units." },
                    isAvailable: { type: Type.BOOLEAN, description: "True if this ingredient was in the user's provided list." }
                },
                required: ["name", "quantity", "isAvailable"]
            }
        },
        instructions: {
            type: Type.ARRAY,
            description: "Step-by-step cooking instructions.",
            items: {
                type: Type.STRING
            }
        },
        prepTime: { type: Type.STRING, description: "e.g., '15 minutes'" },
        cookTime: { type: Type.STRING, description: "e.g., '30 minutes'" },
        servings: { type: Type.STRING, description: "e.g., '4 servings'" },
        nutrition: {
            type: Type.OBJECT,
            description: "Estimated nutritional information per serving.",
            properties: {
                calories: { type: Type.STRING, description: "e.g., '450 kcal'" },
                protein: { type: Type.STRING, description: "e.g., '30g'" },
                carbs: { type: Type.STRING, description: "e.g., '50g'" },
                fat: { type: Type.STRING, description: "e.g., '15g'" }
            },
            required: ["calories", "protein", "carbs", "fat"]
        },
        imagePrompt: {
            type: Type.STRING,
            description: "A detailed, descriptive prompt for a text-to-image model to generate a photorealistic and appetizing image of the final dish."
        },
    },
    required: ["title", "description", "tags", "ingredients", "instructions", "prepTime", "cookTime", "servings", "nutrition", "imagePrompt"]
};

const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        recipes: {
            type: Type.ARRAY,
            description: "A list of 3-5 creative recipes.",
            items: singleRecipeSchemaProperties
        }
    },
    required: ["recipes"]
};

const singleRecipeSchema = {
    type: Type.OBJECT,
    ...singleRecipeSchemaProperties
}


export const generateRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
    const prompt = `
      You are a creative chef and nutritionist. Based on the ingredients provided, generate 3-5 diverse and delicious recipes. 
      Prioritize using the available ingredients, but you can include a few common pantry staples (like salt, pepper, oil, water) if necessary.
      All ingredient quantities must be in metric units (e.g., grams, ml, liters). Do not use imperial units like cups, oz, or tbsp.
      For each ingredient in the recipes, clearly indicate if it was part of the user's provided list.
      For each recipe, provide a title, a short description, and a list of relevant tags (e.g., 'Vegan', 'Quick & Easy').
      For each recipe, provide an estimated nutrition guide per serving, including calories, protein, carbs, and fat.
      For each recipe, also create a detailed, descriptive prompt that a text-to-image model could use to generate a photorealistic and appetizing photo of the final dish. The prompt should describe the food, the plating, and the background.
      
      Available ingredients: ${ingredients.join(', ')}.

      Please return the recipes in a valid JSON format according to the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recipeSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        if (parsedJson.recipes && Array.isArray(parsedJson.recipes)) {
            const richRecipes: any[] = parsedJson.recipes;

            const recipes: Recipe[] = await Promise.all(
                richRecipes.map(async (recipe) => {
                    const imageUrl = await generateImage(recipe.imagePrompt);
                    return {
                        title: recipe.title,
                        description: recipe.description,
                        imageUrl: imageUrl,
                        ingredients: recipe.ingredients.map((ing: { quantity: string; name: string; }) => `${ing.quantity} ${ing.name}`.trim()).filter(Boolean),
                        instructions: recipe.instructions,
                        tags: recipe.tags,
                        servings: recipe.servings,
                        prepTime: recipe.prepTime,
                        cookTime: recipe.cookTime,
// FIX: Add missing 'status' property to conform to the Recipe type.
                        status: 'active',
                        nutrition: recipe.nutrition,
                    };
                })
            );
            return recipes;
        } else {
            throw new Error("Invalid response format from API. Expected a 'recipes' array.");
        }
    } catch (error) {
        console.error("Error generating recipes:", error);
        throw new Error("Failed to generate recipes. The model might be unable to create recipes with the provided ingredients, or there was a network issue.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const enhancedPrompt = `Photorealistic, appetizing food photography of ${prompt}, studio lighting, high detail, shallow depth of field.`;
        
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: enhancedPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            console.warn("No image was generated, returning placeholder.");
            return `https://via.placeholder.com/800x450.png?text=Image+Not+Available`;
        }
    } catch (error) {
        console.error("Error generating image:", error);
        return `https://via.placeholder.com/800x450.png?text=Image+Generation+Failed`;
    }
};

export const extractIngredientsFromUrl = async (url: string): Promise<string[]> => {
    const prompt = `
        You are an expert recipe parsing assistant. Your task is to extract the list of ingredients from the provided URL.
        Analyze the content of the webpage and identify the ingredients section.
        Return only the list of ingredients. Do not include quantities, just the name of each ingredient.
        For example, if you see "2 cups of all-purpose flour", you should return "all-purpose flour".

        URL: ${url}

        Please return the ingredients in a valid JSON format according to the provided schema.
    `;

    const urlSchema = {
        type: Type.OBJECT,
        properties: {
            ingredients: {
                type: Type.ARRAY,
                description: "A list of ingredient names extracted from the URL.",
                items: {
                    type: Type.STRING
                }
            }
        },
        required: ["ingredients"]
    };

    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: urlSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        if (parsedJson.ingredients && Array.isArray(parsedJson.ingredients)) {
            return parsedJson.ingredients as string[];
        } else {
            throw new Error("Invalid response format from API. Expected an 'ingredients' array.");
        }

    } catch (error) {
        console.error("Error extracting ingredients from URL:", error);
        throw new Error("Failed to extract ingredients from the URL. Please check if the URL is a valid recipe page.");
    }
};

export const importRecipeFromUrl = async (url: string): Promise<Recipe> => {
    const prompt = `
        You are an expert recipe parsing assistant. Your task is to extract a full recipe from the content of the provided URL.
        You must extract the following information:
        1.  **title**: The name of the recipe.
        2.  **description**: A short, enticing description of the dish.
        3.  **tags**: A list of relevant tags (e.g., 'Vegan', 'Dinner', 'Italian').
        4.  **ingredients**: A list of all ingredients. For each ingredient, specify the name, quantity, and ensure the quantity is in METRIC units (grams, ml, etc.). Mark 'isAvailable' as false since we don't know the user's pantry.
        5.  **instructions**: The step-by-step cooking instructions.
        6.  **prepTime**, **cookTime**, **servings**: Extract these if available.
        7.  **nutrition**: Extract nutritional info (calories, protein, carbs, fat) if available.
        8.  **imagePrompt**: Based on the title and description, create a detailed, descriptive prompt for a text-to-image model to generate a photorealistic and appetizing image of the final dish.

        URL: ${url}

        Please return the result as a single, valid JSON object that conforms to the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: singleRecipeSchema as any,
            },
        });

        const jsonText = response.text.trim();
        const importedData = JSON.parse(jsonText);

        const imageUrl = await generateImage(importedData.imagePrompt);

        return {
            title: importedData.title,
            description: importedData.description,
            imageUrl: imageUrl,
            ingredients: importedData.ingredients.map((ing: { quantity: string; name: string; }) => `${ing.quantity} ${ing.name}`.trim()).filter(Boolean),
            instructions: importedData.instructions,
            tags: importedData.tags,
            servings: importedData.servings,
            prepTime: importedData.prepTime,
            cookTime: importedData.cookTime,
// FIX: Add missing 'status' property to conform to the Recipe type.
            status: 'active',
            nutrition: importedData.nutrition,
        };
    } catch (error) {
        console.error("Error importing recipe from URL:", error);
        throw new Error("Failed to import the recipe from the URL. Please ensure it is a valid recipe page.");
    }
};

export const identifyIngredientsFromImage = async (base64ImageData: string): Promise<string[]> => {
    const prompt = "Identify all the food ingredients in this image. Only return the names of the ingredients, not quantities. For example, 'tomato', 'lettuce', 'cheese'.";

    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64ImageData,
        },
    };

    const ingredientsSchema = {
        type: Type.OBJECT,
        properties: {
            ingredients: {
                type: Type.ARRAY,
                description: "A list of food ingredient names identified from the image.",
                items: { type: Type.STRING }
            }
        },
        required: ["ingredients"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: ingredientsSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        if (parsedJson.ingredients && Array.isArray(parsedJson.ingredients)) {
            return parsedJson.ingredients as string[];
        } else {
            throw new Error("Invalid response format from API. Expected an 'ingredients' array.");
        }

    } catch (error) {
        console.error("Error identifying ingredients from image:", error);
        throw new Error("Failed to identify ingredients from the image. Please try again with a clearer picture.");
    }
};

export const generateNewImagePrompt = async (recipeTitle: string, recipeDescription: string): Promise<string> => {
    const prompt = `
        The text-to-image model failed to generate an image for a recipe with the initial prompt. 
        Your task is to create a new, highly detailed, and creative prompt for the text-to-image model.
        The prompt should describe a photorealistic and appetizing image of the final dish. 
        Focus on the food's texture, plating, lighting, and background to ensure a successful image generation.
        Do not just repeat the recipe title.

        Recipe Title: ${recipeTitle}
        Recipe Description: ${recipeDescription}

        Generate a new prompt. Return it as a JSON object with a single key "newPrompt".
    `;

    const newPromptSchema = {
        type: Type.OBJECT,
        properties: {
            newPrompt: {
                type: Type.STRING,
                description: "A new, detailed, descriptive prompt for a text-to-image model."
            }
        },
        required: ["newPrompt"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: newPromptSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        if (parsedJson.newPrompt && typeof parsedJson.newPrompt === 'string') {
            return parsedJson.newPrompt;
        } else {
            throw new Error("Invalid response format for new prompt generation.");
        }
    } catch (error) {
        console.error("Error generating new image prompt:", error);
        // Fallback to a simple prompt if generation fails
        return `A delicious plate of ${recipeTitle}, professionally photographed.`;
    }
};

export const fixRecipeImage = async (recipe: Recipe): Promise<string> => {
    try {
        console.log(`Fixing image for: ${recipe.title}`);
        const newPrompt = await generateNewImagePrompt(recipe.title, recipe.description);
        console.log(`Generated new prompt: ${newPrompt}`);
        const newImageUrl = await generateImage(newPrompt);
        console.log(`Generated new image URL for ${recipe.title}`);
        return newImageUrl;
    } catch (error) {
        console.error(`Failed to fix image for ${recipe.title}:`, error);
        throw new Error("Failed to generate a new image for the recipe.");
    }
};

export const generateRecipeFromPrompt = async (promptText: string): Promise<Recipe> => {
    const prompt = `
        You are an expert chef and recipe creator. A user wants a new recipe based on their description.
        Your task is to generate a single, complete recipe based on the user's request.
        You must generate the following information:
        1.  **title**: A creative and fitting name for the recipe.
        2.  **description**: A short, enticing description of the dish.
        3.  **tags**: A list of relevant tags (e.g., 'Vegan', 'Dinner', 'Italian').
        4.  **ingredients**: A list of all ingredients. For each ingredient, specify the name and quantity in METRIC units (grams, ml, etc.). Mark 'isAvailable' as false.
        5.  **instructions**: The step-by-step cooking instructions.
        6.  **prepTime**, **cookTime**, **servings**: Provide realistic estimates.
        7.  **nutrition**: Provide estimated nutritional info (calories, protein, carbs, fat).
        8.  **imagePrompt**: Create a detailed, descriptive prompt for a text-to-image model to generate a photorealistic and appetizing image of the final dish.

        User's Recipe Request: "${promptText}"

        Please return the result as a single, valid JSON object that conforms to the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: singleRecipeSchema as any,
            },
        });

        const jsonText = response.text.trim();
        const generatedData = JSON.parse(jsonText);

        const imageUrl = await generateImage(generatedData.imagePrompt);
        
        return {
            title: generatedData.title,
            description: generatedData.description,
            imageUrl: imageUrl,
            ingredients: generatedData.ingredients.map((ing: { quantity: string; name: string; }) => `${ing.quantity} ${ing.name}`.trim()).filter(Boolean),
            instructions: generatedData.instructions,
            tags: generatedData.tags,
            servings: generatedData.servings,
            prepTime: generatedData.prepTime,
            cookTime: generatedData.cookTime,
            status: 'active',
            nutrition: generatedData.nutrition,
        };
    } catch (error) {
        console.error("Error generating recipe from prompt:", error);
        throw new Error("Failed to generate the recipe from the prompt. The model may have been unable to fulfill the request.");
    }
};

export const generateRecipeVariation = async (originalRecipe: Recipe, variationRequest: string, availableIngredients: string[]): Promise<Recipe> => {
    const prompt = `
        You are a creative chef. A user wants a variation of an existing recipe.
        Your task is to modify the original recipe based on the user's request.
        Generate a completely new version of the recipe that incorporates the requested changes. 
        You must update the recipe title, description, tags, ingredients, instructions, and nutrition info.
        For the ingredients, you must still mark which ones are available from the user's original list.
        Ensure the new, modified recipe uses metric units for all ingredients (e.g., grams, ml).
        Create a new, detailed image prompt for the new version of the dish.

        Original Recipe:
        - Title: ${originalRecipe.title}
        - Description: ${originalRecipe.description}
        - Tags: ${originalRecipe.tags.join(', ')}
        - Ingredients: ${originalRecipe.ingredients.join(', ')}
        - Instructions: ${originalRecipe.instructions.join(' ')}

        User's Variation Request: "${variationRequest}"

        List of available ingredients provided by the user: ${availableIngredients.join(', ')}

        Please return the new, modified recipe as a single JSON object that conforms to the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: singleRecipeSchema as any,
            },
        });

        const jsonText = response.text.trim();
        const newRecipe = JSON.parse(jsonText);
        
        const imageUrl = await generateImage(newRecipe.imagePrompt);

        return {
            title: newRecipe.title,
            description: newRecipe.description,
            imageUrl: imageUrl,
            ingredients: newRecipe.ingredients.map((ing: { quantity: string; name: string; }) => `${ing.quantity} ${ing.name}`.trim()).filter(Boolean),
            instructions: newRecipe.instructions,
            tags: newRecipe.tags,
            servings: newRecipe.servings,
            prepTime: newRecipe.prepTime,
            cookTime: newRecipe.cookTime,
// FIX: Add missing 'status' property to conform to the Recipe type.
            status: 'active',
            nutrition: newRecipe.nutrition,
        };

    } catch (error) {
        console.error("Error generating recipe variation:", error);
        throw new Error("Failed to generate a variation for the recipe. The model may have been unable to fulfill the request.");
    }
};

export const generateShoppingList = async (ingredients: string[]): Promise<ShoppingList> => {
    const prompt = `
        You are an expert shopping list assistant. Your task is to take a list of recipe ingredients and create a clean, categorized shopping list.
        1. Analyze the list of ingredients.
        2. Combine quantities for any identical ingredients. For example, if "100g flour" and "25g flour" appear, combine them into "125g flour". If units are different, like "1 cup chicken broth" and "250ml chicken broth", combine them into a single metric unit like "500ml chicken broth", assuming 1 cup is approx 250ml.
        3. Group the combined ingredients into logical grocery store categories (e.g., "Produce", "Meat & Poultry", "Dairy & Eggs", "Pantry", "Bakery", "Spices & Seasonings").
        4. Do not include common items like "water", "salt", or "pepper" unless a specific, non-standard quantity or type is mentioned (e.g., 'coarse sea salt').
        5. Return the result as a valid JSON object according to the provided schema.

        Ingredient list:
        ${ingredients.join('\n')}
    `;

    const shoppingListSchema = {
        type: Type.OBJECT,
        properties: {
            shoppingList: {
                type: Type.ARRAY,
                description: "A categorized shopping list. Each element in the array is an object with a category and a list of items.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        category: {
                            type: Type.STRING,
                            description: "The name of the grocery store category (e.g., 'Produce', 'Dairy & Eggs')."
                        },
                        items: {
                            type: Type.ARRAY,
                            description: "The list of ingredients for this category, with combined quantities.",
                            items: {
                                type: Type.STRING
                            }
                        }
                    },
                    required: ["category", "items"]
                }
            }
        },
        required: ["shoppingList"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: shoppingListSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        if (parsedJson.shoppingList && Array.isArray(parsedJson.shoppingList)) {
            return parsedJson.shoppingList as ShoppingList;
        } else {
            throw new Error("Invalid response format from API. Expected a 'shoppingList' array.");
        }
    } catch (error) {
        console.error("Error generating shopping list:", error);
        throw new Error("Failed to generate a shopping list. The model may have been unable to process the ingredients.");
    }
};

const drinkRecipeSchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: "The name of the cocktail."
        },
        description: {
            type: Type.STRING,
            description: "A short, enticing description of the drink."
        },
        glassware: {
            type: Type.STRING,
            description: "The recommended type of glass for serving the drink (e.g., 'Coupe glass', 'Highball glass')."
        },
        ingredients: {
            type: Type.ARRAY,
            description: "A list of ingredients with quantities. Quantities should be in metric units (ml) but can also be 'dashes' or 'parts' where appropriate.",
            items: {
                type: Type.STRING,
                description: "e.g., '60ml Gin' or '2 dashes Angostura bitters'"
            }
        },
        instructions: {
            type: Type.ARRAY,
            description: "Step-by-step instructions for making the drink.",
            items: {
                type: Type.STRING
            }
        },
        garnish: {
            type: Type.STRING,
            description: "The suggested garnish for the drink (e.g., 'Lemon twist', 'Olive')."
        },
        imagePrompt: {
            type: Type.STRING,
            description: "A detailed, descriptive prompt for a text-to-image model to generate a photorealistic and appealing image of the final cocktail. Describe the drink, the glass, the garnish, and the background."
        },
    },
    required: ["name", "description", "glassware", "ingredients", "instructions", "garnish", "imagePrompt"]
};

export const generateDrinkRecipe = async (drinkPrompt: string): Promise<DrinkRecipe> => {
    const prompt = `
      You are an expert mixologist and bartender. A user wants to make a drink. Based on their request, create a unique and delicious cocktail recipe.
      Provide a creative name for the drink, a short description, the proper glassware, all necessary ingredients with metric quantities (ml), step-by-step instructions, and a suitable garnish.
      Also, create a detailed, descriptive prompt for a text-to-image model to generate a photorealistic and appealing photo of the final cocktail. The image prompt should describe the drink, the glass, the garnish, the lighting, and the background setting (e.g., a cozy bar, a bright patio).

      User's request: "${drinkPrompt}"

      Please return the cocktail recipe in a valid JSON format according to the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: drinkRecipeSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        const imageUrl = await generateImage(parsedJson.imagePrompt);

        return {
            name: parsedJson.name,
            description: parsedJson.description,
            imageUrl: imageUrl,
            glassware: parsedJson.glassware,
            ingredients: parsedJson.ingredients,
            instructions: parsedJson.instructions,
            garnish: parsedJson.garnish,
        };

    } catch (error) {
        console.error("Error generating drink recipe:", error);
        throw new Error("Failed to generate a drink recipe. The model might have been unable to fulfill the request, or there was a network issue.");
    }
};

export const categorizeShoppingListItem = async (itemName: string): Promise<string> => {
    const prompt = `
        You are a shopping list assistant. Your task is to categorize a single grocery item into a standard grocery store category.
        The categories should be general, like "Produce", "Meat & Poultry", "Dairy & Eggs", "Pantry", "Bakery", "Spices & Seasonings", "Beverages", "Frozen Foods", "Household Goods", "Uncategorized".

        Item to categorize: "${itemName}"

        Please return the category as a single JSON object with one key, "category".
    `;

    const categorySchema = {
        type: Type.OBJECT,
        properties: {
            category: {
                type: Type.STRING,
                description: "The grocery store category for the item."
            }
        },
        required: ["category"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: categorySchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        if (parsedJson.category && typeof parsedJson.category === 'string') {
            return parsedJson.category;
        } else {
            throw new Error("Invalid response format from API. Expected a 'category' string.");
        }
    } catch (error) {
        console.error("Error categorizing shopping list item:", error);
        return "Uncategorized"; // Fallback category
    }
};
