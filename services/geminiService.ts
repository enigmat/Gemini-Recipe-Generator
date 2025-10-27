import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, CocktailRecipe, RecipeVariation, ProductAnalysis, Product } from "../types";

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const descriptivePrompt = `A high-quality, professional food photograph of ${prompt}, beautifully plated and ready to eat. Bright, natural lighting.`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: descriptivePrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        throw new Error("Failed to generate image. Please check the prompt or API configuration.");
    }
};

export const generateRecipeDetailsFromTitle = async (title: string): Promise<Omit<Recipe, 'id' | 'image'>> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Generate a complete, high-quality recipe for "${title}". The recipe must be well-written, easy to follow, and appealing. Provide a short, enticing description, a realistic cook time, and the number of servings. The ingredients list must be detailed with both metric and US units. The instructions should be clear, step-by-step. Include at least 3 relevant tags. Also, provide a suitable wine pairing suggestion with a specific wine name and a short explanation for the pairing.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "The final, polished title of the recipe." },
                        description: { type: Type.STRING, description: "A brief, enticing description of the dish." },
                        cookTime: { type: Type.STRING, description: "e.g., '45 minutes'" },
                        servings: { type: Type.STRING, description: "e.g., '4 servings' or '4-6'" },
                        ingredients: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    metric: {
                                        type: Type.OBJECT,
                                        properties: {
                                            quantity: { type: Type.STRING },
                                            unit: { type: Type.STRING }
                                        },
                                        required: ['quantity', 'unit']
                                    },
                                    us: {
                                        type: Type.OBJECT,
                                        properties: {
                                            quantity: { type: Type.STRING },
                                            unit: { type: Type.STRING }
                                        },
                                        required: ['quantity', 'unit']
                                    }
                                },
                                required: ['name', 'metric', 'us']
                            }
                        },
                        instructions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        tags: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        winePairing: {
                            type: Type.OBJECT,
                            properties: {
                                suggestion: { type: Type.STRING },
                                description: { type: Type.STRING }
                            },
                        }
                    },
                    required: ['title', 'description', 'cookTime', 'servings', 'ingredients', 'instructions', 'tags']
                }
            }
        });
        
        const jsonText = response.text;
        const recipeData = JSON.parse(jsonText);

        // Ensure all required fields are present and have correct types
        if (
            !recipeData.title || typeof recipeData.title !== 'string' ||
            !recipeData.description || typeof recipeData.description !== 'string' ||
            !recipeData.cookTime || typeof recipeData.cookTime !== 'string' ||
            !recipeData.servings || typeof recipeData.servings !== 'string' ||
            !Array.isArray(recipeData.ingredients) ||
            !Array.isArray(recipeData.instructions) ||
            !Array.isArray(recipeData.tags)
        ) {
            throw new Error("Generated recipe data is missing required fields or has incorrect types.");
        }

        return recipeData;

    } catch (error) {
        console.error("Error generating recipe details with Gemini:", error);
        throw new Error("Failed to generate recipe details. Please try again.");
    }
};

export const generateRecipeFromUrl = async (url: string): Promise<Omit<Recipe, 'id' | 'image'>> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Analyze the following URL and generate a complete, high-quality recipe based on its title and content theme. The URL is: "${url}". The recipe must be well-written, easy to follow, and appealing. Provide a short, enticing description, a realistic cook time, and the number of servings. The ingredients list must be detailed with both metric and US units. The instructions should be clear, step-by-step. Include at least 3 relevant tags. Also, provide a suitable wine pairing suggestion with a specific wine name and a short explanation for the pairing.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "The final, polished title of the recipe." },
                        description: { type: Type.STRING, description: "A brief, enticing description of the dish." },
                        cookTime: { type: Type.STRING, description: "e.g., '45 minutes'" },
                        servings: { type: Type.STRING, description: "e.g., '4 servings' or '4-6'" },
                        ingredients: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    metric: {
                                        type: Type.OBJECT,
                                        properties: {
                                            quantity: { type: Type.STRING },
                                            unit: { type: Type.STRING }
                                        },
                                        required: ['quantity', 'unit']
                                    },
                                    us: {
                                        type: Type.OBJECT,
                                        properties: {
                                            quantity: { type: Type.STRING },
                                            unit: { type: Type.STRING }
                                        },
                                        required: ['quantity', 'unit']
                                    }
                                },
                                required: ['name', 'metric', 'us']
                            }
                        },
                        instructions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        tags: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        winePairing: {
                            type: Type.OBJECT,
                            properties: {
                                suggestion: { type: Type.STRING },
                                description: { type: Type.STRING }
                            },
                        }
                    },
                    required: ['title', 'description', 'cookTime', 'servings', 'ingredients', 'instructions', 'tags']
                }
            }
        });
        
        const jsonText = response.text;
        const recipeData = JSON.parse(jsonText);

        // Ensure all required fields are present and have correct types
        if (
            !recipeData.title || typeof recipeData.title !== 'string' ||
            !recipeData.description || typeof recipeData.description !== 'string' ||
            !recipeData.cookTime || typeof recipeData.cookTime !== 'string' ||
            !recipeData.servings || typeof recipeData.servings !== 'string' ||
            !Array.isArray(recipeData.ingredients) ||
            !Array.isArray(recipeData.instructions) ||
            !Array.isArray(recipeData.tags)
        ) {
            throw new Error("Generated recipe data is missing required fields or has incorrect types.");
        }

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
        prompt += ` The user has these ingredients, so prioritize them, but you can assume they have basic pantry staples like oil, salt, pepper, water, and common spices. Provide a creative, appealing title for the dish. The recipe must be well-written, easy to follow, and appealing. Provide a short, enticing description, a realistic cook time, and the number of servings. The ingredients list must be detailed with both metric and US units. The instructions should be clear, step-by-step. Include at least 3 relevant tags. Also, provide a suitable wine pairing suggestion with a specific wine name and a short explanation for the pairing.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "The final, polished title of the recipe." },
                        description: { type: Type.STRING, description: "A brief, enticing description of the dish." },
                        cookTime: { type: Type.STRING, description: "e.g., '45 minutes'" },
                        servings: { type: Type.STRING, description: "e.g., '4 servings' or '4-6'" },
                        ingredients: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    metric: {
                                        type: Type.OBJECT,
                                        properties: {
                                            quantity: { type: Type.STRING },
                                            unit: { type: Type.STRING }
                                        },
                                        required: ['quantity', 'unit']
                                    },
                                    us: {
                                        type: Type.OBJECT,
                                        properties: {
                                            quantity: { type: Type.STRING },
                                            unit: { type: Type.STRING }
                                        },
                                        required: ['quantity', 'unit']
                                    }
                                },
                                required: ['name', 'metric', 'us']
                            }
                        },
                        instructions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        tags: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        winePairing: {
                            type: Type.OBJECT,
                            properties: {
                                suggestion: { type: Type.STRING },
                                description: { type: Type.STRING }
                            },
                        }
                    },
                    required: ['title', 'description', 'cookTime', 'servings', 'ingredients', 'instructions', 'tags']
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
