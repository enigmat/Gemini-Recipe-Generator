import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Recipe, CocktailRecipe, RecipeVariation, ProductAnalysis, Product, GeneratedMealPlan, DishInfo, Chef } from "../types";

const chefProfileSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        bio: { type: Type.STRING, description: "A short, 2-3 sentence biography of the fictional chef." },
        signatureDish: { type: Type.STRING },
        imagePrompt: { type: Type.STRING, description: "A descriptive prompt for a photorealistic portrait of the chef. e.g., 'Headshot of a friendly-looking Italian chef with a mustache, in a clean white uniform.'" }
    },
    required: ['name', 'bio', 'signatureDish', 'imagePrompt']
};

const recipeSchemaProperties = {
    title: { type: Type.STRING, description: "The final, polished title of the recipe." },
    description: { type: Type.STRING, description: "A brief, enticing description of the dish." },
    cookTime: { type: Type.STRING, description: "e.g., '45 minutes'" },
    servings: { type: Type.STRING, description: "e.g., '4 servings' or '4-6'" },
    calories: { type: Type.STRING, description: "e.g., 'Approx. 550 kcal'" },
    ingredients: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                metric: {
                    type: Type.OBJECT,
                    properties: { quantity: { type: Type.STRING }, unit: { type: Type.STRING } },
                    required: ['quantity', 'unit']
                },
                us: {
                    type: Type.OBJECT,
                    properties: { quantity: { type: Type.STRING }, unit: { type: Type.STRING } },
                    required: ['quantity', 'unit']
                }
            },
            required: ['name', 'metric', 'us']
        }
    },
    instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    winePairing: {
        type: Type.OBJECT,
        properties: { suggestion: { type: Type.STRING }, description: { type: Type.STRING } },
    },
    chef: chefProfileSchema
};

const recipeRequiredFields = ['title', 'description', 'cookTime', 'servings', 'ingredients', 'instructions', 'tags', 'calories', 'chef'];


