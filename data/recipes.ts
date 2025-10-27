import { Recipe } from '../types';

export const recipes: Recipe[] = [
  {
    id: 1,
    title: 'Spaghetti Carbonara',
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&q=80&w=871&ixlib=rb-4.0.3',
    description: 'A classic and indulgent Italian pasta dish made with eggs, cheese, pancetta, and pepper. Ready in under 30 minutes!',
    cookTime: '25 minutes',
    servings: '2-3',
    ingredients: [
      { name: 'spaghetti', metric: { quantity: 200, unit: 'g' }, us: { quantity: 7, unit: 'oz' } },
      { name: 'pancetta', metric: { quantity: 100, unit: 'g' }, us: { quantity: 3.5, unit: 'oz' } },
      { name: 'large eggs', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'pecorino cheese, grated', metric: { quantity: 50, unit: 'g' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'Salt and black pepper', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } }
    ],
    instructions: ['Cook spaghetti according to package directions.', 'Fry pancetta until crisp.', 'Whisk eggs and cheese.', 'Combine everything and serve immediately.'],
    tags: ['Italian', 'Pasta', 'Quick'],
    winePairing: {
      suggestion: 'Pinot Grigio',
      description: 'A crisp Pinot Grigio cuts through the richness of the pancetta and egg, cleansing the palate with each sip.'
    }
  },
  {
    id: 2,
    title: 'Chicken Tikka Masala',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=930&ixlib=rb-4.0.3',
    description: 'A creamy and flavorful curry with tender, marinated chicken pieces in a rich tomato-based sauce.',
    cookTime: '45 minutes',
    servings: '4',
    ingredients: [
        { name: 'chicken breast, cubed', metric: { quantity: 500, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
        { name: 'plain yogurt', metric: { quantity: 240, unit: 'ml' }, us: { quantity: 1, unit: 'cup' } },
        { name: 'ginger-garlic paste', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
        { name: 'turmeric', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
        { name: 'garam masala', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
        { name: 'tomato puree', metric: { quantity: 240, unit: 'ml' }, us: { quantity: 1, unit: 'cup' } },
        { name: 'heavy cream', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } }
    ],
    instructions: ['Marinate chicken in yogurt and spices for at least 1 hour.', 'Grill or pan-fry the chicken until cooked through.', 'In a separate pan, make the sauce with tomato puree and cream.', 'Add chicken to the sauce and simmer for 10 minutes.'],
    tags: ['Indian', 'Chicken', 'Dinner'],
    winePairing: {
      suggestion: 'Off-Dry Riesling',
      description: 'The slight sweetness of an off-dry Riesling balances the spice of the curry, while its acidity complements the tomato-based sauce.'
    }
  },
  {
    id: 3,
    title: 'Classic Beef Tacos',
    image: 'https://images.unsplash.com/photo-1565299712413-8af9b494469a?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A quick and easy weeknight meal featuring seasoned ground beef in crispy taco shells with your favorite toppings.',
    cookTime: '20 minutes',
    servings: '4',
    ingredients: [
      { name: 'ground beef', metric: { quantity: 500, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'taco seasoning', metric: { quantity: 1, unit: 'packet' }, us: { quantity: 1, unit: 'packet' } },
      { name: 'taco shells', metric: { quantity: 8, unit: '' }, us: { quantity: 8, unit: '' } },
      { name: 'Lettuce, tomato, cheese for topping', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Cook ground beef until browned.', 'Drain fat and add taco seasoning and water.', 'Simmer for 5 minutes.', 'Serve in taco shells with toppings.'],
    tags: ['Mexican', 'Beef', 'Quick', 'Dinner'],
    winePairing: {
        suggestion: 'Malbec',
        description: 'A juicy Malbec with soft tannins and dark fruit flavors complements the seasoned beef without overpowering the toppings.'
    }
  },
  {
    id: 4,
    title: 'Avocado Toast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A simple, healthy, and delicious breakfast or snack. Creamy mashed avocado on perfectly toasted bread.',
    cookTime: '5 minutes',
    servings: '1-2',
    ingredients: [
      { name: 'slices of bread', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'ripe avocado', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'Salt, pepper, red pepper flakes', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } },
      { name: 'lemon juice', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } }
    ],
    instructions: ['Toast the bread to your liking.', 'Mash the avocado with lemon juice, salt, and pepper.', 'Spread the avocado on the toast.', 'Sprinkle with red pepper flakes.'],
    tags: ['Breakfast', 'Vegetarian', 'Quick', 'Healthy']
  },
  {
    id: 5,
    title: 'Caesar Salad',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'The timeless salad with crisp romaine lettuce, crunchy croutons, and sharp Parmesan cheese tossed in a creamy Caesar dressing.',
    cookTime: '10 minutes',
    servings: '2',
    ingredients: [
      { name: 'head of romaine lettuce', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'croutons', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'grated Parmesan cheese', metric: { quantity: 60, unit: 'ml' }, us: { quantity: '1/4', unit: 'cup' } },
      { name: 'Caesar dressing', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Wash and chop the romaine lettuce.', 'Toss with Caesar dressing.', 'Top with croutons and Parmesan cheese.'],
    tags: ['Salad', 'Vegetarian', 'Quick'],
    winePairing: {
        suggestion: 'Sauvignon Blanc',
        description: 'A crisp Sauvignon Blanc has the acidity to cut through the creamy dressing and complement the tangy Parmesan cheese.'
    }
  },
  {
    id: 6,
    title: 'Margherita Pizza',
    image: 'https://images.unsplash.com/photo-1598021680925-92e3a00a1520?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A classic Italian pizza showcasing the colors of the flag with fresh mozzarella, savory tomato sauce, and aromatic basil.',
    cookTime: '20 minutes',
    servings: '2-3',
    ingredients: [
      { name: 'pizza dough', metric: { quantity: 1, unit: 'ball' }, us: { quantity: 1, unit: 'ball' } },
      { name: 'tomato sauce', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'fresh mozzarella', metric: { quantity: 150, unit: 'g' }, us: { quantity: 5, unit: 'oz' } },
      { name: 'Fresh basil leaves', metric: { quantity: 'a handful', unit: '' }, us: { quantity: 'a handful', unit: '' } }
    ],
    instructions: ['Preheat oven to [temp:220:425].', 'Roll out pizza dough.', 'Spread tomato sauce, top with mozzarella.', 'Bake for 10-12 minutes.', 'Garnish with fresh basil.'],
    tags: ['Italian', 'Pizza', 'Vegetarian']
  },
  {
    id: 7,
    title: 'Chocolate Chip Cookies',
    image: 'https://images.unsplash.com/photo-1593289297655-8758a5f1514e?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'The ultimate comfort dessert: soft, chewy cookies loaded with gooey, melted chocolate chips.',
    cookTime: '25 minutes',
    servings: '24 cookies',
    ingredients: [
      { name: 'all-purpose flour', metric: { quantity: 270, unit: 'g' }, us: { quantity: '2 1/4', unit: 'cups' } },
      { name: 'baking soda', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
      { name: 'butter, softened', metric: { quantity: 227, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'granulated sugar', metric: { quantity: 150, unit: 'g' }, us: { quantity: '3/4', unit: 'cup' } },
      { name: 'brown sugar, packed', metric: { quantity: 165, unit: 'g' }, us: { quantity: '3/4', unit: 'cup' } },
      { name: 'large eggs', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'chocolate chips', metric: { quantity: 340, unit: 'g' }, us: { quantity: 2, unit: 'cups' } }
    ],
    instructions: ['Preheat oven to [temp:190:375].', 'Cream butter and sugars.', 'Beat in eggs.', 'Stir in flour and baking soda.', 'Fold in chocolate chips.', 'Drop spoonfuls on a baking sheet and bake for 9-11 minutes.'],
    tags: ['Dessert', 'Baking']
  },
  {
    id: 8,
    title: 'Beef Stew',
    image: 'https://images.unsplash.com/photo-1628105030235-a8421b9758e5?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A hearty and comforting slow-cooked stew with tender beef, root vegetables, and a rich, savory broth.',
    cookTime: '3 hours',
    servings: '6-8',
    ingredients: [
        { name: 'beef chuck, cubed', metric: { quantity: 1, unit: 'kg' }, us: { quantity: 2.2, unit: 'lbs' } },
        { name: 'olive oil', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
        { name: 'onions, chopped', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
        { name: 'carrots, chopped', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
        { name: 'celery stalks, chopped', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
        { name: 'beef broth', metric: { quantity: 960, unit: 'ml' }, us: { quantity: 4, unit: 'cups' } },
        { name: 'red wine', metric: { quantity: 240, unit: 'ml' }, us: { quantity: 1, unit: 'cup' } }
    ],
    instructions: ['Brown the beef in olive oil.', 'Remove beef and sauté vegetables.', 'Add beef back to the pot with broth and wine.', 'Simmer for 2-3 hours until beef is tender.'],
    tags: ['Beef', 'Soup', 'Dinner'],
    winePairing: {
        suggestion: 'Cabernet Sauvignon',
        description: 'A full-bodied Cabernet Sauvignon stands up to the rich, savory flavors of the beef stew, with dark fruit notes that complement the meat.'
    }
  },
  {
    id: 9,
    title: 'Lemon Herb Roasted Chicken',
    image: 'https://images.unsplash.com/photo-1604503468822-3a32a4a37449?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A juicy, flavorful whole roasted chicken with crispy skin, infused with the bright flavors of lemon and fresh herbs.',
    cookTime: '1 hour 30 minutes',
    servings: '4-6',
    ingredients: [
        { name: 'whole chicken', metric: { quantity: 1.8, unit: 'kg' }, us: { quantity: 4, unit: 'lbs' } },
        { name: 'lemon, halved', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'sprigs of rosemary', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
        { name: 'sprigs of thyme', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
        { name: 'cloves garlic', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
        { name: 'olive oil', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
        { name: 'Salt and pepper', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } }
    ],
    instructions: ['Preheat oven to [temp:200:400].', 'Pat the chicken dry.', 'Stuff the cavity with lemon, herbs, and garlic.', 'Rub the outside with olive oil, salt, and pepper.', 'Roast for 1 hour 20 minutes or until juices run clear.'],
    tags: ['Chicken', 'Dinner'],
     winePairing: {
      suggestion: 'Chardonnay',
      description: 'An oaked Chardonnay offers buttery notes and a creamy texture that beautifully complements the roasted chicken and crispy skin.'
    }
  },
  {
    id: 10,
    title: 'Pancakes',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'Fluffy, golden-brown pancakes perfect for a weekend breakfast, ready to be topped with your favorite syrup and fruits.',
    cookTime: '15 minutes',
    servings: '4',
    ingredients: [
        { name: 'all-purpose flour', metric: { quantity: 180, unit: 'g' }, us: { quantity: '1 1/2', unit: 'cups' } },
        { name: 'sugar', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
        { name: 'baking powder', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
        { name: 'salt', metric: { quantity: 2.5, unit: 'ml' }, us: { quantity: '1/2', unit: 'tsp' } },
        { name: 'milk', metric: { quantity: 300, unit: 'ml' }, us: { quantity: '1 1/4', unit: 'cups' } },
        { name: 'egg', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'melted butter', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } }
    ],
    instructions: ['Whisk together dry ingredients.', 'In a separate bowl, whisk wet ingredients.', 'Combine wet and dry ingredients until just mixed.', 'Pour 60ml (1/4 cup) of batter onto a hot, greased griddle.', 'Cook until bubbles form, then flip and cook until golden brown.'],
    tags: ['Breakfast']
  },
  {
    id: 11,
    title: 'Mushroom Risotto',
    image: 'https://images.unsplash.com/photo-1621996346565-e326b20f5451?auto=format&fit=crop&q=80&w=1064&ixlib=rb-4.0.3',
    description: 'A creamy, decadent Italian rice dish cooked slowly with broth, mushrooms, and Parmesan cheese.',
    cookTime: '40 minutes',
    servings: '4',
    ingredients: [
        { name: 'olive oil', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
        { name: 'mushrooms, sliced', metric: { quantity: 250, unit: 'g' }, us: { quantity: 8, unit: 'oz' } },
        { name: 'onion, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'Arborio rice', metric: { quantity: 300, unit: 'g' }, us: { quantity: '1 1/2', unit: 'cups' } },
        { name: 'dry white wine', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
        { name: 'hot vegetable broth', metric: { quantity: 1, unit: 'L' }, us: { quantity: 4, unit: 'cups' } },
        { name: 'grated Parmesan', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } }
    ],
    instructions: ['Sauté mushrooms until golden.', 'In the same pan, cook onion, then add rice and toast for 1 minute.', 'Add wine and cook until absorbed.', 'Add broth one ladle at a time, stirring constantly, until rice is creamy.', 'Stir in mushrooms and Parmesan.'],
    tags: ['Italian', 'Vegetarian', 'Dinner'],
    winePairing: {
        suggestion: 'Pinot Noir',
        description: 'The earthy notes of a Pinot Noir are a classic match for the savory, umami flavor of mushrooms in this creamy risotto.'
    }
  },
  {
    id: 12,
    title: 'Greek Salad',
    image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=1078&ixlib=rb-4.0.3',
    description: 'A refreshing salad with crisp cucumber, juicy tomatoes, red onion, olives, and creamy feta cheese in a light vinaigrette.',
    cookTime: '15 minutes',
    servings: '4',
    ingredients: [
        { name: 'cucumber, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'tomatoes, chopped', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
        { name: 'red onion, thinly sliced', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'Kalamata olives', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
        { name: 'feta cheese, cubed', metric: { quantity: 200, unit: 'g' }, us: { quantity: 7, unit: 'oz' } },
        { name: 'olive oil', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
        { name: 'red wine vinegar', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } }
    ],
    instructions: ['Combine cucumber, tomatoes, onion, and olives in a bowl.', 'Whisk together olive oil and vinegar for the dressing.', 'Pour dressing over the vegetables and toss gently.', 'Top with feta cheese before serving.'],
    tags: ['Salad', 'Vegetarian', 'Quick']
  },
  {
    id: 13,
    title: 'French Onion Soup',
    image: 'https://images.unsplash.com/photo-1546953329-3262313854d9?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A rich and savory soup with sweet caramelized onions, topped with a crusty baguette and melted Gruyère cheese.',
    cookTime: '1 hour 15 minutes',
    servings: '4',
    ingredients: [
        { name: 'large onions, sliced', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
        { name: 'butter', metric: { quantity: 60, unit: 'ml' }, us: { quantity: 4, unit: 'tbsp' } },
        { name: 'cloves garlic', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
        { name: 'beef broth', metric: { quantity: 2, unit: 'L' }, us: { quantity: 8, unit: 'cups' } },
        { name: 'dry white wine', metric: { quantity: 240, unit: 'ml' }, us: { quantity: 1, unit: 'cup' } },
        { name: 'Baguette slices', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
        { name: 'Gruyère cheese', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Caramelize onions in butter for 30-40 minutes.', 'Add garlic, then deglaze with wine.', 'Add beef broth and simmer for 30 minutes.', 'Ladle soup into oven-safe bowls, top with baguette and cheese.', 'Broil until cheese is bubbly and golden.'],
    tags: ['Soup', 'French']
  },
  {
    id: 14,
    title: 'Pad Thai',
    image: 'https://images.unsplash.com/photo-1563245372-f217240f855e?auto=format&fit=crop&q=80&w=725&ixlib=rb-4.0.3',
    description: 'A popular Thai stir-fried noodle dish with a perfect balance of sweet, sour, and savory flavors.',
    cookTime: '30 minutes',
    servings: '2',
    ingredients: [
        { name: 'rice noodles', metric: { quantity: 200, unit: 'g' }, us: { quantity: 7, unit: 'oz' } },
        { name: 'shrimp or chicken', metric: { quantity: 200, unit: 'g' }, us: { quantity: 7, unit: 'oz' } },
        { name: 'eggs', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
        { name: 'bean sprouts', metric: { quantity: 240, unit: 'ml' }, us: { quantity: 1, unit: 'cup' } },
        { name: 'crushed peanuts', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
        { name: 'Pad Thai sauce (tamarind, fish sauce, sugar)', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Soak rice noodles until soft.', 'Stir-fry shrimp/chicken.', 'Push to one side, scramble eggs on the other.', 'Add noodles and sauce, toss to combine.', 'Stir in bean sprouts and top with peanuts.'],
    tags: ['Thai', 'Noodles', 'Seafood']
  },
  {
    id: 15,
    title: 'Caprese Salad',
    image: 'https://images.unsplash.com/photo-1579113800032-c38bd7635ba4?auto=format&fit=crop&q=80&w=774&ixlib=rb-4.0.3',
    description: 'A simple yet elegant Italian salad of sliced fresh mozzarella, tomatoes, and sweet basil, drizzled with balsamic glaze.',
    cookTime: '10 minutes',
    servings: '2',
    ingredients: [
        { name: 'ripe tomatoes, sliced', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
        { name: 'fresh mozzarella, sliced', metric: { quantity: 200, unit: 'g' }, us: { quantity: 7, unit: 'oz' } },
        { name: 'Fresh basil leaves', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
        { name: 'Balsamic glaze', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
        { name: 'Extra virgin olive oil', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Arrange alternating slices of tomato and mozzarella on a plate.', 'Tuck fresh basil leaves in between.', 'Drizzle with olive oil and balsamic glaze.', 'Season with salt and pepper.'],
    tags: ['Salad', 'Italian', 'Vegetarian', 'Quick']
  },
  {
    id: 16,
    title: 'Fish and Chips',
    image: 'https://images.unsplash.com/photo-1579207980424-2c25325de85b?auto=format&fit=crop&q=80&w=774&ixlib=rb-4.0.3',
    description: 'A classic British comfort food featuring crispy beer-battered fish served with golden, fluffy chips.',
    cookTime: '35 minutes',
    servings: '2',
    ingredients: [
        { name: 'white fish fillets (cod, haddock)', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
        { name: 'all-purpose flour', metric: { quantity: 120, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
        { name: 'baking powder', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
        { name: 'beer, cold', metric: { quantity: 240, unit: 'ml' }, us: { quantity: 1, unit: 'cup' } },
        { name: 'Potatoes for chips', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
        { name: 'Oil for frying', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Cut potatoes into chips and fry until golden.', 'Mix flour, baking powder, and beer to make the batter.', 'Dip fish in batter and fry until golden brown.', 'Serve with chips, lemon, and tartar sauce.'],
    tags: ['Seafood', 'Dinner']
  },
  {
    id: 17,
    title: 'Guacamole',
    image: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A creamy and zesty dip made from mashed avocados, onion, cilantro, jalapeño, and lime juice. Perfect with chips!',
    cookTime: '10 minutes',
    servings: '4',
    ingredients: [
        { name: 'ripe avocados', metric: { quantity: 3, unit: '' }, us: { quantity: 3, unit: '' } },
        { name: 'red onion, finely chopped', metric: { quantity: '1/2', unit: '' }, us: { quantity: '1/2', unit: '' } },
        { name: 'jalapeño, minced', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'cilantro, chopped', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
        { name: 'Juice of 1 lime', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'Salt to taste', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } }
    ],
    instructions: ['Mash avocados in a bowl.', 'Stir in onion, jalapeño, cilantro, and lime juice.', 'Season with salt.', 'Serve immediately with tortilla chips.'],
    tags: ['Mexican', 'Snack', 'Vegetarian', 'Quick']
  },
  {
    id: 18,
    title: 'Clam Chowder',
    image: 'https://images.unsplash.com/photo-1623334044955-d596e7c27137?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A rich, creamy New England-style chowder packed with clams, potatoes, and savory bacon.',
    cookTime: '40 minutes',
    servings: '4-6',
    ingredients: [
        { name: 'bacon, chopped', metric: { quantity: 4, unit: 'slices' }, us: { quantity: 4, unit: 'slices' } },
        { name: 'onion, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'celery stalks, chopped', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
        { name: 'potatoes, diced', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
        { name: 'chopped clams, with juice', metric: { quantity: 2, unit: 'cans' }, us: { quantity: 2, unit: 'cans' } },
        { name: 'half-and-half', metric: { quantity: 480, unit: 'ml' }, us: { quantity: 2, unit: 'cups' } }
    ],
    instructions: ['Cook bacon until crisp. Sauté onion and celery in bacon fat.', 'Add potatoes and clam juice. Simmer until potatoes are tender.', 'Stir in clams and half-and-half. Heat through but do not boil.', 'Garnish with bacon.'],
    tags: ['Soup', 'Seafood']
  },
  {
    id: 19,
    title: 'Apple Pie',
    image: 'https://images.unsplash.com/photo-1572383672419-ab35444a6914?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A classic American dessert with a flaky, buttery crust and a sweet, spiced apple filling.',
    cookTime: '1 hour',
    servings: '8',
    ingredients: [
        { name: 'double-crust pie pastry', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'apples, peeled and sliced', metric: { quantity: '6-8', unit: '' }, us: { quantity: '6-8', unit: '' } },
        { name: 'sugar', metric: { quantity: 150, unit: 'g' }, us: { quantity: '3/4', unit: 'cup' } },
        { name: 'flour', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
        { name: 'cinnamon', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
        { name: 'nutmeg', metric: { quantity: 1.25, unit: 'ml' }, us: { quantity: '1/4', unit: 'tsp' } },
        { name: 'butter', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } }
    ],
    instructions: ['Preheat oven to [temp:220:425].', 'Line a pie plate with one crust.', 'Mix apples with sugar, flour, and spices. Pour into crust.', 'Dot with butter. Cover with top crust, seal and vent.', 'Bake for 40-50 minutes until crust is golden and filling is bubbly.'],
    tags: ['Dessert', 'Baking']
  },
  {
    id: 20,
    title: 'Butternut Squash Soup',
    image: 'https://images.unsplash.com/photo-1603579590920-692716b60c49?auto=format&fit=crop&q=80&w=871&ixlib-rb-4.0.3',
    description: 'A velvety smooth and warming soup with the sweet, nutty flavor of roasted butternut squash.',
    cookTime: '50 minutes',
    servings: '6',
    ingredients: [
        { name: 'large butternut squash, peeled and cubed', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'onion, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'carrots, chopped', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
        { name: 'vegetable broth', metric: { quantity: 1, unit: 'L' }, us: { quantity: 4, unit: 'cups' } },
        { name: 'nutmeg', metric: { quantity: 2.5, unit: 'ml' }, us: { quantity: '1/2', unit: 'tsp' } },
        { name: 'Salt and pepper', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } }
    ],
    instructions: ['Roast butternut squash until tender.', 'Sauté onion and carrots.', 'Add roasted squash and broth to the pot. Simmer for 15 minutes.', 'Blend until smooth. Season with nutmeg, salt, and pepper.'],
    tags: ['Soup', 'Vegetarian', 'Vegan']
  },
  {
    id: 21,
    title: "Shepherd's Pie",
    image: 'https://images.unsplash.com/photo-1628045339387-a81673e528b3?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A comforting casserole of savory ground lamb and vegetables topped with a creamy layer of mashed potatoes.',
    cookTime: '1 hour',
    servings: '4-6',
    ingredients: [
        { name: 'ground lamb', metric: { quantity: 500, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
        { name: 'onion, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'carrots, diced', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
        { name: 'frozen peas', metric: { quantity: 240, unit: 'ml' }, us: { quantity: 1, unit: 'cup' } },
        { name: 'flour', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
        { name: 'beef broth', metric: { quantity: 240, unit: 'ml' }, us: { quantity: 1, unit: 'cup' } },
        { name: 'large potatoes, for mashing', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } }
    ],
    instructions: ['Cook lamb, onion, and carrots until browned. Stir in flour, then broth. Simmer until thick. Add peas.', 'Boil, peel, and mash potatoes.', 'Spread meat mixture in a baking dish. Top with mashed potatoes.', 'Bake at [temp:200:400] for 20 minutes.'],
    tags: ['Dinner', 'Beef']
  },
  {
    id: 22,
    title: 'Ratatouille',
    image: 'https://images.unsplash.com/photo-1594916259960-e67c85859942?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A beautiful and rustic French vegetable stew with eggplant, zucchini, peppers, and tomatoes.',
    cookTime: '1 hour',
    servings: '6',
    ingredients: [
        { name: 'eggplant, sliced', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'zucchinis, sliced', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
        { name: 'bell peppers, sliced', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
        { name: 'tomatoes, sliced', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
        { name: 'onion, sliced', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'Garlic, fresh herbs', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
        { name: 'Olive oil', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Arrange sliced vegetables in a spiral pattern in a baking dish.', 'Drizzle with olive oil and sprinkle with garlic, herbs, salt, and pepper.', 'Bake at [temp:190:375] for 45-55 minutes until vegetables are tender.'],
    tags: ['French', 'Vegetarian', 'Dinner', 'Vegan']
  },
  {
    id: 23,
    title: 'Banana Bread',
    image: 'https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A moist and delicious quick bread perfect for using up ripe bananas. Great for breakfast or a snack.',
    cookTime: '1 hour 10 minutes',
    servings: '10 slices',
    ingredients: [
        { name: 'ripe bananas, mashed', metric: { quantity: 3, unit: '' }, us: { quantity: 3, unit: '' } },
        { name: 'melted butter', metric: { quantity: 113, unit: 'g' }, us: { quantity: '1/2', unit: 'cup' } },
        { name: 'baking soda', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
        { name: 'Pinch of salt', metric: { quantity: 1, unit: 'pinch' }, us: { quantity: 1, unit: 'pinch' } },
        { name: 'sugar', metric: { quantity: 150, unit: 'g' }, us: { quantity: '3/4', unit: 'cup' } },
        { name: 'large egg, beaten', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'all-purpose flour', metric: { quantity: 180, unit: 'g' }, us: { quantity: '1 1/2', unit: 'cups' } }
    ],
    instructions: ['Preheat oven to [temp:175:350].', 'Mix mashed bananas and melted butter.', 'Stir in sugar, egg, and baking soda.', 'Mix in flour.', 'Pour into a greased loaf pan and bake for 60-65 minutes.'],
    tags: ['Baking', 'Dessert', 'Breakfast']
  },
  {
    id: 24,
    title: 'Lasagna',
    image: 'https://images.unsplash.com/photo-1619895092494-b28c084f4a32?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A hearty Italian-American classic with layers of pasta, rich meat sauce, creamy ricotta, and melted mozzarella cheese.',
    cookTime: '1 hour 30 minutes',
    servings: '8',
    ingredients: [
        { name: 'lasagna noodles', metric: { quantity: 9, unit: '' }, us: { quantity: 9, unit: '' } },
        { name: 'ground beef', metric: { quantity: 450, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
        { name: 'marinara sauce', metric: { quantity: 1, unit: 'jar' }, us: { quantity: 1, unit: 'jar' } },
        { name: 'ricotta cheese', metric: { quantity: 425, unit: 'g' }, us: { quantity: 15, unit: 'oz' } },
        { name: 'grated Parmesan', metric: { quantity: 110, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
        { name: 'shredded mozzarella', metric: { quantity: 225, unit: 'g' }, us: { quantity: 2, unit: 'cups' } }
    ],
    instructions: ['Cook noodles. Brown beef and mix with marinara.', 'In a baking dish, layer sauce, noodles, ricotta, Parmesan, and mozzarella.', 'Repeat layers.', 'Bake at [temp:190:375] for 45 minutes until bubbly.'],
    tags: ['Italian', 'Pasta', 'Dinner', 'Beef']
  },
  {
    id: 25,
    title: 'Sushi Rolls (Maki)',
    image: 'https://images.unsplash.com/photo-1592891969458-06a4a6c42a22?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'Learn to make your own Japanese sushi rolls at home with your favorite fillings.',
    cookTime: '45 minutes',
    servings: '2-3',
    ingredients: [
        { name: 'sushi rice', metric: { quantity: 185, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
        { name: 'sheets of nori', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
        { name: 'Fillings (e.g., cucumber, avocado, crab meat)', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
        { name: 'Soy sauce, wasabi, pickled ginger for serving', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Cook sushi rice and season with rice vinegar.', 'Lay a sheet of nori on a bamboo mat.', 'Spread rice over nori, leaving a border.', 'Place fillings in a line. Roll tightly.', 'Slice into pieces and serve.'],
    tags: ['Japanese', 'Seafood']
  },
  {
    id: 26,
    title: 'Chicken Noodle Soup',
    image: 'https://images.unsplash.com/photo-1626372416458-75c35b5a4a58?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'The ultimate comfort food. A simple, savory soup with shredded chicken, vegetables, and tender egg noodles.',
    cookTime: '30 minutes',
    servings: '4',
    ingredients: [
        { name: 'cooked chicken breast, shredded', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'chicken broth', metric: { quantity: 1.4, unit: 'L' }, us: { quantity: 6, unit: 'cups' } },
        { name: 'egg noodles', metric: { quantity: 85, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
        { name: 'mixed vegetables (carrots, celery)', metric: { quantity: 150, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
        { name: 'Salt and pepper', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } }
    ],
    instructions: ['Bring chicken broth to a boil.', 'Add vegetables and noodles, cook until tender.', 'Stir in shredded chicken.', 'Season with salt and pepper.'],
    tags: ['Soup', 'Chicken']
  },
  {
    id: 27,
    title: 'Macaroni and Cheese',
    image: 'https://images.unsplash.com/photo-1541592106381-b58e7c13a523?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A creamy, cheesy, and incredibly satisfying homemade macaroni and cheese that beats the boxed version every time.',
    cookTime: '25 minutes',
    servings: '4',
    ingredients: [
        { name: 'macaroni', metric: { quantity: 225, unit: 'g' }, us: { quantity: 2, unit: 'cups' } },
        { name: 'butter', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
        { name: 'flour', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
        { name: 'milk', metric: { quantity: 480, unit: 'ml' }, us: { quantity: 2, unit: 'cups' } },
        { name: 'shredded cheddar cheese', metric: { quantity: 225, unit: 'g' }, us: { quantity: 2, unit: 'cups' } },
        { name: 'Salt and pepper', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } }
    ],
    instructions: ['Cook macaroni. Make a roux with butter and flour.', 'Whisk in milk until it thickens.', 'Stir in cheese until melted.', 'Combine sauce with cooked macaroni.'],
    tags: ['Pasta', 'Vegetarian', 'Dinner']
  },
  {
    id: 28,
    title: 'Shrimp Scampi',
    image: 'https://images.unsplash.com/photo-1625944026293-9a3a91015f4a?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A quick and elegant pasta dish with plump shrimp sautéed in a delicious garlic, butter, and white wine sauce.',
    cookTime: '20 minutes',
    servings: '2',
    ingredients: [
        { name: 'linguine', metric: { quantity: 250, unit: 'g' }, us: { quantity: 8, unit: 'oz' } },
        { name: 'shrimp, peeled', metric: { quantity: 450, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
        { name: 'garlic, minced', metric: { quantity: 4, unit: 'cloves' }, us: { quantity: 4, unit: 'cloves' } },
        { name: 'white wine', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
        { name: 'butter', metric: { quantity: 60, unit: 'ml' }, us: { quantity: '1/4', unit: 'cup' } },
        { name: 'Juice of 1 lemon', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
        { name: 'Fresh parsley, chopped', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Cook linguine. Sauté garlic in butter.', 'Add shrimp and cook until pink.', 'Deglaze with white wine and lemon juice.', 'Toss with pasta and parsley.'],
    tags: ['Pasta', 'Seafood', 'Italian', 'Quick'],
    winePairing: {
        suggestion: 'Sauvignon Blanc',
        description: 'The bright acidity and citrus notes of a Sauvignon Blanc enhance the garlic, lemon, and white wine sauce in the scampi.'
    }
  },
  {
    id: 29,
    title: 'Omelette',
    image: 'https://images.unsplash.com/photo-1587339144365-993c4cc529e0?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A versatile and quick breakfast staple. Master the perfect fluffy omelette and customize it with your favorite fillings.',
    cookTime: '10 minutes',
    servings: '1',
    ingredients: [
        { name: 'large eggs', metric: { quantity: 3, unit: '' }, us: { quantity: 3, unit: '' } },
        { name: 'milk', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
        { name: 'Salt and pepper', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } },
        { name: 'Fillings (e.g., cheese, mushrooms, spinach)', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Whisk eggs, milk, salt, and pepper.', 'Pour into a hot, greased skillet.', 'As eggs set, add fillings to one half.', 'Fold the other half over and cook to desired doneness.'],
    tags: ['Breakfast', 'Quick']
  },
  {
    id: 30,
    title: 'Chocolate Lava Cakes',
    image: 'https://images.unsplash.com/photo-1586985289936-a8a72a15c81d?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'An impressive and decadent dessert with a warm, molten chocolate center that flows out when you cut into it.',
    cookTime: '25 minutes',
    servings: '2',
    ingredients: [
        { name: 'butter', metric: { quantity: 113, unit: 'g' }, us: { quantity: '1/2', unit: 'cup' } },
        { name: 'bittersweet chocolate', metric: { quantity: 120, unit: 'g' }, us: { quantity: 4, unit: 'oz' } },
        { name: 'eggs', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
        { name: 'egg yolks', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
        { name: 'sugar', metric: { quantity: 50, unit: 'g' }, us: { quantity: '1/4', unit: 'cup' } },
        { name: 'flour', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } }
    ],
    instructions: ['Preheat oven to [temp:220:425]. Grease ramekins.', 'Melt butter and chocolate together.', 'Whisk eggs, yolks, and sugar until pale. Fold in chocolate mixture, then flour.', 'Pour into ramekins and bake for 12-14 minutes until sides are firm and center is soft.'],
    tags: ['Dessert', 'Baking', 'Quick']
  },
  {
    id: 31,
    title: 'Hummus',
    image: 'https://images.unsplash.com/photo-1630409349896-e41c4f45d179?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A smooth and creamy Middle Eastern dip made from chickpeas, tahini, lemon, and garlic. Perfect for dipping vegetables or pita.',
    cookTime: '10 minutes',
    servings: '6',
    ingredients: [
      { name: 'chickpeas, drained', metric: { quantity: 1, unit: 'can (425g)' }, us: { quantity: 1, unit: 'can (15 oz)' } },
      { name: 'tahini', metric: { quantity: 60, unit: 'ml' }, us: { quantity: '1/4', unit: 'cup' } },
      { name: 'lemon juice', metric: { quantity: 60, unit: 'ml' }, us: { quantity: '1/4', unit: 'cup' } },
      { name: 'garlic', metric: { quantity: 1, unit: 'clove' }, us: { quantity: 1, unit: 'clove' } },
      { name: 'olive oil', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
      { name: 'Salt to taste', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } }
    ],
    instructions: ['Combine all ingredients in a food processor.', 'Blend until smooth and creamy, adding a little water if needed.', 'Serve drizzled with more olive oil and pita bread.'],
    tags: ['Snack', 'Vegetarian', 'Quick', 'Vegan']
  },
  {
    id: 32,
    title: 'Cobb Salad',
    image: 'https://images.unsplash.com/photo-1559847844-5315695d0464?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A classic American garden salad with rows of chicken, bacon, hard-boiled eggs, avocado, and blue cheese.',
    cookTime: '20 minutes',
    servings: '2-4',
    ingredients: [
      { name: 'Chopped lettuce', metric: { quantity: '1 head', unit: '' }, us: { quantity: '1 head', unit: '' } },
      { name: 'Cooked chicken breast, diced', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'Bacon, crumbled', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
      { name: 'Hard-boiled eggs, chopped', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'Avocado, diced', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'Tomatoes, diced', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'Blue cheese crumbles', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
      { name: 'Vinaigrette dressing', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Arrange lettuce on a large platter.', 'Create rows of chicken, bacon, eggs, avocado, and tomatoes over the lettuce.', 'Sprinkle with blue cheese.', 'Drizzle with vinaigrette just before serving.'],
    tags: ['Salad', 'Chicken']
  },
  {
    id: 33,
    title: 'Stuffed Bell Peppers',
    image: 'https://images.unsplash.com/photo-1621326901841-3b8e4cb4f553?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'Hollowed-out bell peppers filled with a savory mixture of ground meat, rice, and tomatoes, then baked to perfection.',
    cookTime: '45 minutes',
    servings: '4',
    ingredients: [
      { name: 'bell peppers, tops cut off', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
      { name: 'ground beef or turkey', metric: { quantity: 500, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'cooked rice', metric: { quantity: 185, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'diced tomatoes', metric: { quantity: 1, unit: 'can (425g)' }, us: { quantity: 1, unit: 'can (15 oz)' } },
      { name: 'onion, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'Shredded cheese', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Preheat oven to [temp:175:350].', 'Brown meat with onion. Stir in rice and tomatoes.', 'Spoon mixture into bell peppers.', 'Top with cheese and bake for 25-30 minutes.'],
    tags: ['Dinner', 'Beef']
  },
  {
    id: 34,
    title: 'French Toast',
    image: 'https://images.unsplash.com/photo-1639108097123-5e3630c14b6c?auto=format&fit=crop&q=80&w=870&ixlib-rb-4.0.3',
    description: 'A breakfast favorite where bread slices are soaked in a sweet egg batter and pan-fried to golden perfection.',
    cookTime: '15 minutes',
    servings: '2',
    ingredients: [
      { name: 'slices of thick bread', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
      { name: 'large eggs', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'milk', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'cinnamon', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
      { name: 'vanilla extract', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
      { name: 'Butter for cooking', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Whisk together eggs, milk, cinnamon, and vanilla.', 'Soak each slice of bread in the egg mixture.', 'Cook on a hot, buttered skillet until golden brown on both sides.', 'Serve with syrup and fruit.'],
    tags: ['Breakfast']
  },
  {
    id: 35,
    title: 'Beef and Broccoli',
    image: 'https://images.unsplash.com/photo-1608375983732-b25b14c3165b?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A quick and healthy Chinese-American stir-fry with tender slices of beef and crisp broccoli florets in a savory sauce.',
    cookTime: '20 minutes',
    servings: '3-4',
    ingredients: [
      { name: 'flank steak, thinly sliced', metric: { quantity: 500, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'large head of broccoli, cut into florets', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'soy sauce', metric: { quantity: 45, unit: 'ml' }, us: { quantity: 3, unit: 'tbsp' } },
      { name: 'cornstarch', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
      { name: 'ginger, grated', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
      { name: 'garlic, minced', metric: { quantity: 2, unit: 'cloves' }, us: { quantity: 2, unit: 'cloves' } }
    ],
    instructions: ['Marinate steak in soy sauce, cornstarch, ginger, and garlic.', 'Stir-fry steak until browned. Remove from pan.', 'Stir-fry broccoli until tender-crisp.', 'Return steak to pan and toss to combine.'],
    tags: ['Chinese', 'Beef', 'Dinner', 'Quick']
  },
  {
    id: 36,
    title: 'Potato Salad',
    image: 'https://images.unsplash.com/photo-1604467721588-75101a75661b?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A creamy and classic side dish for picnics and barbecues, made with boiled potatoes, hard-boiled eggs, and a tangy mayonnaise dressing.',
    cookTime: '30 minutes',
    servings: '6-8',
    ingredients: [
      { name: 'potatoes, boiled and diced', metric: { quantity: 1, unit: 'kg' }, us: { quantity: 2.2, unit: 'lbs' } },
      { name: 'mayonnaise', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'mustard', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
      { name: 'hard-boiled eggs, chopped', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
      { name: 'red onion, chopped', metric: { quantity: '1/2', unit: '' }, us: { quantity: '1/2', unit: '' } },
      { name: 'celery stalks, chopped', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } }
    ],
    instructions: ['In a large bowl, combine mayonnaise and mustard.', 'Gently stir in potatoes, eggs, onion, and celery.', 'Season with salt and pepper.', 'Chill before serving.'],
    tags: ['Salad', 'Side Dish']
  },
  {
    id: 37,
    title: 'Gazpacho',
    image: 'https://images.unsplash.com/photo-1598273618474-5145b2b2a632?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A refreshing chilled soup from Spain, made with blended raw vegetables like tomatoes, peppers, and cucumbers.',
    cookTime: '15 minutes (+ chilling)',
    servings: '4-6',
    ingredients: [
      { name: 'ripe tomatoes, chopped', metric: { quantity: 1, unit: 'kg' }, us: { quantity: 2.2, unit: 'lbs' } },
      { name: 'cucumber, peeled and chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'green bell pepper, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'red onion, chopped', metric: { quantity: '1/2', unit: '' }, us: { quantity: '1/2', unit: '' } },
      { name: 'garlic', metric: { quantity: 2, unit: 'cloves' }, us: { quantity: 2, unit: 'cloves' } },
      { name: 'olive oil', metric: { quantity: 60, unit: 'ml' }, us: { quantity: '1/4', unit: 'cup' } },
      { name: 'sherry vinegar', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } }
    ],
    instructions: ['Combine all vegetables in a blender.', 'Blend until smooth.', 'With the blender running, slowly stream in the olive oil.', 'Stir in vinegar, salt, and pepper. Chill thoroughly before serving.'],
    tags: ['Soup', 'Vegetarian', 'Quick', 'Vegan']
  },
  {
    id: 38,
    title: 'Baked Salmon',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A simple, healthy, and elegant main course. Tender salmon fillets baked with lemon, garlic, and fresh herbs.',
    cookTime: '20 minutes',
    servings: '4',
    ingredients: [
      { name: 'salmon fillets', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
      { name: 'olive oil', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
      { name: 'garlic, minced', metric: { quantity: 2, unit: 'cloves' }, us: { quantity: 2, unit: 'cloves' } },
      { name: 'lemon, sliced', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'Fresh dill or parsley', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
      { name: 'Salt and pepper', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } }
    ],
    instructions: ['Preheat oven to [temp:200:400].', 'Place salmon on a baking sheet.', 'Rub with olive oil, garlic, salt, and pepper.', 'Top with lemon slices and herbs.', 'Bake for 12-15 minutes until fish flakes easily.'],
    tags: ['Seafood', 'Dinner', 'Quick', 'Healthy'],
    winePairing: {
        suggestion: 'Pinot Noir',
        description: 'A light-bodied Pinot Noir is a great match for salmon. Its red fruit flavors and earthy notes won\'t overpower the delicate fish.'
    }
  },
  {
    id: 39,
    title: 'Crab Cakes',
    image: 'https://images.unsplash.com/photo-1639108097123-5e3630c14b6c?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'Flavorful patties of crab meat and breadcrumbs, pan-fried to golden perfection. A delicious seafood appetizer or main.',
    cookTime: '20 minutes',
    servings: '4',
    ingredients: [
      { name: 'crabmeat, picked over', metric: { quantity: 450, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'breadcrumbs', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'mayonnaise', metric: { quantity: 60, unit: 'ml' }, us: { quantity: '1/4', unit: 'cup' } },
      { name: 'egg, beaten', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'Dijon mustard', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
      { name: 'lemon juice', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
      { name: 'Oil for frying', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Gently mix all ingredients except oil.', 'Shape into patties.', 'Pan-fry in oil for 3-5 minutes per side until golden brown.', 'Serve with a lemon wedge.'],
    tags: ['Seafood', 'Appetizer']
  },
  {
    id: 40,
    title: 'Minestrone Soup',
    image: 'https://images.unsplash.com/photo-1530983333393-02a1b1834241?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A thick and hearty Italian soup loaded with vegetables, beans, and small pasta in a tomato-based broth.',
    cookTime: '45 minutes',
    servings: '6',
    ingredients: [
      { name: 'olive oil', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
      { name: 'onion, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'carrots, chopped', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'celery stalks, chopped', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'diced tomatoes', metric: { quantity: 1, unit: 'can (425g)' }, us: { quantity: 1, unit: 'can (15 oz)' } },
      { name: 'vegetable broth', metric: { quantity: 1.4, unit: 'L' }, us: { quantity: 6, unit: 'cups' } },
      { name: 'small pasta', metric: { quantity: 100, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'kidney beans, rinsed', metric: { quantity: 1, unit: 'can (425g)' }, us: { quantity: 1, unit: 'can (15 oz)' } }
    ],
    instructions: ['Sauté onion, carrots, and celery in olive oil.', 'Add tomatoes and broth. Bring to a simmer.', 'Stir in pasta and cook until al dente.', 'Add beans and heat through. Season to taste.'],
    tags: ['Soup', 'Italian', 'Vegetarian', 'Vegan']
  },
  {
    id: 41,
    title: 'Quiche Lorraine',
    image: 'https://images.unsplash.com/photo-1627883149594-6725a3b7da75?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A classic French tart with a rich egg and cream custard, filled with bacon and Gruyère cheese in a flaky pastry crust.',
    cookTime: '50 minutes',
    servings: '6-8',
    ingredients: [
      { name: 'unbaked 9-inch pie crust', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'bacon, cooked and crumbled', metric: { quantity: 150, unit: 'g' }, us: { quantity: 5, unit: 'oz' } },
      { name: 'shredded Gruyère cheese', metric: { quantity: 110, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'large eggs', metric: { quantity: 3, unit: '' }, us: { quantity: 3, unit: '' } },
      { name: 'heavy cream', metric: { quantity: 360, unit: 'ml' }, us: { quantity: '1 1/2', unit: 'cups' } },
      { name: 'Pinch of nutmeg', metric: { quantity: 1, unit: 'pinch' }, us: { quantity: 1, unit: 'pinch' } }
    ],
    instructions: ['Preheat oven to [temp:190:375]. Prick pie crust and bake for 10 minutes.', 'Sprinkle bacon and cheese into the crust.', 'Whisk eggs, cream, salt, pepper, and nutmeg. Pour over fillings.', 'Bake for 30-35 minutes until the center is set.'],
    tags: ['French', 'Breakfast']
  },
  {
    id: 42,
    title: 'Chicken Parmesan',
    image: 'https://images.unsplash.com/photo-1632778149955-e83f0ce722e1?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A beloved Italian-American comfort food featuring breaded chicken cutlets topped with marinara sauce and melted mozzarella.',
    cookTime: '40 minutes',
    servings: '4',
    ingredients: [
      { name: 'chicken cutlets, pounded thin', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
      { name: 'breadcrumbs', metric: { quantity: 120, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'Parmesan cheese', metric: { quantity: 50, unit: 'g' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'eggs, beaten', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'Marinara sauce', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
      { name: 'mozzarella, sliced', metric: { quantity: 200, unit: 'g' }, us: { quantity: 7, unit: 'oz' } }
    ],
    instructions: ['Dredge chicken in egg, then in breadcrumb-Parmesan mixture.', 'Pan-fry until golden brown.', 'Place in a baking dish, top with marinara and mozzarella.', 'Bake at [temp:200:400] for 10-15 minutes until cheese is melted.'],
    tags: ['Italian', 'Chicken', 'Dinner']
  },
  {
    id: 43,
    title: 'Tomato Soup',
    image: 'https://images.unsplash.com/photo-1599221142502-3855a7465612?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A creamy and comforting soup made from ripe tomatoes, perfect for pairing with a grilled cheese sandwich.',
    cookTime: '30 minutes',
    servings: '4',
    ingredients: [
      { name: 'butter', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
      { name: 'onion, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'crushed tomatoes', metric: { quantity: 1, unit: 'can (794g)' }, us: { quantity: 1, unit: 'can (28 oz)' } },
      { name: 'vegetable broth', metric: { quantity: 480, unit: 'ml' }, us: { quantity: 2, unit: 'cups' } },
      { name: 'heavy cream', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'Fresh basil', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Melt butter and sauté onion.', 'Add tomatoes and broth. Simmer for 20 minutes.', 'Blend until smooth.', 'Stir in cream and heat through. Garnish with basil.'],
    tags: ['Soup', 'Vegetarian']
  },
  {
    id: 44,
    title: 'Tiramisu',
    image: 'https://images.unsplash.com/photo-1571683418299-23de79822e12?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'An elegant no-bake Italian dessert with layers of coffee-soaked ladyfingers and a rich mascarpone cream, dusted with cocoa.',
    cookTime: '25 minutes (+ chilling)',
    servings: '8',
    ingredients: [
      { name: 'egg yolks', metric: { quantity: 6, unit: '' }, us: { quantity: 6, unit: '' } },
      { name: 'sugar', metric: { quantity: 150, unit: 'g' }, us: { quantity: '3/4', unit: 'cup' } },
      { name: 'mascarpone cheese', metric: { quantity: 227, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'strong brewed coffee, cooled', metric: { quantity: 360, unit: 'ml' }, us: { quantity: '1 1/2', unit: 'cups' } },
      { name: 'ladyfinger biscuits', metric: { quantity: 24, unit: '' }, us: { quantity: 24, unit: '' } },
      { name: 'Cocoa powder for dusting', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Beat egg yolks and sugar until thick. Fold in mascarpone.', 'Quickly dip each ladyfinger in coffee and line a dish.', 'Spread half the mascarpone mixture over the ladyfingers. Repeat.', 'Chill for at least 4 hours. Dust with cocoa before serving.'],
    tags: ['Dessert', 'Italian']
  },
  {
    id: 45,
    title: 'Eggplant Parmesan',
    image: 'https://images.unsplash.com/photo-1616748443360-a818c397a618?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A delicious vegetarian casserole with layers of fried eggplant, marinara sauce, and melted mozzarella and Parmesan cheeses.',
    cookTime: '50 minutes',
    servings: '6',
    ingredients: [
      { name: 'medium eggplants, sliced', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'breadcrumbs', metric: { quantity: 120, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'eggs, beaten', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'Marinara sauce', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
      { name: 'mozzarella, sliced', metric: { quantity: 200, unit: 'g' }, us: { quantity: 7, unit: 'oz' } },
      { name: 'Parmesan cheese', metric: { quantity: 50, unit: 'g' }, us: { quantity: '1/2', unit: 'cup' } }
    ],
    instructions: ['Dredge eggplant slices in egg, then breadcrumbs. Pan-fry until golden.', 'In a baking dish, layer marinara, eggplant, mozzarella, and Parmesan.', 'Repeat layers.', 'Bake at [temp:190:375] for 20-25 minutes.'],
    tags: ['Italian', 'Vegetarian', 'Dinner']
  },
  {
    id: 46,
    title: 'Strawberry Shortcake',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A classic summer dessert featuring sweet, juicy strawberries and fluffy whipped cream served over tender shortcake biscuits.',
    cookTime: '25 minutes',
    servings: '6',
    ingredients: [
      { name: 'strawberries, sliced', metric: { quantity: 450, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'sugar', metric: { quantity: 50, unit: 'g' }, us: { quantity: '1/4', unit: 'cup' } },
      { name: 'Shortcake biscuits', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
      { name: 'Whipped cream', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Toss strawberries with sugar and let sit for 20 minutes to macerate.', 'Split biscuits in half.', 'Spoon strawberries and their juice over the bottom half.', 'Top with whipped cream and the other biscuit half.'],
    tags: ['Dessert']
  },
  {
    id: 47,
    title: 'Pulled Pork Sandwich',
    image: 'https://images.unsplash.com/photo-1603874318797-293672007b8a?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'Tender, slow-cooked pork shoulder shredded and mixed with tangy BBQ sauce, served on a soft bun.',
    cookTime: '8 hours',
    servings: '8',
    ingredients: [
      { name: 'pork shoulder', metric: { quantity: 1.5, unit: 'kg' }, us: { quantity: 3.3, unit: 'lbs' } },
      { name: 'BBQ sauce', metric: { quantity: 240, unit: 'ml' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'onion, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'Hamburger buns', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
      { name: 'Coleslaw for serving', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Place pork and onion in a slow cooker. Cook on low for 8-10 hours.', 'Shred pork with two forks, discarding fat.', 'Stir in BBQ sauce.', 'Serve on buns with coleslaw.'],
    tags: ['Dinner', 'Pork']
  },
  {
    id: 48,
    title: 'Chicken Fajitas',
    image: 'https://images.unsplash.com/photo-1625938139268-2b3a75745199?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A sizzling skillet of seasoned chicken, bell peppers, and onions served with warm tortillas and your favorite toppings.',
    cookTime: '25 minutes',
    servings: '4',
    ingredients: [
      { name: 'chicken breast, sliced', metric: { quantity: 500, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'bell peppers, sliced', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'onion, sliced', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'fajita seasoning', metric: { quantity: 1, unit: 'packet' }, us: { quantity: 1, unit: 'packet' } },
      { name: 'Flour tortillas', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
      { name: 'Toppings (salsa, sour cream, guacamole)', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Toss chicken, peppers, and onion with fajita seasoning.', 'Sauté in a hot skillet until chicken is cooked and vegetables are tender-crisp.', 'Serve with warm tortillas and toppings.'],
    tags: ['Mexican', 'Chicken', 'Dinner', 'Quick']
  },
  {
    id: 49,
    title: 'Cheesecake',
    image: 'https://images.unsplash.com/photo-1542826438-c32144d12a2f?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A rich, dense, and creamy dessert with a graham cracker crust and a smooth cream cheese filling.',
    cookTime: '1 hour 15 minutes (+ chilling)',
    servings: '12',
    ingredients: [
      { name: 'graham cracker crumbs', metric: { quantity: 150, unit: 'g' }, us: { quantity: '1 1/2', unit: 'cups' } },
      { name: 'melted butter', metric: { quantity: 113, unit: 'g' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'packages cream cheese, softened', metric: { quantity: 4, unit: '(225g each)' }, us: { quantity: 4, unit: '(8 oz each)' } },
      { name: 'sugar', metric: { quantity: 200, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'large eggs', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
      { name: 'vanilla extract', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } }
    ],
    instructions: ['Preheat oven to [temp:160:325]. Mix crumbs and butter; press into a springform pan.', 'Beat cream cheese and sugar until smooth. Beat in eggs one at a time, then vanilla.', 'Pour over crust. Bake for 55 minutes.', 'Let cool, then chill for at least 4 hours.'],
    tags: ['Dessert', 'Baking']
  },
  {
    id: 50,
    title: 'Spinach and Feta Stuffed Chicken',
    image: 'https://images.unsplash.com/photo-1604321946356-a3699015119b?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'Juicy chicken breasts filled with a savory mixture of spinach, feta cheese, and garlic, then baked to perfection.',
    cookTime: '30 minutes',
    servings: '4',
    ingredients: [
      { name: 'chicken breasts', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } },
      { name: 'frozen spinach, thawed and squeezed dry', metric: { quantity: 280, unit: 'g' }, us: { quantity: '10', unit: 'oz' } },
      { name: 'feta cheese, crumbled', metric: { quantity: 110, unit: 'g' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'garlic, minced', metric: { quantity: 2, unit: 'cloves' }, us: { quantity: 2, unit: 'cloves' } },
      { name: 'olive oil', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
      { name: 'Salt and pepper', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } }
    ],
    instructions: ['Preheat oven to [temp:200:400].', 'Cut a pocket into the side of each chicken breast.', 'Mix spinach, feta, and garlic. Stuff into the chicken pockets.', 'Season outside of chicken. Sear in an oiled skillet, then bake for 15-20 minutes.'],
    tags: ['Chicken', 'Dinner', 'Healthy']
  },
  {
    id: 51,
    title: 'Vegan Lentil Soup',
    image: 'https://images.unsplash.com/photo-1595333936902-19d5f7203a1b?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A hearty and nutritious vegan soup made with brown lentils, vegetables, and savory herbs. Perfect for a cold day.',
    cookTime: '45 minutes',
    servings: '6',
    ingredients: [
      { name: 'olive oil', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
      { name: 'large onion, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'carrots, diced', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'celery stalks, diced', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'garlic, minced', metric: { quantity: 2, unit: 'cloves' }, us: { quantity: 2, unit: 'cloves' } },
      { name: 'brown or green lentils, rinsed', metric: { quantity: 200, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'vegetable broth', metric: { quantity: 2, unit: 'L' }, us: { quantity: 8, unit: 'cups' } },
      { name: 'diced tomatoes', metric: { quantity: 1, unit: 'can (400g)' }, us: { quantity: 1, unit: 'can (14.5 oz)' } },
      { name: 'dried thyme', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
      { name: 'Salt and pepper to taste', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } }
    ],
    instructions: ['In a large pot, heat olive oil. Sauté onion, carrots, and celery until softened.', 'Add garlic and cook for another minute.', 'Stir in lentils, vegetable broth, diced tomatoes, and thyme.', 'Bring to a boil, then reduce heat and simmer for 30-40 minutes, until lentils are tender.', 'Season with salt and pepper before serving.'],
    tags: ['Vegan', 'Soup', 'Vegetarian', 'Healthy']
  },
  {
    id: 52,
    title: 'Classic Ramen',
    image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A comforting bowl of Japanese ramen with a rich broth, tender noodles, soft-boiled egg, and chashu pork.',
    cookTime: '2 hours',
    servings: '2',
    ingredients: [
      { name: 'fresh ramen noodles', metric: { quantity: 2, unit: 'servings' }, us: { quantity: 2, unit: 'servings' } },
      { name: 'chicken or pork broth', metric: { quantity: 1, unit: 'L' }, us: { quantity: 4, unit: 'cups' } },
      { name: 'chashu pork', metric: { quantity: 2, unit: 'slices' }, us: { quantity: 2, unit: 'slices' } },
      { name: 'soft-boiled eggs', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'Scallions, chopped', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
      { name: 'Nori (seaweed sheets)', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
      { name: 'Soy sauce and mirin to taste', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } }
    ],
    instructions: ['Prepare the broth by simmering it with aromatics like ginger and garlic.', 'Season the broth with soy sauce and mirin.', 'Cook ramen noodles according to package instructions.', 'Assemble the bowls: place noodles in the bottom, pour hot broth over.', 'Top with chashu pork, a halved soft-boiled egg, scallions, and nori.'],
    tags: ['Japanese', 'Noodles', 'Pork', 'Soup']
  },
  {
    id: 53,
    title: 'Quinoa Salad with Roasted Vegetables',
    image: 'https://images.unsplash.com/photo-1512428237938-0f7f637b51e2?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A vibrant and healthy gluten-free salad with fluffy quinoa, roasted sweet potatoes and broccoli, and a lemon-tahini dressing.',
    cookTime: '40 minutes',
    servings: '4',
    ingredients: [
      { name: 'quinoa, rinsed', metric: { quantity: 185, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'water or vegetable broth', metric: { quantity: 480, unit: 'ml' }, us: { quantity: 2, unit: 'cups' } },
      { name: 'large sweet potato, cubed', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'head broccoli, cut into florets', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'olive oil', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
      { name: 'Dressing: tahini', metric: { quantity: 60, unit: 'ml' }, us: { quantity: '1/4', unit: 'cup' } },
      { name: 'Dressing: lemon juice', metric: { quantity: 60, unit: 'ml' }, us: { quantity: '1/4', unit: 'cup' } },
      { name: 'Dressing: water', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
      { name: 'Dressing: garlic', metric: { quantity: 1, unit: 'clove' }, us: { quantity: 1, unit: 'clove' } }
    ],
    instructions: ['Preheat oven to [temp:200:400]. Toss sweet potato and broccoli with olive oil, salt, and pepper. Roast for 20-25 minutes.', 'Cook quinoa with water or broth until liquid is absorbed.', 'Whisk together all dressing ingredients.', 'In a large bowl, combine cooked quinoa, roasted vegetables, and dressing. Toss to combine.'],
    tags: ['Salad', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Healthy']
  },
  {
    id: 54,
    title: 'Shakshuka',
    image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&q=80&w=733&ixlib=rb-4.0.3',
    description: 'A delicious Middle Eastern and North African dish of eggs poached in a flavorful tomato and bell pepper sauce.',
    cookTime: '30 minutes',
    servings: '2-3',
    ingredients: [
      { name: 'olive oil', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
      { name: 'large onion, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'red bell pepper, sliced', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'garlic, minced', metric: { quantity: 3, unit: 'cloves' }, us: { quantity: 3, unit: 'cloves' } },
      { name: 'crushed tomatoes', metric: { quantity: 1, unit: 'can (794g)' }, us: { quantity: 1, unit: 'can (28 oz)' } },
      { name: 'cumin', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
      { name: 'paprika', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
      { name: 'Pinch of cayenne pepper', metric: { quantity: 1, unit: 'pinch' }, us: { quantity: 1, unit: 'pinch' } },
      { name: 'large eggs', metric: { quantity: '4-5', unit: '' }, us: { quantity: '4-5', unit: '' } },
      { name: 'Fresh cilantro or parsley for garnish', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Heat oil in a large skillet. Sauté onion and bell pepper until soft.', 'Add garlic and spices, cook for one minute.', 'Pour in crushed tomatoes, season with salt and pepper. Simmer for 10 minutes.', 'Make wells in the sauce and crack an egg into each one.', 'Cover and cook for 5-8 minutes, until egg whites are set but yolks are still runny.', 'Garnish with fresh herbs and serve with crusty bread.'],
    tags: ['Breakfast', 'Vegetarian', 'Quick', 'Healthy']
  },
  {
    id: 55,
    title: 'Lobster Bisque',
    image: 'https://images.unsplash.com/photo-1625943555412-a89e9071b7e2?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A luxurious, creamy, and smooth soup made from lobster stock, cream, and a hint of sherry.',
    cookTime: '1 hour',
    servings: '4',
    ingredients: [
      { name: 'cooked lobsters (about 680g each)', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '(about 1.5 lbs each)' } },
      { name: 'butter', metric: { quantity: 60, unit: 'ml' }, us: { quantity: 4, unit: 'tbsp' } },
      { name: 'chopped shallots', metric: { quantity: 60, unit: 'ml' }, us: { quantity: '1/4', unit: 'cup' } },
      { name: 'sherry', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
      { name: 'fish or vegetable stock', metric: { quantity: 1.4, unit: 'L' }, us: { quantity: 6, unit: 'cups' } },
      { name: 'heavy cream', metric: { quantity: 240, unit: 'ml' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'Pinch of cayenne pepper', metric: { quantity: 1, unit: 'pinch' }, us: { quantity: 1, unit: 'pinch' } }
    ],
    instructions: ['Remove meat from lobster shells, chop the meat, and set aside. Crush the shells.', 'In a large pot, melt butter and sauté shells and shallots for 5 minutes.', 'Add sherry and cook for 1 minute. Add stock and simmer for 30 minutes.', 'Strain the stock, discarding shells. Return stock to pot.', 'Stir in heavy cream and cayenne. Add lobster meat and heat through. Do not boil.'],
    tags: ['Soup', 'Seafood', 'French']
  },
  {
    id: 56,
    title: 'Gluten-Free Brownies',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'Fudgy, decadent, and completely gluten-free chocolate brownies that are sure to satisfy any sweet tooth.',
    cookTime: '40 minutes',
    servings: '16',
    ingredients: [
      { name: 'gluten-free all-purpose flour', metric: { quantity: 120, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'unsweetened cocoa powder', metric: { quantity: 60, unit: 'g' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'baking powder', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
      { name: 'salt', metric: { quantity: 2.5, unit: 'ml' }, us: { quantity: '1/2', unit: 'tsp' } },
      { name: 'granulated sugar', metric: { quantity: 200, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'melted coconut oil or butter', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'large eggs', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'vanilla extract', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
      { name: 'chocolate chips', metric: { quantity: 170, unit: 'g' }, us: { quantity: 1, unit: 'cup' } }
    ],
    instructions: ['Preheat oven to [temp:175:350]. Grease an 20x20cm (8x8 inch) pan.', 'In a bowl, whisk together flour, cocoa powder, baking powder, and salt.', 'In another bowl, mix sugar, melted oil, eggs, and vanilla.', 'Combine wet and dry ingredients. Fold in chocolate chips.', 'Pour batter into prepared pan and bake for 25-30 minutes.'],
    tags: ['Dessert', 'Baking', 'Gluten-Free']
  },
  {
    id: 57,
    title: 'Black Bean Burgers',
    image: 'https://images.unsplash.com/photo-1598645199656-5219e5e783da?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'Hearty, flavorful, and satisfying vegan burgers made from black beans and spices.',
    cookTime: '30 minutes',
    servings: '4',
    ingredients: [
      { name: 'black beans, rinsed and drained', metric: { quantity: 1, unit: 'can (425g)' }, us: { quantity: 1, unit: 'can (15 oz)' } },
      { name: 'green bell pepper, chopped', metric: { quantity: '1/2', unit: '' }, us: { quantity: '1/2', unit: '' } },
      { name: 'onion, chopped', metric: { quantity: '1/2', unit: '' }, us: { quantity: '1/2', unit: '' } },
      { name: 'garlic', metric: { quantity: 2, unit: 'cloves' }, us: { quantity: 2, unit: 'cloves' } },
      { name: 'chili powder', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
      { name: 'cumin', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
      { name: 'bread crumbs', metric: { quantity: 60, unit: 'g' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'burger buns', metric: { quantity: 4, unit: '' }, us: { quantity: 4, unit: '' } }
    ],
    instructions: ['Preheat oven to [temp:190:375].', 'Mash black beans in a large bowl.', 'Sauté bell pepper, onion, and garlic until soft. Add to black beans.', 'Stir in spices and bread crumbs. Form into 4 patties.', 'Bake for 10 minutes on each side. Serve on buns with your favorite toppings.'],
    tags: ['Vegan', 'Vegetarian', 'Dinner', 'Healthy']
  },
  {
    id: 58,
    title: 'Crème Brûlée',
    image: 'https://images.unsplash.com/photo-1542372403-14c680194896?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A classic French dessert consisting of a rich custard base topped with a contrasting layer of hard caramel.',
    cookTime: '1 hour',
    servings: '4',
    ingredients: [
      { name: 'heavy cream', metric: { quantity: 480, unit: 'ml' }, us: { quantity: 2, unit: 'cups' } },
      { name: 'vanilla bean, split lengthwise', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'large egg yolks', metric: { quantity: 5, unit: '' }, us: { quantity: 5, unit: '' } },
      { name: 'granulated sugar, plus more for topping', metric: { quantity: 100, unit: 'g' }, us: { quantity: '1/2', unit: 'cup' } }
    ],
    instructions: ['Preheat oven to [temp:165:325].', 'Heat cream and vanilla bean in a saucepan until just simmering. Remove from heat and let infuse for 15 minutes.', 'Whisk egg yolks and sugar until pale.', 'Slowly pour the warm cream into the egg mixture, whisking constantly. Strain the custard.', 'Pour into four ramekins. Place in a baking dish and add hot water to come halfway up the sides.', 'Bake for 30-35 minutes. Let cool, then refrigerate for at least 4 hours.', 'Sprinkle sugar on top and caramelize with a kitchen torch.'],
    tags: ['Dessert', 'French', 'Baking']
  },
  {
    id: 59,
    title: 'Vietnamese Pho',
    image: 'https://images.unsplash.com/photo-1585101643922-2826c7a7f451?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A fragrant Vietnamese noodle soup with a savory broth, rice noodles, herbs, and thinly sliced beef or chicken.',
    cookTime: '4 hours',
    servings: '4-6',
    ingredients: [
      { name: 'beef bones', metric: { quantity: 1, unit: 'kg' }, us: { quantity: 2, unit: 'lbs' } },
      { name: 'onion, halved', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'ginger, halved', metric: { quantity: 10, unit: 'cm piece' }, us: { quantity: '4-inch piece', unit: '' } },
      { name: 'Spices: star anise, cloves, cinnamon stick', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
      { name: 'rice noodles', metric: { quantity: 225, unit: 'g' }, us: { quantity: 8, unit: 'oz' } },
      { name: 'sirloin, thinly sliced', metric: { quantity: 450, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'Garnishes: bean sprouts, basil, lime wedges, jalapeños', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Char onion and ginger. Add to a large stockpot with beef bones and spices. Cover with water and simmer for at least 4 hours to create the broth.', 'Strain the broth.', 'Cook rice noodles according to package directions.', 'To serve, place noodles and raw sirloin slices in a bowl. Pour the boiling hot broth over the top (this will cook the beef).', 'Serve immediately with fresh garnishes.'],
    tags: ['Vietnamese', 'Soup', 'Noodles', 'Beef']
  },
  {
    id: 60,
    title: 'Seared Scallops',
    image: 'https://images.unsplash.com/photo-1595000574888-29a25ab58384?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'Perfectly seared sea scallops with a golden-brown crust and a sweet, tender interior. An elegant and quick meal.',
    cookTime: '10 minutes',
    servings: '2',
    ingredients: [
      { name: 'large sea scallops, patted dry', metric: { quantity: 450, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'butter', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
      { name: 'olive oil', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
      { name: 'garlic, minced', metric: { quantity: 2, unit: 'cloves' }, us: { quantity: 2, unit: 'cloves' } },
      { name: 'Juice of 1/2 lemon', metric: { quantity: 0.5, unit: '' }, us: { quantity: 0.5, unit: '' } },
      { name: 'Fresh parsley, chopped', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
      { name: 'Salt and pepper', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } }
    ],
    instructions: ['Season scallops with salt and pepper.', 'Heat butter and oil in a skillet over high heat.', 'Place scallops in the hot pan in a single layer. Sear for 1-2 minutes per side, until golden brown.', 'Add garlic and cook for 30 seconds. Deglaze with lemon juice.', 'Garnish with parsley and serve immediately.'],
    tags: ['Seafood', 'Quick', 'Dinner']
  },
  {
    id: 61,
    title: 'Vegan Chili',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=871&ixlib=rb-4.0.3',
    description: 'A hearty and flavorful plant-based chili packed with beans, vegetables, and warm spices.',
    cookTime: '1 hour',
    servings: '6',
    ingredients: [
      { name: 'olive oil', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
      { name: 'onion, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'bell peppers, chopped', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'garlic, minced', metric: { quantity: 3, unit: 'cloves' }, us: { quantity: 3, unit: 'cloves' } },
      { name: 'kidney beans', metric: { quantity: 1, unit: 'can (425g)' }, us: { quantity: 1, unit: 'can (15 oz)' } },
      { name: 'black beans', metric: { quantity: 1, unit: 'can (425g)' }, us: { quantity: 1, unit: 'can (15 oz)' } },
      { name: 'crushed tomatoes', metric: { quantity: 1, unit: 'can (794g)' }, us: { quantity: 1, unit: 'can (28 oz)' } },
      { name: 'chili powder', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
      { name: 'cumin', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } }
    ],
    instructions: ['Sauté onion and peppers until soft.', 'Add garlic and cook for a minute.', 'Stir in all other ingredients.', 'Bring to a simmer and cook for at least 45 minutes to let flavors meld.', 'Serve with your favorite toppings like avocado or vegan sour cream.'],
    tags: ['Vegan', 'Vegetarian', 'Soup', 'Dinner']
  },
  {
    id: 62,
    title: 'Red Velvet Cake',
    image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd3be?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A striking cake with a mild cocoa flavor and a vibrant red color, topped with a classic cream cheese frosting.',
    cookTime: '1 hour 30 minutes',
    servings: '12',
    ingredients: [
      { name: 'all-purpose flour', metric: { quantity: 300, unit: 'g' }, us: { quantity: '2 1/2', unit: 'cups' } },
      { name: 'sugar', metric: { quantity: 300, unit: 'g' }, us: { quantity: '1 1/2', unit: 'cups' } },
      { name: 'baking soda', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
      { name: 'cocoa powder', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
      { name: 'buttermilk', metric: { quantity: 240, unit: 'ml' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'large eggs', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'vegetable oil', metric: { quantity: 240, unit: 'ml' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'vinegar', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
      { name: 'Red food coloring', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
      { name: 'Cream cheese frosting', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Preheat oven to [temp:175:350].', 'Whisk dry ingredients. In a separate bowl, whisk wet ingredients including food coloring.', 'Combine wet and dry ingredients and mix until smooth.', 'Pour into two 23cm (9-inch) round cake pans.', 'Bake for 30-35 minutes. Cool completely before frosting.'],
    tags: ['Dessert', 'Baking']
  },
  {
    id: 63,
    title: 'General Tso\'s Chicken',
    image: 'https://images.unsplash.com/photo-1628790021966-419c8d553716?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A popular Chinese-American dish featuring crispy fried chicken pieces tossed in a sweet and slightly spicy sauce.',
    cookTime: '30 minutes',
    servings: '4',
    ingredients: [
      { name: 'boneless chicken thighs, cut into chunks', metric: { quantity: 450, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'cornstarch', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'Oil for frying', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
      { name: 'Sauce: soy sauce', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'Sauce: rice vinegar', metric: { quantity: 60, unit: 'ml' }, us: { quantity: '1/4', unit: 'cup' } },
      { name: 'Sauce: sugar', metric: { quantity: 60, unit: 'ml' }, us: { quantity: '1/4', unit: 'cup' } },
      { name: 'Sauce: garlic, minced', metric: { quantity: 2, unit: 'cloves' }, us: { quantity: 2, unit: 'cloves' } },
      { name: 'Sauce: Dried red chilies', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Toss chicken in cornstarch.', 'Fry chicken in hot oil until golden and crispy. Drain and set aside.', 'In a separate pan, combine all sauce ingredients and bring to a simmer.', 'Thicken sauce with a cornstarch slurry if needed.', 'Toss the crispy chicken in the sauce to coat evenly. Serve with steamed broccoli and rice.'],
    tags: ['Chinese', 'Chicken', 'Dinner']
  },
  {
    id: 64,
    title: 'Acai Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1562142259-2268b3c9b0e2?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A thick, creamy, and antioxidant-rich smoothie bowl made with acai berries and topped with fresh fruit, granola, and seeds.',
    cookTime: '5 minutes',
    servings: '1',
    ingredients: [
      { name: 'frozen acai puree', metric: { quantity: 1, unit: 'packet' }, us: { quantity: 1, unit: 'packet' } },
      { name: 'frozen banana', metric: { quantity: '1/2', unit: '' }, us: { quantity: '1/2', unit: '' } },
      { name: 'almond milk', metric: { quantity: 60, unit: 'ml' }, us: { quantity: '1/4', unit: 'cup' } },
      { name: 'Toppings: granola, sliced banana, berries, chia seeds, coconut flakes', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Blend the frozen acai, frozen banana, and almond milk until thick and smooth.', 'Pour into a bowl.', 'Arrange your favorite toppings neatly over the surface.', 'Serve immediately and enjoy with a spoon.'],
    tags: ['Breakfast', 'Vegan', 'Healthy', 'Quick', 'Gluten-Free']
  },
  {
    id: 65,
    title: 'Chicken Alfredo',
    image: 'https://images.unsplash.com/photo-1627042582795-35c85671a68c?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A classic Italian-American pasta dish with fettuccine noodles tossed in a rich and creamy Parmesan cheese sauce.',
    cookTime: '25 minutes',
    servings: '4',
    ingredients: [
      { name: 'fettuccine', metric: { quantity: 450, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'chicken breast, sliced', metric: { quantity: 450, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'butter', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
      { name: 'garlic, minced', metric: { quantity: 2, unit: 'cloves' }, us: { quantity: 2, unit: 'cloves' } },
      { name: 'heavy cream', metric: { quantity: 360, unit: 'ml' }, us: { quantity: '1 1/2', unit: 'cups' } },
      { name: 'grated Parmesan cheese', metric: { quantity: 170, unit: 'g' }, us: { quantity: '1 1/2', unit: 'cups' } },
      { name: 'Salt, pepper, and fresh parsley', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } }
    ],
    instructions: ['Cook fettuccine according to package directions.', 'Season and cook chicken slices in a skillet until done. Set aside.', 'In the same skillet, melt butter and sauté garlic. Add heavy cream and bring to a simmer.', 'Stir in Parmesan cheese until the sauce is smooth and thick.', 'Combine sauce with pasta and chicken. Garnish with parsley.'],
    tags: ['Italian', 'Pasta', 'Chicken', 'Dinner']
  },
  {
    id: 66,
    title: 'Kimchi Fried Rice',
    image: 'https://images.unsplash.com/photo-1599558156182-143615951864?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A flavorful and spicy Korean fried rice dish made with tangy kimchi, rice, and often topped with a fried egg.',
    cookTime: '15 minutes',
    servings: '2',
    ingredients: [
      { name: 'cooked, chilled rice', metric: { quantity: 370, unit: 'g' }, us: { quantity: 2, unit: 'cups' } },
      { name: 'chopped kimchi', metric: { quantity: 150, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'kimchi juice', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
      { name: 'soy sauce', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
      { name: 'sesame oil', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
      { name: 'green onion, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'fried eggs for topping', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } }
    ],
    instructions: ['Heat a little oil in a wok or large skillet.', 'Add kimchi and cook for a few minutes until it starts to caramelize.', 'Add the chilled rice and break it up. Stir-fry for a few minutes.', 'Stir in kimchi juice, soy sauce, and sesame oil.', 'Top with green onions and a fried egg before serving.'],
    tags: ['Korean', 'Quick', 'Vegetarian']
  },
  {
    id: 67,
    title: 'Classic Mojito',
    image: 'https://images.unsplash.com/photo-1607613169427-58a432c68a18?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A refreshing Cuban highball cocktail with white rum, sugar, lime juice, soda water, and mint.',
    cookTime: '5 minutes',
    servings: '1',
    ingredients: [
      { name: 'fresh mint leaves', metric: { quantity: '6-8', unit: '' }, us: { quantity: '6-8', unit: '' } },
      { name: 'sugar', metric: { quantity: 10, unit: 'ml' }, us: { quantity: 2, unit: 'tsp' } },
      { name: 'Juice of 1 lime', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'white rum', metric: { quantity: 60, unit: 'ml' }, us: { quantity: 2, unit: 'oz' } },
      { name: 'Club soda', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } },
      { name: 'Ice', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['In a sturdy glass, muddle the mint leaves with the sugar and lime juice.', 'Fill the glass with ice.', 'Pour in the rum and top off with club soda.', 'Stir gently and garnish with a lime wedge and a mint sprig.'],
    tags: ['Drink', 'Quick']
  },
  {
    id: 68,
    title: 'Moussaka',
    image: 'https://images.unsplash.com/photo-1554722530-9a3e6de6522c?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A classic Greek casserole made with layers of eggplant, a spiced meat filling, and a creamy béchamel sauce.',
    cookTime: '1 hour 45 minutes',
    servings: '6',
    ingredients: [
      { name: 'large eggplants, sliced', metric: { quantity: 2, unit: '' }, us: { quantity: 2, unit: '' } },
      { name: 'ground lamb or beef', metric: { quantity: 450, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'onion, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'garlic, minced', metric: { quantity: 2, unit: 'cloves' }, us: { quantity: 2, unit: 'cloves' } },
      { name: 'crushed tomatoes', metric: { quantity: 1, unit: 'can (425g)' }, us: { quantity: 1, unit: 'can (15 oz)' } },
      { name: 'red wine', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'cinnamon', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } },
      { name: 'For Béchamel: butter', metric: { quantity: 60, unit: 'ml' }, us: { quantity: 4, unit: 'tbsp' } },
      { name: 'For Béchamel: flour', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'For Béchamel: milk', metric: { quantity: 480, unit: 'ml' }, us: { quantity: 2, unit: 'cups' } },
      { name: 'For Béchamel: nutmeg', metric: { quantity: 1, unit: 'pinch' }, us: { quantity: 1, unit: 'pinch' } }
    ],
    instructions: ['Salt eggplant slices and let them sit, then rinse and pat dry. Fry or bake until golden.', 'Brown the meat with onion and garlic. Add tomatoes, wine, and cinnamon. Simmer until thick.', 'Make the béchamel sauce by creating a roux with butter and flour, then whisking in milk until thick.', 'Layer eggplant and meat sauce in a baking dish. Top with béchamel.', 'Bake at [temp:175:350] for 45-60 minutes until golden and bubbly.'],
    tags: ['Greek', 'Dinner', 'Beef']
  },
  {
    id: 69,
    title: 'Ceviche',
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c847?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A refreshing Latin American dish of raw fish cured in fresh citrus juices, spiced with chili peppers and other seasonings.',
    cookTime: '20 minutes (+ marinating)',
    servings: '4',
    ingredients: [
      { name: 'fresh white fish (like sea bass or halibut), cubed', metric: { quantity: 450, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'fresh lime juice', metric: { quantity: 240, unit: 'ml' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'red onion, thinly sliced', metric: { quantity: '1/2', unit: '' }, us: { quantity: '1/2', unit: '' } },
      { name: 'jalapeño, minced', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'chopped cilantro', metric: { quantity: 120, unit: 'ml' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'Salt to taste', metric: { quantity: 'to taste', unit: '' }, us: { quantity: 'to taste', unit: '' } }
    ],
    instructions: ['In a glass bowl, combine the fish, lime juice, and onion. The lime juice should cover the fish.', 'Cover and refrigerate for at least 30 minutes, or until the fish becomes opaque and "cooked" through.', 'Gently stir in the jalapeño and cilantro.', 'Season with salt and serve immediately with tortilla chips or plantain chips.'],
    tags: ['Seafood', 'Appetizer', 'Quick', 'Healthy']
  },
  {
    id: 70,
    title: 'Paella',
    image: 'https://images.unsplash.com/photo-1575252195209-a0a19451d696?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A classic Spanish rice dish from Valencia, made in a wide, shallow pan and traditionally loaded with saffron, vegetables, chicken, and seafood.',
    cookTime: '1 hour',
    servings: '6',
    ingredients: [
      { name: 'chicken thighs, cut into pieces', metric: { quantity: 450, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'chorizo sausage, sliced', metric: { quantity: 225, unit: 'g' }, us: { quantity: '1/2', unit: 'lb' } },
      { name: 'shrimp, peeled', metric: { quantity: 450, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'mussels', metric: { quantity: 450, unit: 'g' }, us: { quantity: 1, unit: 'lb' } },
      { name: 'onion, chopped', metric: { quantity: 1, unit: '' }, us: { quantity: 1, unit: '' } },
      { name: 'garlic, minced', metric: { quantity: 4, unit: 'cloves' }, us: { quantity: 4, unit: 'cloves' } },
      { name: 'diced tomatoes', metric: { quantity: 1, unit: 'can (425g)' }, us: { quantity: 1, unit: 'can (15 oz)' } },
      { name: 'chicken broth', metric: { quantity: 1, unit: 'L' }, us: { quantity: 4, unit: 'cups' } },
      { name: 'paella rice (like Bomba)', metric: { quantity: 400, unit: 'g' }, us: { quantity: 2, unit: 'cups' } },
      { name: 'Pinch of saffron threads', metric: { quantity: 1, unit: 'pinch' }, us: { quantity: 1, unit: 'pinch' } }
    ],
    instructions: ['Heat olive oil in a paella pan. Brown chicken and chorizo.', 'Sauté onion and garlic. Add tomatoes and cook for 5 minutes.', 'Add rice and stir to coat. Pour in broth and saffron. Bring to a simmer.', 'Arrange shrimp and mussels on top. Do not stir again.', 'Cook for 20-25 minutes until liquid is absorbed. Let it rest for 10 minutes before serving.'],
    tags: ['Spanish', 'Dinner', 'Seafood', 'Chicken'],
    winePairing: {
        suggestion: 'Albariño',
        description: 'This crisp Spanish white wine with notes of citrus and saline is the perfect refreshing partner for a seafood-rich paella.'
    }
  }
];