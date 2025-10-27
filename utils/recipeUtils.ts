import { Ingredient, IngredientUnit } from '../types';

// --- Parsing ---

const parseFraction = (fraction: string): number => {
    if (!fraction || !fraction.includes('/')) return 0;
    const [num, den] = fraction.split('/').map(s => parseInt(s.trim(), 10));
    return den ? num / den : num;
};

const parseQuantity = (quantity: number | string): number => {
    if (typeof quantity === 'number') return quantity;
    if (typeof quantity !== 'string' || !quantity.trim()) return 0;

    const trimmedQuantity = quantity.trim();
    
    if (trimmedQuantity.includes(' ') && trimmedQuantity.includes('/')) {
        const parts = trimmedQuantity.split(' ');
        if (parts.length === 2) {
            const whole = parseInt(parts[0], 10);
            const frac = parseFraction(parts[1]);
            if (!isNaN(whole)) {
                return whole + frac;
            }
        }
    }
    
    if (trimmedQuantity.includes('/')) {
        return parseFraction(trimmedQuantity);
    }

    if (!isNaN(Number(trimmedQuantity))) {
        return parseFloat(trimmedQuantity);
    }
    
    return 0; 
};

// --- Formatting ---

const toFraction = (decimal: number): string => {
    if (decimal % 1 === 0) return decimal.toString();

    const tolerance = 1.0E-6;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = decimal;
    do {
        let a = Math.floor(b);
        let aux = h1; h1 = a * h1 + h2; h2 = aux;
        aux = k1; k1 = a * k1 + k2; k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

    const numerator = h1;
    const denominator = k1;

    if (denominator > 16) { 
        return decimal.toFixed(2);
    }
    
    if (numerator > denominator) {
        const whole = Math.floor(numerator / denominator);
        const rem = numerator % denominator;
        return rem === 0 ? `${whole}` : `${whole} ${rem}/${denominator}`;
    }

    return `${numerator}/${denominator}`;
};

// --- Main Functions ---

export const formatIngredient = (
  ingredient: Ingredient,
  system: 'metric' | 'us'
): string => {
  const { name } = ingredient;
  const unitDetails = system === 'metric' ? ingredient.metric : ingredient.us;
  const { quantity, unit } = unitDetails;

  if (typeof quantity === 'string' && isNaN(parseQuantity(quantity))) {
    return `${quantity} ${unit ? unit + ' ' : ''}${name}`.trim();
  }
  
  const numericQuantity = parseQuantity(quantity);
  if (numericQuantity === 0) {
      return name;
  }
  
  const formattedQuantity = system === 'us' ? toFraction(numericQuantity) : numericQuantity.toString();

  return `${formattedQuantity}${unit ? ' ' + unit : ''} ${name}`.trim();
};

export const adjustIngredient = (
    ingredient: Ingredient,
    originalServings: number,
    newServings: number
): Ingredient => {
    const ratio = newServings / originalServings;

    const adjustUnit = (unit: IngredientUnit): IngredientUnit => {
        const originalQuantity = parseQuantity(unit.quantity);
        if (originalQuantity === 0) {
            return unit;
        }
        const newQuantity = originalQuantity * ratio;
        
        if (unit === ingredient.us) {
            return { ...unit, quantity: newQuantity }; 
        }
        
        const roundedQuantity = parseFloat(newQuantity.toFixed(2));
        return { ...unit, quantity: roundedQuantity };
    };

    return {
        ...ingredient,
        metric: adjustUnit(ingredient.metric),
        us: adjustUnit(ingredient.us),
    };
};

export const formatInstruction = (
  instruction: string,
  system: 'metric' | 'us'
): string => {
  const tempRegex = /\[temp:(\d+):(\d+)\]/g;
  return instruction.replace(tempRegex, (_match, celsius, fahrenheit) => {
    return system === 'metric' ? `${celsius}°C` : `${fahrenheit}°F`;
  });
};