export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const descriptivePrompt = `A high-quality, professional food photograph of ${prompt}, beautifully plated and ready to eat. Bright, natural lighting.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: descriptivePrompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType || 'image/jpeg';
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
        
        throw new Error("No image data found in the AI response.");

    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        throw new Error("Failed to generate image. Please check the prompt or API configuration.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType || 'image/jpeg';
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
        
        throw new Error("No image data found in the AI response.");

    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        throw new Error("Failed to generate image. Please check the prompt or API configuration.");
    }
};


export const generateRecipeDetailsFromTitle = async (title: string): Promise<Omit<Recipe, 'id' | 'image'>> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Generate a complete, high-quality recipe for "${title}". The recipe must be well-written, easy to follow, and appealing. Provide a short, enticing description, a realistic cook time, and the number of servings. The ingredients list must be detailed with both metric and US units. The instructions should be clear, step-by-step. Include at least 3 relevant tags. Also, provide a suitable wine pairing suggestion with a specific wine name and a short explanation for the pairing, and an estimated calorie count per serving. Finally, create a profile for a fictional famous chef known for this type of cuisine, including their name, a short bio, their signature dish, and a prompt for generating a photorealistic portrait of them.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: recipeSchemaProperties,
                    required: recipeRequiredFields
                }
            }
        });
        
        const jsonText = response.text;
        const recipeData = JSON.parse(jsonText);

        return recipeData;

    } catch (error) {
        console.error("Error generating recipe details with Gemini:", error);
        throw new Error("Failed to generate recipe details. Please try again.");
    }
};

export const generateBulkRecipes = async (count: number): Promise<(Omit<Recipe, 'id' | 'image' | 'chef'> & { chef: Omit<Chef, 'image'> & { imagePrompt: string } })[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const theme = `A collection of popular, crowd-pleasing, and visually appealing dinner recipes from various cuisines, each associated with a unique, fictional, famous chef.`;
        const prompt = `Generate a list of ${count} unique recipe titles based on the theme: "${theme}". The titles should be distinct and not variations of each other.`;
        
        // Step 1: Generate titles
        const titlesResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        titles: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['titles']
                }
            }
        });

        const { titles } = JSON.parse(titlesResponse.text);

        if (!titles || !Array.isArray(titles) || titles.length === 0) {
            throw new Error("AI failed to generate recipe titles.");
        }

        // Step 2: Generate details for each title
        const recipePromises = titles.slice(0, count).map(title => generateRecipeDetailsFromTitle(title as any));
        const recipes = await Promise.all(recipePromises);

        return recipes as any;

    } catch (error) {
        console.error("Error generating bulk recipes with Gemini:", error);
        throw new Error("Failed to generate the recipe collection. Please try again.");
    }
};

export const generateRecipeOfTheDay = async (): Promise<Omit<Recipe, 'id' | 'image'>> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        const prompt = `Generate a popular, seasonally appropriate recipe that would be great for today, ${today}. The recipe should be appealing to a wide audience and not overly complex. Provide a complete, high-quality recipe. The recipe must be well-written, easy to follow, and appealing. Provide a short, enticing description, a realistic cook time, and the number of servings. The ingredients list must be detailed with both metric and US units. The instructions should be clear, step-by-step. Include at least 3 relevant tags. Also, provide a suitable wine pairing suggestion with a specific wine name and a short explanation for the pairing, and an estimated calorie count per serving. Finally, create a profile for a fictional famous chef known for this type of cuisine, including their name, a short bio, their signature dish, and a prompt for generating a photorealistic portrait of them.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: recipeSchemaProperties,
                    required: recipeRequiredFields,
                }
            }
        });
        
        const jsonText = response.text;
        const recipeData = JSON.parse(jsonText);

        return recipeData;

    } catch (error) {
        console.error("Error generating Recipe of the Day with Gemini:", error);
        throw new Error("Failed to generate the Recipe of the Day. Please try again later.");
    }
};

export const generateRecipeFromUrl = async (url: string): Promise<Omit<Recipe, 'id' | 'image'>> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Analyze the following URL and generate a complete, high-quality recipe based on its title and content theme. The URL is: "${url}". The recipe must be well-written, easy to follow, and appealing. Provide a short, enticing description, a realistic cook time, and the number of servings. The ingredients list must be detailed with both metric and US units. The instructions should be clear, step-by-step. Include at least 3 relevant tags. Also, provide a suitable wine pairing suggestion with a specific wine name and a short explanation for the pairing, and an estimated calorie count per serving. Finally, create a profile for a fictional famous chef known for this type of cuisine, including their name, a short bio, their signatureDish, and a prompt for generating a photorealistic portrait of them.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: recipeSchemaProperties,
                    required: recipeRequiredFields,
                }
            }
        });
        
        const jsonText = response.text;
        const recipeData = JSON.parse(jsonText);

        return recipeData;

    } catch (error) {
        console.error("Error generating recipe from URL with Gemini:", error);
        throw new Error("Failed to extract recipe from URL. The AI could not understand this link. Please try a different one.");
    }
};

