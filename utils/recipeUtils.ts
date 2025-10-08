// Conversion rates
const G_TO_OZ = 0.035274;
const ML_TO_TSP = 0.202884;
const ML_TO_TBSP = 0.067628;
const ML_TO_CUP = 0.00422675;

export function parseIngredient(ingredientString: string): { quantity: number; unit: string; name: string } | null {
    const originalString = ingredientString.trim();
    // Regex to handle various formats like "1", "1.5", "1/2", "1 1/2"
    const quantityRegex = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d*\.?\d+)/;
    const quantityMatch = originalString.match(quantityRegex);

    if (!quantityMatch) {
        return { quantity: 0, unit: '', name: originalString };
    }

    const quantityStr = quantityMatch[0];
    let quantity: number;
    if (quantityStr.includes('/')) {
        const parts = quantityStr.split(/\s+/);
        quantity = parts.reduce((acc, part) => {
            if (part.includes('/')) {
                const [num, den] = part.split('/').map(Number);
                return acc + (den ? num / den : 0);
            }
            return acc + (Number(part) || 0);
        }, 0);
    } else {
        quantity = parseFloat(quantityStr);
    }

    const restOfString = originalString.substring(quantityStr.length).trim();
    
    // Common units list
    const units = ['g', 'gram', 'grams', 'kg', 'kilogram', 'kilograms', 'ml', 'milliliter', 'milliliters', 'l', 'liter', 'liters', 'tsp', 'teaspoon', 'teaspoons', 'tbsp', 'tablespoon', 'tablespoons', 'cup', 'cups', 'oz', 'ounce', 'ounces', 'clove', 'cloves', 'can', 'cans', 'packet', 'packets', 'sprig', 'sprigs', 'head', 'heads'];
    const unitRegex = new RegExp(`^(${units.join('|')})\\b`, 'i');
    const unitMatch = restOfString.match(unitRegex);

    let unit = '';
    let name = restOfString;

    if (unitMatch) {
        unit = unitMatch[0].toLowerCase();
        name = restOfString.substring(unit.length).trim();
    }
    
    name = name.replace(/^[\s,.]+/g, '');

    return { quantity, unit, name };
}

export function parseServings(servingsString: string | undefined): number {
    if (!servingsString) return 4; // Default if not provided
    const match = servingsString.match(/\d+/);
    return match ? parseInt(match[0], 10) : 4;
}

function toFraction(decimal: number): string {
    const whole = Math.floor(decimal);
    const frac = decimal - whole;

    if (frac < 0.05) return `${whole > 0 ? whole : ''}`;
    if (Math.abs(frac - 1) < 0.05) return `${whole + 1}`;

    const fractions: [number, number, string][] = [
        [1, 8, '⅛'], [1, 4, '¼'], [1, 3, '⅓'], [3, 8, '⅜'], 
        [1, 2, '½'], [5, 8, '⅝'], [2, 3, '⅔'], [3, 4, '¾'], [7, 8, '⅞']
    ];
    
    for (const [num, den, sym] of fractions) {
        if (Math.abs(frac - num / den) < 0.05) {
            return whole > 0 ? `${whole} ${sym}` : `${sym}`;
        }
    }
    
    const rounded = Math.round(decimal * 10) / 10;
    return `${rounded}`; // Fallback to decimal if no close fraction
}


export function convertToAmerican(quantity: number, unit: string): { newQuantityStr: string; newUnit: string } {
    const singularUnit = unit.toLowerCase().replace(/s$/, '');

    if (['g', 'gram'].includes(singularUnit)) {
        const oz = quantity * G_TO_OZ;
        return { newQuantityStr: oz.toFixed(oz < 1 ? 2 : 1), newUnit: 'oz' };
    }

    if (['kg', 'kilogram'].includes(singularUnit)) {
        const oz = quantity * 1000 * G_TO_OZ;
        return { newQuantityStr: oz.toFixed(1), newUnit: 'oz' };
    }

    if (['ml', 'milliliter'].includes(singularUnit)) {
        const cups = quantity * ML_TO_CUP;
        if (cups >= 0.25) {
            const finalCups = toFraction(cups);
            return { newQuantityStr: finalCups, newUnit: cups > 1 ? 'cups' : 'cup' };
        }
        const tbsp = quantity * ML_TO_TBSP;
        if (tbsp >= 0.5) {
            const finalTbsp = toFraction(tbsp);
            return { newQuantityStr: finalTbsp, newUnit: 'tbsp' };
        }
        const tsp = quantity * ML_TO_TSP;
        const finalTsp = toFraction(tsp);
        return { newQuantityStr: finalTsp, newUnit: 'tsp' };
    }
    
    if (['l', 'liter'].includes(singularUnit)) {
        const cups = quantity * 1000 * ML_TO_CUP;
        const finalCups = toFraction(cups);
        return { newQuantityStr: finalCups, newUnit: cups > 1 ? 'cups' : 'cup' };
    }

    // For units that don't need conversion
    const finalQuantity = Number(quantity.toFixed(2));
    const newQuantityStr = toFraction(finalQuantity);
    
    return { newQuantityStr, newUnit: singularUnit };
}