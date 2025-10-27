import { Recipe, AggregatedIngredient, Ingredient, IngredientUnit } from '../types';

const parseFraction = (fraction: string): number => {
    const [num, den] = fraction.split('/').map(s => parseInt(s, 10));
    return den ? num / den : 0;
}

const parseQuantity = (quantity: number | string): number => {
    if (typeof quantity === 'number') return quantity;
    if (typeof quantity !== 'string' || !quantity) return 0;
    
    quantity = quantity.trim();
    if (!isNaN(Number(quantity))) return parseFloat(quantity);

    if (quantity.includes('/')) {
        const parts = quantity.split(' ');
        if (parts.length === 2 && parts[1].includes('/')) { // e.g. "1 1/2"
            const whole = parseInt(parts[0], 10);
            return isNaN(whole) ? 0 + parseFraction(parts[1]) : whole + parseFraction(parts[1]);
        }
        if (parts.length === 1 && parts[0].includes('/')) { // e.g. "1/2"
            return parseFraction(parts[0]);
        }
    }
    return 0; // for "to taste", "a handful", etc.
}


export const generateShoppingList = (recipes: Recipe[], measurementSystem: 'metric' | 'us'): AggregatedIngredient[] => {
    const aggregationMap = new Map<string, { quantity: number; unit: string; name: string }>();
    const nonAggregatable: AggregatedIngredient[] = [];

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            const unitDetails: IngredientUnit = ingredient[measurementSystem];
            const key = `${ingredient.name.toLowerCase().trim()}-${unitDetails.unit}`;
            const numericQuantity = parseQuantity(unitDetails.quantity);

            if (numericQuantity > 0) {
                if (aggregationMap.has(key)) {
                    const existing = aggregationMap.get(key)!;
                    existing.quantity += numericQuantity;
                } else {
                    aggregationMap.set(key, {
                        name: ingredient.name,
                        quantity: numericQuantity,
                        unit: unitDetails.unit,
                    });
                }
            } else {
                 nonAggregatable.push({
                    name: ingredient.name,
                    quantity: unitDetails.quantity,
                    unit: unitDetails.unit,
                });
            }
        });
    });

    const aggregatedList: AggregatedIngredient[] = Array.from(aggregationMap.values()).map(item => ({
        ...item,
        // Optional: format quantity nicely, e.g., 1.5 -> 1 1/2, but for now, decimals are fine.
    }));
    
    return [...aggregatedList, ...nonAggregatable].sort((a, b) => a.name.localeCompare(b.name));
};