export const generateCocktailRecipe = async (prompt: string): Promise<CocktailRecipe> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const fullPrompt = `Act as an expert mixologist. A user wants a cocktail recipe. Their request is: "${prompt}". Generate a suitable cocktail recipe. Provide a unique, appealing title, a short description, details on glassware and garnish, a list of ingredients with measurements, and step-by-step instructions. Also provide a short, descriptive prompt that can be used to generate a realistic, high-quality photograph of the final drink.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        imagePrompt: { type: Type.STRING, description: "A short, descriptive prompt for an AI image generator to create a realistic photo of the cocktail." },
                        glassware: { type: Type.STRING },
                        garnish: { type: Type.STRING },
                        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                        instructions: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['title', 'description', 'imagePrompt', 'glassware', 'garnish', 'ingredients', 'instructions']
                }
            }
        });

        const jsonText = response.text;
        const recipeData = JSON.parse(jsonText);

        return recipeData;

    } catch (error) {
        console.error("Error generating cocktail recipe with Gemini:", error);
        throw new Error("Failed to generate a drink recipe. The AI might be stumped! Please try a different description.");
    }
};

export const generateRecipeVariations = async (recipe: Recipe): Promise<RecipeVariation[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Given the following recipe for "${recipe.title}", generate 3 creative variations. For each variation, provide a unique title and a short description of the key changes. For example, "Spicy Version", "Kid-Friendly Option", or "Vegan Alternative". Keep the descriptions concise and focused on the variation. The original recipe is: "${recipe.description}".`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        variations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING }
                                },
                                required: ['title', 'description']
                            }
                        }
                    },
                    required: ['variations']
                }
            }
        });
        
        const jsonText = response.text;
        const result = JSON.parse(jsonText);

        if (!result.variations || !Array.isArray(result.variations)) {
            throw new Error("Invalid response format from AI.");
        }

        return result.variations;

    } catch (error) {
        console.error("Error generating recipe variations with Gemini:", error);
        throw new Error("Failed to generate recipe variations. The AI might be busy! Please try again in a moment.");
    }
};

export const generateNewsletterMessage = async (subject: string, recipeTitles: string[]): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Act as a newsletter editor for a recipe website. The newsletter subject is "${subject}". The featured recipes are: ${recipeTitles.join(', ')}. Write a short, engaging, and friendly message for the newsletter body. Encourage readers to check out the new recipes. Keep it concise, around 2-3 sentences.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        const messageText = response.text;
        if (!messageText) {
            throw new Error("AI failed to generate a message.");
        }
        return messageText.trim();

    } catch (error) {
        console.error("Error generating newsletter message with Gemini:", error);
        throw new Error("Failed to generate newsletter message. Please try again.");
    }
};

export const analyzeProduct = async (productName: string): Promise<ProductAnalysis> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Act as a food product analyzer, similar to the Yuka app. Based on the product name "${productName}", provide a concise health analysis. Infer common ingredients and nutritional information for a generic version of this product. Provide a health score from 1 (poor) to 10 (excellent). Give a brief summary (2-3 sentences), 2 positive points (pros), and 2 negative points (cons). Also, list up to 3 notable additives or ingredients to be aware of if applicable. Your tone should be informative and neutral.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER, description: "A health score from 1 (poor) to 10 (excellent)." },
                        summary: { type: Type.STRING, description: "A brief, neutral summary of the product's health profile." },
                        pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2 positive points." },
                        cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2 negative points." },
                        additives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of up to 3 notable additives or ingredients." }
                    },
                    required: ['score', 'summary', 'pros', 'cons', 'additives']
                }
            }
        });

        const jsonText = response.text;
        const analysisData = JSON.parse(jsonText);
        return analysisData;

    } catch (error) {
        console.error("Error analyzing product with Gemini:", error);
        throw new Error("Failed to analyze product. The AI may be unable to assess this item. Please try another.");
    }
};

