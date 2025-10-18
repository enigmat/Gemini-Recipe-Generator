import { Recipe } from '../types';

export const recipes: Recipe[] = [
  {
    title: 'Spaghetti Carbonara',
    description: 'A classic Roman pasta dish made with eggs, cheese, pancetta, and black pepper. Incredibly creamy without any cream.',
    imageUrl: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['400g spaghetti', '3 large eggs', '50g grated Pecorino Romano', '50g grated Parmesan', '115g pancetta', '2 cloves garlic', 'Black pepper', 'Salt'],
    instructions: [
      'Bring a large pot of salted water to a boil. Cook spaghetti until al dente.',
      'While pasta cooks, crisp the pancetta in a skillet. Add garlic and cook for 1 minute.',
      'In a bowl, whisk eggs and cheeses. Season with black pepper.',
      'Drain pasta, reserving 240ml of pasta water. Add pasta to the skillet with pancetta.',
      'Remove from heat. Slowly pour in egg mixture, stirring quickly until a creamy sauce forms. Add pasta water if too thick.',
      'Serve immediately with extra cheese and pepper.'
    ],
    tags: ['Pasta', 'Italian', 'Dinner', 'Classic'],
    servings: '4 servings',
    prepTime: '10 minutes',
    cookTime: '20 minutes',
    status: 'active',
    nutrition: {
        calories: '650 kcal',
        protein: '25g',
        carbs: '80g',
        fat: '28g'
    }
  },
  {
    title: 'Classic Tomato Bruschetta',
    description: 'A simple and refreshing Italian appetizer of grilled bread rubbed with garlic and topped with fresh tomatoes, basil, and olive oil.',
    imageUrl: 'https://images.unsplash.com/photo-1576186762373-50553ce33b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['1 baguette', '4 ripe tomatoes', '15g fresh basil', '2 cloves garlic', '30ml olive oil', '15ml balsamic vinegar', 'Salt and pepper'],
    instructions: [
      'Preheat oven to 190°C (375°F). Slice baguette and arrange on a baking sheet.',
      'Toast bread for 10-12 minutes, until golden and crisp.',
      'Dice tomatoes and chop basil. Mince garlic.',
      'In a bowl, combine tomatoes, basil, garlic, olive oil, and balsamic vinegar. Season with salt and pepper.',
      'Rub the toasted bread slices with a whole garlic clove for extra flavor.',
      'Top each slice with the tomato mixture and serve immediately.'
    ],
    tags: ['Appetizer', 'Italian', 'Vegetarian', 'Quick & Easy'],
    servings: '8 servings',
    prepTime: '15 minutes',
    cookTime: '10 minutes',
    status: 'active',
    nutrition: {
        calories: '150 kcal',
        protein: '3g',
        carbs: '20g',
        fat: '6g'
    }
  },
  {
    title: 'Chicken Avocado Salad',
    description: 'A creamy and healthy salad with shredded chicken and avocado, perfect for a light lunch or a filling for sandwiches.',
    imageUrl: 'https://images.unsplash.com/photo-1546793663-3d82791172ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['300g cooked chicken, shredded', '1 large avocado, diced', '40g red onion, finely chopped', '10g cilantro, chopped', '30ml lime juice', 'Salt and pepper to taste'],
    instructions: [
      'In a medium bowl, combine the shredded chicken, diced avocado, chopped red onion, and cilantro.',
      'Drizzle with lime juice.',
      'Gently mix everything together until well combined. Be careful not to mash the avocado too much.',
      'Season with salt and pepper to your liking.',
      'Serve chilled on its own, in a sandwich, or with crackers.'
    ],
    tags: ['Salad', 'Lunch', 'Healthy', 'Gluten-Free', 'Quick & Easy'],
    servings: '3 servings',
    prepTime: '15 minutes',
    cookTime: '0 minutes',
    status: 'active',
    nutrition: {
        calories: '350 kcal',
        protein: '28g',
        carbs: '8g',
        fat: '24g'
    }
  },
  {
    title: 'Simple Beef Tacos',
    description: 'Classic ground beef tacos that are a guaranteed family favorite. Ready in under 30 minutes for a perfect weeknight meal.',
    imageUrl: 'https://images.unsplash.com/photo-1599974579601-216c5b766a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['450g ground beef', '1 packet taco seasoning', '180ml water', '12 hard taco shells', 'Lettuce, shredded', 'Tomatoes, diced', 'Cheddar cheese, shredded', 'Sour cream'],
    instructions: [
      'In a large skillet, cook ground beef over medium-high heat until no longer pink. Drain excess grease.',
      'Stir in taco seasoning and water. Bring to a simmer and cook for 5-7 minutes, until the sauce has thickened.',
      'While the meat is cooking, warm the taco shells according to package directions.',
      'Assemble the tacos by filling each shell with the beef mixture.',
      'Top with lettuce, tomatoes, cheese, and a dollop of sour cream.'
    ],
    tags: ['Dinner', 'Mexican', 'Family-Friendly', 'Quick & Easy'],
    servings: '4 servings',
    prepTime: '10 minutes',
    cookTime: '15 minutes',
    status: 'active',
    nutrition: {
        calories: '450 kcal',
        protein: '22g',
        carbs: '35g',
        fat: '25g'
    }
  },
  {
    title: 'Creamy Tomato Soup',
    description: 'A rich and comforting tomato soup with a velvety texture, perfect for pairing with a grilled cheese sandwich.',
    imageUrl: 'https://images.unsplash.com/photo-1553787499-62a62820b380?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['15ml olive oil', '1 onion, chopped', '2 cloves garlic, minced', '800g can crushed tomatoes', '480ml vegetable broth', '120ml heavy cream', '5g sugar', 'Salt and pepper'],
    instructions: [
        'Heat olive oil in a large pot or Dutch oven over medium heat.',
        'Add onion and cook until softened, about 5 minutes. Stir in garlic and cook for another minute.',
        'Pour in the crushed tomatoes and vegetable broth. Add sugar, salt, and pepper.',
        'Bring to a simmer, then reduce heat and let it cook for 20 minutes.',
        'Use an immersion blender to blend the soup until smooth. Or, carefully transfer in batches to a regular blender.',
        'Stir in the heavy cream and heat through. Do not boil. Serve hot with croutons or grilled cheese.'
    ],
    tags: ['Soup', 'Vegetarian', 'Comfort Food', 'Lunch'],
    servings: '4 servings',
    prepTime: '10 minutes',
    cookTime: '25 minutes',
    status: 'active',
    nutrition: {
        calories: '250 kcal',
        protein: '5g',
        carbs: '20g',
        fat: '18g'
    }
  },
  {
    title: 'Lemon Herb Roasted Chicken',
    description: 'A juicy and flavorful whole roasted chicken with crispy skin, seasoned with fresh lemon, rosemary, and thyme.',
    imageUrl: 'https://images.unsplash.com/photo-1599307739112-883a48a33554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['1 whole chicken (1.8-2.2 kg)', '1 lemon, halved', '4 sprigs fresh rosemary', '4 sprigs fresh thyme', '1 head of garlic, halved', '30ml olive oil', 'Salt and freshly ground black pepper'],
    instructions: [
        'Preheat oven to 220°C (425°F). Pat the chicken dry with paper towels.',
        'Season the chicken generously inside and out with salt and pepper.',
        'Stuff the chicken cavity with the lemon halves, rosemary, thyme, and garlic.',
        'Tie the legs together with kitchen twine and tuck the wing tips under the body of the chicken.',
        'Place the chicken in a roasting pan or large oven-proof skillet. Drizzle with olive oil.',
        'Roast for 1 hour to 1 hour 15 minutes, or until the juices run clear. Let rest for 10-15 minutes before carving.'
    ],
    tags: ['Dinner', 'Roast', 'Gluten-Free', 'Classic'],
    servings: '6 servings',
    prepTime: '15 minutes',
    cookTime: '75 minutes',
    status: 'active',
    nutrition: {
        calories: '700 kcal',
        protein: '65g',
        carbs: '5g',
        fat: '45g'
    }
  },
  {
    title: 'Garlic Butter Shrimp Scampi',
    description: 'A quick and elegant pasta dish with plump shrimp sautéed in a delicious garlic-butter and white wine sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1625944228741-cf3b9b48c138?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['450g linguine', '60g butter', '4 cloves garlic, minced', '450g large shrimp, peeled and deveined', '120ml dry white wine', '15g chopped parsley', 'Juice of 1 lemon', 'Red pepper flakes'],
    instructions: [
        'Cook linguine according to package directions.',
        'In a large skillet, melt butter over medium heat. Add garlic and cook until fragrant, about 30 seconds.',
        'Add shrimp and cook until pink, about 2-3 minutes. Remove shrimp from the skillet.',
        'Pour in white wine and lemon juice. Bring to a simmer and cook for 2 minutes. Season with red pepper flakes.',
        'Return shrimp to the skillet. Stir in parsley.',
        'Add the drained linguine to the skillet and toss to combine. Serve immediately.'
    ],
    tags: ['Pasta', 'Seafood', 'Dinner', 'Quick & Easy', 'Italian'],
    servings: '4 servings',
    prepTime: '10 minutes',
    cookTime: '15 minutes',
    status: 'active',
    nutrition: {
        calories: '550 kcal',
        protein: '30g',
        carbs: '60g',
        fat: '20g'
    }
  },
  {
    title: 'Caprese Salad',
    description: 'The essence of Italian summer on a plate: slices of fresh mozzarella, ripe tomatoes, and sweet basil, seasoned with olive oil and salt.',
    imageUrl: 'https://images.unsplash.com/photo-1579113800032-c38bd7635ba4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['2 large ripe tomatoes', '225g fresh mozzarella cheese', '15g fresh basil leaves', '30ml extra virgin olive oil', '15ml balsamic glaze', 'Salt and freshly ground black pepper'],
    instructions: [
        'Slice the tomatoes and mozzarella into 0.5cm thick rounds.',
        'Arrange alternating slices of tomato and mozzarella on a platter.',
        'Tuck the fresh basil leaves in between the slices.',
        'Drizzle with extra virgin olive oil and balsamic glaze.',
        'Season with salt and pepper to taste.',
        'Serve immediately as a fresh and simple appetizer or side dish.'
    ],
    tags: ['Salad', 'Appetizer', 'Italian', 'Vegetarian', 'Gluten-Free', 'Quick & Easy'],
    servings: '4 servings',
    prepTime: '10 minutes',
    cookTime: '0 minutes',
    status: 'active',
    nutrition: {
        calories: '280 kcal',
        protein: '12g',
        carbs: '6g',
        fat: '22g'
    }
  },
   {
    title: 'Classic Fluffy Pancakes',
    description: 'Light, fluffy, and golden-brown pancakes that are perfect for a weekend breakfast. Serve with your favorite toppings!',
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['180g all-purpose flour', '25g sugar', '10g baking powder', '3g salt', '300ml milk', '1 large egg', '30g melted butter', 'Maple syrup and berries for serving'],
    instructions: [
        'In a large bowl, whisk together flour, sugar, baking powder, and salt.',
        'In a separate bowl, whisk together milk, egg, and melted butter.',
        'Pour the wet ingredients into the dry ingredients and stir until just combined. Do not overmix; a few lumps are okay.',
        'Heat a lightly oiled griddle or frying pan over medium-high heat.',
        'Pour or scoop the batter onto the griddle, using approximately 60ml for each pancake.',
        'Cook until bubbles appear on the surface, then flip and cook until golden brown on the other side.',
        'Serve hot with maple syrup and fresh berries.'
    ],
    tags: ['Breakfast', 'Family-Friendly', 'Quick & Easy', 'Classic'],
    servings: '4 servings',
    prepTime: '10 minutes',
    cookTime: '15 minutes',
    status: 'active',
    nutrition: {
        calories: '300 kcal',
        protein: '8g',
        carbs: '45g',
        fat: '10g'
    }
  },
  {
    title: 'Healthy Quinoa Salad',
    description: 'A vibrant and nutritious quinoa salad packed with fresh vegetables and chickpeas, tossed in a zesty lemon vinaigrette.',
    imageUrl: 'https://images.unsplash.com/photo-1512427691650-15fc38914b1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['185g quinoa, rinsed', '480ml water or vegetable broth', '1 cucumber, diced', '1 bell pepper, diced', '80g red onion, finely chopped', '240g chickpeas, rinsed', '15g chopped parsley', 'Lemon vinaigrette'],
    instructions: [
        'In a medium saucepan, combine rinsed quinoa and water/broth. Bring to a boil.',
        'Reduce heat, cover, and simmer for 15 minutes, or until liquid is absorbed.',
        'Remove from heat and let stand, covered, for 5 minutes. Fluff with a fork and let cool.',
        'In a large bowl, combine the cooled quinoa, cucumber, bell pepper, red onion, chickpeas, and parsley.',
        'Drizzle with lemon vinaigrette and toss to combine.',
        'Serve chilled or at room temperature. It\'s a great make-ahead lunch!'
    ],
    tags: ['Salad', 'Healthy', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Lunch', 'Meal Prep'],
    servings: '4 servings',
    prepTime: '15 minutes',
    cookTime: '20 minutes',
    status: 'active',
    nutrition: {
        calories: '380 kcal',
        protein: '15g',
        carbs: '60g',
        fat: '10g'
    }
  },
  {
    title: 'Ultimate Chocolate Chip Cookies',
    description: 'The best chewy and soft chocolate chip cookies with crispy edges. A timeless classic that everyone loves.',
    imageUrl: 'https://images.unsplash.com/photo-1593289298036-7c98a58a9825?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['225g unsalted butter, softened', '150g granulated sugar', '165g packed brown sugar', '2 large eggs', '5ml vanilla extract', '270g all-purpose flour', '5g baking soda', '3g salt', '340g semi-sweet chocolate chips'],
    instructions: [
        'Preheat oven to 190°C (375°F).',
        'In a large bowl, cream together the softened butter, granulated sugar, and brown sugar until light and fluffy.',
        'Beat in the eggs one at a time, then stir in the vanilla.',
        'In a separate bowl, whisk together the flour, baking soda, and salt. Gradually add the dry ingredients to the wet ingredients and mix until just combined.',
        'Stir in the chocolate chips.',
        'Drop rounded tablespoons of dough onto ungreased baking sheets.',
        'Bake for 9 to 11 minutes, or until the edges are golden brown. Let cool on the baking sheets for a few minutes before transferring to wire racks to cool completely.'
    ],
    tags: ['Dessert', 'Baking', 'Family-Friendly', 'Classic'],
    servings: '24 cookies',
    prepTime: '15 minutes',
    cookTime: '10 minutes',
    status: 'active',
    nutrition: {
        calories: '180 kcal',
        protein: '2g',
        carbs: '22g',
        fat: '10g'
    }
  },
  {
    title: 'Classic Beef Chili',
    description: 'A hearty and flavorful beef chili with beans, tomatoes, and spices. Perfect for a cold day and great for a crowd.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1664478227650-b960975a452a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['450g ground beef', '1 onion, chopped', '2 cloves garlic, minced', '1 (800g) can diced tomatoes', '1 (425g) can kidney beans, rinsed', '1 (425g) can pinto beans, rinsed', '15g chili powder', '2g cumin', 'Salt and pepper to taste'],
    instructions: [
        'In a large pot or Dutch oven, cook the ground beef and onion over medium heat until the beef is browned. Drain excess fat.',
        'Stir in the garlic and cook for one more minute until fragrant.',
        'Add the diced tomatoes (with their juice), kidney beans, pinto beans, chili powder, and cumin.',
        'Season with salt and pepper. Stir everything together.',
        'Bring the chili to a boil, then reduce the heat to low, cover, and simmer for at least 1 hour, stirring occasionally.',
        'Serve hot with your favorite toppings like shredded cheese, sour cream, or chopped onions.'
    ],
    tags: ['Dinner', 'Comfort Food', 'Soup', 'Family-Friendly', 'Meal Prep'],
    servings: '8 servings',
    prepTime: '15 minutes',
    cookTime: '75 minutes',
    status: 'active',
    nutrition: {
        calories: '420 kcal',
        protein: '25g',
        carbs: '40g',
        fat: '18g'
    }
  },
  {
    title: 'Vegan Lentil Soup',
    description: 'A hearty and nutritious vegan soup made with lentils, carrots, celery, and savory herbs. A perfect one-pot meal.',
    imageUrl: 'https://images.unsplash.com/photo-1593254359925-9b56f8595b86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['15ml olive oil', '1 large onion, chopped', '2 carrots, chopped', '2 celery stalks, chopped', '4 cloves garlic, minced', '200g brown or green lentils, rinsed', '1.9L vegetable broth', '1 (410g) can diced tomatoes', '1g dried thyme', '2 bay leaves', 'Salt and pepper to taste'],
    instructions: [
        'Heat olive oil in a large pot or Dutch oven over medium heat. Add onion, carrots, and celery. Cook until softened, about 5-7 minutes.',
        'Stir in garlic and cook for another minute until fragrant.',
        'Add the rinsed lentils, vegetable broth, diced tomatoes, thyme, and bay leaves.',
        'Bring to a boil, then reduce heat and simmer for 45-60 minutes, until lentils are tender.',
        'Remove bay leaves. Season with salt and pepper. For a creamier soup, blend one or two cups and stir it back in.',
        'Serve hot, garnished with fresh parsley.'
    ],
    tags: ['Soup', 'Vegan', 'Vegetarian', 'Healthy', 'Gluten-Free', 'Meal Prep', 'Dinner'],
    servings: '6 servings',
    prepTime: '15 minutes',
    cookTime: '60 minutes',
    status: 'archived',
    nutrition: {
        calories: '280 kcal',
        protein: '15g',
        carbs: '45g',
        fat: '4g'
    }
  },
  {
    title: 'Black Bean Burgers',
    description: 'Flavorful and satisfying homemade black bean burgers that are easy to make and hold together perfectly on the grill or in a pan.',
    imageUrl: 'https://images.unsplash.com/photo-1598585436503-4b65c352a1b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['1 (425g) can black beans, rinsed and drained', '1/2 green bell pepper, chopped', '1/2 onion, chopped', '2 cloves garlic', '1 egg', '60g bread crumbs', '7g chili powder', '2g cumin', 'Salt and pepper'],
    instructions: [
        'Preheat oven to 190°C (375°F). Mash the black beans in a large bowl until thick and pasty.',
        'In a food processor, pulse the bell pepper, onion, and garlic until finely chopped. Add to the mashed beans.',
        'Stir in the egg, bread crumbs, chili powder, cumin, salt, and pepper. Mix until well combined.',
        'Divide the mixture into 4-5 equal portions and shape them into patties.',
        'Place patties on a lightly greased baking sheet. Bake for 10 minutes on each side.',
        'Serve on buns with your favorite burger toppings.'
    ],
    tags: ['Vegetarian', 'Dinner', 'Family-Friendly', 'Healthy'],
    servings: '4 servings',
    prepTime: '15 minutes',
    cookTime: '20 minutes',
    status: 'active',
    nutrition: {
        calories: '320 kcal',
        protein: '14g',
        carbs: '50g',
        fat: '8g'
    }
  },
  {
    title: 'Sheet Pan Lemon Herb Chicken & Veggies',
    description: 'An easy and delicious one-pan meal with tender chicken and roasted vegetables, all seasoned with lemon and herbs.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1673580981944-09855358055c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['4 boneless, skinless chicken breasts', '450g baby potatoes, halved', '450g broccoli florets', '1 red onion, cut into wedges', '2 lemons', '45ml olive oil', '1g dried oregano', '1g dried thyme', 'Salt and pepper'],
    instructions: [
        'Preheat oven to 200°C (400°F).',
        'On a large sheet pan, toss the potatoes and red onion with half the olive oil, salt, and pepper. Roast for 15 minutes.',
        'While potatoes cook, season the chicken with oregano, thyme, salt, and pepper.',
        'Push the potatoes and onions to one side of the pan. Add the chicken to the center and the broccoli to the other side. Drizzle everything with the remaining olive oil and the juice of one lemon.',
        'Roast for another 20-25 minutes, or until the chicken is cooked through and the vegetables are tender.',
        'Squeeze the second lemon over the dish before serving.'
    ],
    tags: ['Dinner', 'One-Pan', 'Healthy', 'Quick & Easy', 'Gluten-Free', 'Meal Prep'],
    servings: '4 servings',
    prepTime: '15 minutes',
    cookTime: '40 minutes',
    status: 'active',
    nutrition: {
        calories: '500 kcal',
        protein: '45g',
        carbs: '30g',
        fat: '22g'
    }
  },
  {
    title: 'Banana Bread',
    description: 'A moist and delicious banana bread recipe that is easy to make and perfect for using up overripe bananas.',
    imageUrl: 'https://images.unsplash.com/photo-1627485850992-cf6753a80f84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['3 ripe bananas, mashed', '115g melted butter', '5g baking soda', 'Pinch of salt', '150g sugar', '1 large egg, beaten', '5ml vanilla extract', '180g all-purpose flour'],
    instructions: [
        'Preheat the oven to 175°C (350°F). Butter and flour a 23x13cm loaf pan.',
        'In a mixing bowl, stir the mashed bananas and melted butter together.',
        'Mix in the baking soda and salt. Stir in the sugar, beaten egg, and vanilla extract.',
        'Mix in the flour until just combined. Do not overmix.',
        'Pour the batter into the prepared loaf pan.',
        'Bake for 50 to 60 minutes, or until a toothpick inserted into the center comes out clean. Let cool in the pan for a few minutes before transferring to a wire rack to cool completely.'
    ],
    tags: ['Baking', 'Dessert', 'Breakfast', 'Family-Friendly', 'Classic'],
    servings: '8 servings',
    prepTime: '10 minutes',
    cookTime: '55 minutes',
    status: 'active',
    nutrition: {
        calories: '320 kcal',
        protein: '4g',
        carbs: '45g',
        fat: '15g'
    }
  },
  {
    title: 'Chicken Tikka Masala',
    description: 'A rich and creamy curry with tender, marinated chicken pieces in a spiced tomato-based sauce. A global favorite for a reason.',
    imageUrl: 'https://images.unsplash.com/photo-1588166421598-a001b332d52d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['500g boneless chicken breast, cubed', '120g plain yogurt', '15ml lemon juice', '5g minced ginger', '5g minced garlic', '3g garam masala', '3g turmeric', '3g cumin powder', '30ml vegetable oil', '1 large onion, chopped', '400g crushed tomatoes', '120ml heavy cream', 'Fresh cilantro for garnish'],
    instructions: [
      'In a bowl, mix yogurt, lemon juice, ginger, garlic, garam masala, turmeric, and cumin. Add chicken and marinate for at least 1 hour.',
      'Heat oil in a large pot. Sauté onion until golden.',
      'Add the marinated chicken and cook until browned on all sides.',
      'Stir in crushed tomatoes and bring to a simmer. Cook for 15-20 minutes, until chicken is cooked through.',
      'Reduce heat and stir in heavy cream. Simmer for another 5 minutes.',
      'Garnish with fresh cilantro and serve with rice or naan bread.'
    ],
    tags: ['Dinner', 'Indian', 'Curry', 'Classic'],
    servings: '4 servings',
    prepTime: '20 minutes',
    cookTime: '30 minutes',
    status: 'active',
    nutrition: {
        calories: '550 kcal',
        protein: '35g',
        carbs: '25g',
        fat: '35g'
    }
  },
  {
    title: 'Thai Green Curry with Chicken',
    description: 'A fragrant and aromatic Thai curry with a perfect balance of spicy, sweet, and savory flavors, featuring coconut milk and fresh basil.',
    imageUrl: 'https://images.unsplash.com/photo-1572455014494-3a681b452a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['400ml coconut milk', '50g green curry paste', '500g boneless chicken breast, sliced', '100g bamboo shoots', '1 red bell pepper, sliced', '15ml fish sauce', '10g sugar', '30g fresh Thai basil leaves', 'Jasmine rice for serving'],
    instructions: [
      'In a wok or large pot, bring half the coconut milk to a simmer. Stir in the green curry paste until fragrant.',
      'Add the chicken and cook until it\'s no longer pink.',
      'Add the remaining coconut milk, bamboo shoots, and red bell pepper. Bring back to a simmer.',
      'Season with fish sauce and sugar. Cook for 5-7 minutes, until vegetables are tender-crisp.',
      'Stir in the Thai basil leaves just before serving.',
      'Serve hot with jasmine rice.'
    ],
    tags: ['Dinner', 'Thai', 'Curry', 'Spicy', 'Quick & Easy'],
    servings: '4 servings',
    prepTime: '15 minutes',
    cookTime: '20 minutes',
    status: 'archived',
    nutrition: {
        calories: '480 kcal',
        protein: '30g',
        carbs: '15g',
        fat: '32g'
    }
  },
  {
    title: 'Quick Salmon Teriyaki',
    description: 'A simple yet elegant Japanese dish featuring pan-seared salmon fillets glazed with a sweet and savory homemade teriyaki sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695d0464?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['4 salmon fillets (150g each)', '30ml vegetable oil', '60ml soy sauce', '60ml mirin', '30g sugar', '5g minced ginger', 'Toasted sesame seeds for garnish', 'Steamed rice and vegetables for serving'],
    instructions: [
      'In a small saucepan, combine soy sauce, mirin, sugar, and ginger. Bring to a simmer and cook for 2-3 minutes until slightly thickened. This is your teriyaki sauce.',
      'Pat the salmon fillets dry and season lightly with salt.',
      'Heat vegetable oil in a skillet over medium-high heat. Place salmon skin-side down and cook for 4-5 minutes until the skin is crispy.',
      'Flip the salmon and cook for another 2-3 minutes.',
      'Pour the teriyaki sauce over the salmon fillets. Cook for 1-2 minutes, spooning the sauce over the fish, until the glaze thickens.',
      'Serve immediately over steamed rice with a side of vegetables, garnished with sesame seeds.'
    ],
    tags: ['Dinner', 'Japanese', 'Seafood', 'Quick & Easy'],
    servings: '4 servings',
    prepTime: '5 minutes',
    cookTime: '15 minutes',
    status: 'active',
    nutrition: {
        calories: '450 kcal',
        protein: '35g',
        carbs: '25g',
        fat: '20g'
    }
  },
  {
    title: 'Classic Guacamole',
    description: 'The perfect party dip. A fresh and flavorful mix of ripe avocados, onion, cilantro, jalapeño, and lime juice.',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c7373014?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['3 ripe avocados', '60g red onion, finely chopped', '1 jalapeño, minced', '15g cilantro, chopped', 'Juice of 1 lime', 'Salt to taste', 'Tortilla chips for serving'],
    instructions: [
      'Halve the avocados, remove the pits, and scoop the flesh into a medium bowl.',
      'Gently mash the avocado with a fork to your desired consistency (chunky or smooth).',
      'Add the chopped red onion, minced jalapeño, and chopped cilantro to the bowl.',
      'Squeeze the lime juice over the mixture.',
      'Season with salt and stir everything together until well combined.',
      'Taste and adjust seasoning if needed. Serve immediately with tortilla chips.'
    ],
    tags: ['Appetizer', 'Mexican', 'Vegan', 'Vegetarian', 'Quick & Easy', 'Party Food'],
    servings: '6 servings',
    prepTime: '10 minutes',
    cookTime: '0 minutes',
    status: 'active',
    nutrition: {
        calories: '150 kcal',
        protein: '2g',
        carbs: '8g',
        fat: '14g'
    }
  },
  {
    title: 'Spicy Kung Pao Chicken',
    description: 'A classic Sichuan stir-fry with tender chicken, crunchy peanuts, and a savory, sweet, and spicy sauce that will tantalize your taste buds.',
    imageUrl: 'https://images.unsplash.com/photo-1599921841793-91e43a22c502?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['500g boneless, skinless chicken breast, cubed', '60ml soy sauce, divided', '10ml Shaoxing wine (or dry sherry)', '5g cornstarch', '30ml black vinegar (or rice vinegar)', '15g sugar', '5ml sesame oil', '30ml vegetable oil', '10 dried red chilies', '5g Sichuan peppercorns', '3 cloves garlic, sliced', '5g ginger, sliced', '1 red bell pepper, diced', '100g roasted unsalted peanuts', '4 spring onions, chopped'],
    instructions: [
      'In a bowl, combine chicken cubes with 15ml of the soy sauce, Shaoxing wine, and cornstarch. Let it marinate for 15 minutes.',
      'In another small bowl, whisk together the remaining 45ml soy sauce, black vinegar, sugar, and sesame oil to create the sauce.',
      'Heat vegetable oil in a wok or large skillet over high heat. Add the dried chilies and Sichuan peppercorns and stir-fry for 30 seconds until fragrant.',
      'Add the marinated chicken and stir-fry until golden and cooked through. Remove from wok.',
      'Add a little more oil if needed. Sauté garlic and ginger until fragrant. Add the bell pepper and cook for 2 minutes until tender-crisp.',
      'Return the chicken to the wok. Pour in the sauce and bring to a boil, stirring until the sauce thickens.',
      'Stir in the peanuts and spring onions. Serve immediately with steamed rice.'
    ],
    tags: ['Dinner', 'Asian', 'Chinese', 'Spicy', 'Stir-fry'],
    servings: '4 servings',
    prepTime: '20 minutes',
    cookTime: '15 minutes',
    status: 'active',
    nutrition: {
        calories: '520 kcal',
        protein: '35g',
        carbs: '25g',
        fat: '30g'
    }
  },
  {
    title: 'Authentic Jamaican Jerk Chicken',
    description: 'Smoky, spicy, and incredibly flavorful chicken marinated in a traditional blend of allspice, scotch bonnet peppers, and herbs, then grilled to perfection.',
    imageUrl: 'https://images.unsplash.com/photo-1610341951557-b3609cb5a697?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['1.5kg chicken pieces (thighs and drumsticks)', '2 scotch bonnet peppers, minced', '4 spring onions, chopped', '3 cloves garlic, chopped', '15g fresh thyme leaves', '10g ground allspice', '5g ground nutmeg', '5g cinnamon powder', '60ml soy sauce', '30ml olive oil', 'Juice of 1 lime'],
    instructions: [
      'To make the jerk marinade, combine scotch bonnet peppers, spring onions, garlic, thyme, allspice, nutmeg, cinnamon, soy sauce, olive oil, and lime juice in a blender.',
      'Blend until you have a relatively smooth paste. Be careful when handling scotch bonnet peppers.',
      'Place the chicken pieces in a large bowl or resealable bag. Pour the marinade over the chicken, ensuring every piece is well-coated. Marinate in the refrigerator for at least 4 hours, or preferably overnight.',
      'Preheat your grill to medium-high heat. You can also use an oven at 200°C (400°F).',
      'Grill the chicken for 20-30 minutes, turning occasionally, until cooked through and slightly charred on the outside. If baking, place on a rack over a baking sheet and bake for 35-45 minutes.',
      'Let the chicken rest for a few minutes before serving. Traditionally served with rice and peas.'
    ],
    tags: ['Dinner', 'Jamaican', 'Caribbean', 'Spicy', 'Grill'],
    servings: '6 servings',
    prepTime: '15 minutes',
    cookTime: '30 minutes',
    status: 'active',
    nutrition: {
        calories: '600 kcal',
        protein: '55g',
        carbs: '10g',
        fat: '38g'
    }
  },
  {
    title: 'Spicy Gochujang Noodles',
    description: 'A quick, fiery, and deeply flavorful noodle dish featuring the popular Korean chili paste. Perfect for a fast and satisfying weeknight meal.',
    imageUrl: 'https://images.unsplash.com/photo-1626804476268-3ff4a06d6b6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['200g ramen or udon noodles', '30g gochujang paste', '15ml soy sauce', '10ml sesame oil', '5g minced garlic', '15g honey or maple syrup', '60ml water', '1 soft-boiled egg', 'Spring onions, chopped', 'Toasted sesame seeds'],
    instructions: [
      'Cook noodles according to package directions. Drain and set aside.',
      'In a small bowl, whisk together gochujang, soy sauce, sesame oil, garlic, honey, and water to create the sauce.',
      'In a skillet or wok over medium heat, pour in the sauce and bring it to a gentle simmer.',
      'Add the cooked noodles to the skillet and toss continuously until every strand is coated in the glossy sauce.',
      'Transfer the noodles to a bowl.',
      'Top with a halved soft-boiled egg, a generous sprinkle of chopped spring onions, and toasted sesame seeds before serving.'
    ],
    tags: ['Premium', 'Spicy', 'Korean', 'Quick & Easy', 'Noodles'],
    servings: '2 servings',
    prepTime: '5 minutes',
    cookTime: '10 minutes',
    status: 'new_this_month',
    nutrition: {
        calories: '550 kcal',
        protein: '15g',
        carbs: '95g',
        fat: '12g'
    }
  },
  {
    title: 'Seared Scallops with Lemon-Butter Sauce',
    description: 'Perfectly seared scallops with a golden-brown crust, bathed in a luxurious and tangy lemon-butter pan sauce with fresh herbs.',
    imageUrl: 'https://images.unsplash.com/photo-1587116861219-230ac19df9a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['450g large sea scallops', 'Salt and black pepper', '30ml olive oil', '45g unsalted butter', '3 cloves garlic, minced', '60ml dry white wine', 'Juice of 1 lemon', '15g fresh parsley, chopped'],
    instructions: [
      'Pat the scallops completely dry with paper towels and season both sides with salt and pepper.',
      'Heat olive oil in a large skillet over high heat until shimmering.',
      'Carefully place scallops in the hot skillet in a single layer, ensuring they don\'t touch. Sear for 1.5-2 minutes per side, until a deep golden-brown crust forms.',
      'Remove scallops from the skillet and set aside.',
      'Reduce heat to medium. Add butter to the skillet. Once melted, add garlic and cook for 30 seconds until fragrant.',
      'Pour in the white wine to deglaze the pan, scraping up any browned bits. Let it simmer for 1 minute.',
      'Stir in the lemon juice and parsley. Return the scallops to the pan and toss to coat in the sauce.',
      'Serve immediately, spooning extra sauce over the top.'
    ],
    tags: ['Premium', 'Seafood', 'Elegant', 'Dinner', 'Gluten-Free'],
    servings: '4 servings',
    prepTime: '10 minutes',
    cookTime: '10 minutes',
    status: 'new_this_month',
    nutrition: {
        calories: '380 kcal',
        protein: '30g',
        carbs: '5g',
        fat: '25g'
    }
  },
  {
    title: 'Whipped Feta Dip with Roasted Tomatoes',
    description: 'A creamy, tangy, and utterly addictive whipped feta dip topped with sweet, juicy cherry tomatoes roasted with garlic and herbs.',
    imageUrl: 'https://images.unsplash.com/photo-1630175841699-9f743c75d421?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['200g block of feta cheese', '85g cream cheese', '60ml extra virgin olive oil', '1 clove garlic', 'Juice of half a lemon', '250g cherry tomatoes', '2 cloves garlic, smashed', 'Fresh thyme sprigs', 'Pita bread or crackers for serving'],
    instructions: [
      'Preheat oven to 200°C (400°F).',
      'On a small baking sheet, toss cherry tomatoes with smashed garlic, thyme, and a drizzle of olive oil. Roast for 15-20 minutes until blistered and jammy.',
      'While tomatoes roast, combine feta, cream cheese, olive oil, garlic clove, and lemon juice in a food processor.',
      'Blend on high for 2-3 minutes, scraping down the sides as needed, until the mixture is completely smooth and creamy.',
      'Spread the whipped feta into a shallow bowl, creating a swirl on top.',
      'Once roasted, spoon the warm tomatoes and all their juices over the whipped feta.',
      'Serve immediately with warm pita bread, crostini, or fresh vegetables.'
    ],
    tags: ['Premium', 'Appetizer', 'Vegetarian', 'Mediterranean', 'Party Food'],
    servings: '6 servings',
    prepTime: '10 minutes',
    cookTime: '20 minutes',
    status: 'new_this_month',
    nutrition: {
        calories: '250 kcal',
        protein: '8g',
        carbs: '6g',
        fat: '22g'
    }
  }
];