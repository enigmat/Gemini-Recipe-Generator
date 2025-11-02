import { SavedCocktail } from '../types';

export const standardCocktails: SavedCocktail[] = [
  {
    id: 'std-1',
    title: 'Old Fashioned',
    description: 'A timeless classic, the Old Fashioned is a sophisticated blend of bourbon or rye, bitters, sugar, and a twist of citrus.',
    imagePrompt: 'A classic Old Fashioned cocktail in a rocks glass with a large ice cube, garnished with an orange peel twist and a cherry.',
    image: 'https://images.unsplash.com/photo-1562532454-95493c52a44b?auto=format&fit=crop&q=80&w=870',
    glassware: 'Rocks Glass',
    garnish: 'Orange peel and cocktail cherry',
    ingredients: [
      '2 oz Bourbon or Rye Whiskey',
      '1 Sugar cube (or 1/2 tsp sugar)',
      '2-3 dashes Angostura bitters',
      'Splash of water',
      'Large ice cube'
    ],
    instructions: [
      'Place sugar cube in a rocks glass.',
      'Saturate with bitters and add a splash of water.',
      'Muddle until the sugar is dissolved.',
      'Add the large ice cube and pour whiskey over it.',
      'Stir gently to chill.',
      'Express the oil of an orange peel over the glass, then drop it in.'
    ]
  },
  {
    id: 'std-2',
    title: 'Margarita',
    description: 'The perfect balance of sweet, sour, and salty. A refreshing mix of tequila, lime juice, and orange liqueur.',
    imagePrompt: 'A vibrant Margarita in a salt-rimmed glass, garnished with a lime wedge, with a bright and festive background.',
    image: 'https://images.unsplash.com/photo-1590234098489-5d46c16f21a2?auto=format&fit=crop&q=80&w=870',
    glassware: 'Margarita or Rocks Glass',
    garnish: 'Lime wedge and salt rim',
    ingredients: [
      '2 oz Blanco Tequila',
      '1 oz Lime Juice, freshly squeezed',
      '1 oz Orange Liqueur (Cointreau or Triple Sec)',
      'Agave syrup to taste (optional)'
    ],
    instructions: [
      'Rim a chilled glass with salt.',
      'Add tequila, lime juice, and orange liqueur to a shaker with ice.',
      'Shake well until chilled.',
      'Strain into the prepared glass filled with fresh ice.',
      'Garnish with a lime wedge.'
    ]
  },
  {
    id: 'std-3',
    title: 'Negroni',
    description: 'A sophisticated and bittersweet Italian aperitivo, made with equal parts gin, Campari, and sweet vermouth.',
    imagePrompt: 'A classic Negroni cocktail in a rocks glass with a large ice cube, garnished with a vibrant orange peel.',
    image: 'https://images.unsplash.com/photo-1608985168809-514a1a9e32e2?auto=format&fit=crop&q=80&w=870',
    glassware: 'Rocks Glass',
    garnish: 'Orange peel',
    ingredients: [
      '1 oz Gin',
      '1 oz Campari',
      '1 oz Sweet Vermouth'
    ],
    instructions: [
      'Add all ingredients into a mixing glass with ice.',
      'Stir until well-chilled.',
      'Strain into a rocks glass filled with a large ice cube.',
      'Garnish with an orange peel.'
    ]
  },
  {
    id: 'std-4',
    title: 'Espresso Martini',
    description: 'A rich and indulgent cocktail that combines vodka, coffee liqueur, and freshly brewed espresso for the perfect pick-me-up.',
    imagePrompt: 'A sophisticated Espresso Martini in a chilled coupe glass, with a frothy top garnished with three coffee beans.',
    image: 'https://images.unsplash.com/photo-1596230514502-3a3a4185854b?auto=format&fit=crop&q=80&w=870',
    glassware: 'Coupe or Martini Glass',
    garnish: 'Three coffee beans',
    ingredients: [
      '2 oz Vodka',
      '1/2 oz Coffee Liqueur (e.g., Kahlúa)',
      '1 oz Freshly Brewed Espresso, chilled',
      '1/4 oz Simple Syrup (optional)'
    ],
    instructions: [
      'Brew espresso and let it cool completely.',
      'Add vodka, coffee liqueur, espresso, and simple syrup (if using) to a shaker filled with ice.',
      'Shake vigorously until well-chilled and frothy.',
      'Double-strain into a chilled coupe or martini glass.',
      'Garnish with three coffee beans.'
    ]
  },
];