export const generateProductFromPrompt = async (prompt: string): Promise<Omit<Product, 'id' | 'imageUrl' | 'affiliateUrl'> & { imagePrompt: string }> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const fullPrompt = `Act as an e-commerce specialist creating a product listing for a recipe website's marketplace. Based on the user's prompt "${prompt}", generate details for a plausible affiliate product. Provide a product name, a fictional but realistic brand name, a compelling description (2-3 sentences), and a relevant category (e.g., Cookware, Appliances, Pantry Staples). Also, create a descriptive prompt for an AI image generator to create a professional, clean product photo on a white background.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "The name of the product." },
                        brand: { type: Type.STRING, description: "A fictional but realistic brand name." },
                        description: { type: Type.STRING, description: "A compelling product description (2-3 sentences)." },
                        category: { type: Type.STRING, description: "A relevant category for the product." },
                        imagePrompt: { type: Type.STRING, description: "A descriptive prompt for an AI image generator for a professional product photo on a white background." }
                    },
                    required: ['name', 'brand', 'description', 'category', 'imagePrompt']
                }
            }
        });

        const jsonText = response.text;
        const productData = JSON.parse(jsonText);
        
        return productData;

    } catch (error) {
        console.error("Error generating product from prompt with Gemini:", error);
        throw new Error("Failed to generate product details. The AI may be unable to process this request. Please try a different prompt.");
    }
};

export const generateRecipeFromIngredients = async (ingredients: string[], dietaryNotes: string): Promise<Omit<Recipe, 'id' | 'image'>> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let prompt = `Act as a creative chef. Based on the following ingredients: "${ingredients.join(', ')}", generate a unique and delicious recipe.`;
        if (dietaryNotes.trim()) {
            prompt += ` Please adhere to these dietary notes: "${dietaryNotes}".`;
        }
        prompt += ` The user has these ingredients, so prioritize them, but you can assume they have basic pantry staples like oil, salt, pepper, water, and common spices. Provide a creative, appealing title for the dish. The recipe must be well-written, easy to follow, and appealing. Provide a short, enticing description, a realistic cook time, and the number of servings. The ingredients list must be detailed with both metric and US units. The instructions should be clear, step-by-step. Include at least 3 relevant tags. Also, provide a suitable wine pairing suggestion with a specific wine name and a short explanation for the pairing, and an estimated calorie count per serving. Finally, create a profile for a fictional famous chef known for this type of cuisine, including their name, a short bio, their signature dish, and a prompt for generating a photorealistic portrait of them.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: recipeSchemaProperties,
                    required: recipeRequiredFields,
                }
            }
        });
        
        const jsonText = response.text;
        const recipeData = JSON.parse(jsonText);

        return recipeData;

    } catch (error) {
        console.error("Error generating recipe from ingredients with Gemini:", error);
        throw new Error("Failed to generate a recipe from your ingredients. The AI might be stumped! Please try a different combination.");
    }
};

export const generateRecipeFromImage = async (base64Image: string, mimeType: string): Promise<Omit<Recipe, 'id' | 'image'>> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };
        
        const textPart = {
            text: "Identify the dish in this image. Then, generate a complete, high-quality recipe for it. The recipe must be well-written, easy to follow, and appealing. Provide a short, enticing description, a realistic cook time, and the number of servings. The ingredients list must be detailed with both metric and US units. The instructions should be clear, step-by-step. Include at least 3 relevant tags. Also, provide a suitable wine pairing suggestion with a specific wine name and a short explanation for the pairing, and an estimated calorie count per serving. Finally, create a profile for a fictional famous chef known for this type of cuisine, including their name, a short bio, their signature dish, and a prompt for generating a photorealistic portrait of them."
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: recipeSchemaProperties,
                    required: recipeRequiredFields,
                }
            }
        });
        
        const jsonText = response.text;
        const recipeData = JSON.parse(jsonText);

        return recipeData;

    } catch (error) {
        console.error("Error generating recipe from image with Gemini:", error);
        throw new Error("Failed to generate a recipe from the image. The AI couldn't identify a dish. Please try a clearer photo.");
    }
};

export const generateRecipeFromIngredientsImage = async (base64Image: string, mimeType: string): Promise<Omit<Recipe, 'id' | 'image'>> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };
        
        const textPart = {
            text: "First, identify the main food ingredients in this image (e.g., chicken breasts, broccoli, bell peppers). Then, using those identified ingredients, generate a complete, high-quality recipe. Assume the user has basic pantry staples like oil, salt, pepper, and common spices. The recipe must be well-written and easy to follow. Provide a short, enticing description, a realistic cook time, and the number of servings. The ingredients list must be detailed with both metric and US units. The instructions should be clear, step-by-step. Include at least 3 relevant tags. Also, provide a suitable wine pairing suggestion with a specific wine name and a short explanation for the pairing, and an estimated calorie count per serving. Finally, create a profile for a fictional famous chef known for this type of cuisine, including their name, a short bio, their signature dish, and a prompt for generating a photorealistic portrait of them."
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: recipeSchemaProperties,
                    required: recipeRequiredFields,
                }
            }
        });
        
        const jsonText = response.text;
        const recipeData = JSON.parse(jsonText);

        return recipeData;

    } catch (error) {
        console.error("Error generating recipe from ingredients image with Gemini:", error);
        throw new Error("Failed to generate a recipe from the image. The AI couldn't identify ingredients. Please try a clearer photo.");
    }
};

export const generateMealPlan = async (prompt: string, recipeTitles: string[]): Promise<GeneratedMealPlan> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const fullPrompt = `Act as a helpful meal planner. The user's request is: "${prompt}". 
        Create a meal plan using ONLY the following available recipe titles: ${recipeTitles.join(', ')}. 
        Do not invent new recipes. If the request is impossible with the given recipes, explain why in the 'notes' field and leave the 'days' array empty.
        Structure the response with a 'days' array. Each day should have a 'day' (e.g., "Day 1") and a 'meals' array. Each meal should have a 'mealType' (e.g., "Breakfast", "Lunch") and a 'recipeTitle' that exactly matches one from the provided list.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        days: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.STRING },
                                    meals: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                mealType: { type: Type.STRING },
                                                recipeTitle: { type: Type.STRING }
                                            },
                                            required: ['mealType', 'recipeTitle']
                                        }
                                    }
                                },
                                required: ['day', 'meals']
                            }
                        },
                        notes: { type: Type.STRING, description: "Optional notes or explanation if the plan couldn't be fully generated."}
                    },
                    required: ['days']
                }
            }
        });

        const jsonText = response.text;
        const planData = JSON.parse(jsonText);

        return planData;

    } catch (error) {
        console.error("Error generating meal plan with Gemini:", error);
        throw new Error("Failed to generate a meal plan. The AI might be busy! Please try a different request.");
    }
};

export const generateCookbookIntroduction = async (title: string, recipeTitles: string[]): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Act as a cookbook editor. A user has created a personal cookbook titled "${title}" featuring the following recipes: ${recipeTitles.join(', ')}. Write a short, warm, and personal introduction for this cookbook. It should be 2-3 paragraphs long and have an encouraging and celebratory tone. Do not use markdown.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        const introText = response.text;
        if (!introText) {
            throw new Error("AI failed to generate an introduction.");
        }
        return introText.trim();

    } catch (error) {
        console.error("Error generating cookbook introduction with Gemini:", error);
        throw new Error("Failed to generate a cookbook introduction. Please try again.");
    }
};

export const identifyDishFromImage = async (base64Image: string, mimeType: string): Promise<DishInfo> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };
        
        const textPart = {
            text: "Analyze the attached image of a food dish. Identify the name of the dish, its country or region of origin (e.g., 'Valencia, Spain'), and provide a short, interesting description or fun fact about its history or ingredients. Your response must be in JSON format."
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        dishName: { type: Type.STRING, description: "The common name of the dish." },
                        origin: { type: Type.STRING, description: "The country or region of origin." },
                        description: { type: Type.STRING, description: "A brief, interesting description of the dish." }
                    },
                    required: ['dishName', 'origin', 'description']
                }
            }
        });
        
        const jsonText = response.text;
        const dishData = JSON.parse(jsonText);

        return dishData;

    } catch (error) {
        console.error("Error identifying dish from image with Gemini:", error);
        throw new Error("Failed to identify the dish from the image. The AI couldn't recognize it. Please try a clearer photo or a different dish.");
    }
};