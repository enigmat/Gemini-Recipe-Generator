import { Recipe } from '../types';

export const recipes: Recipe[] = [
  {
    title: 'Spaghetti Carbonara',
    description: 'A classic Roman pasta dish made with eggs, cheese, pancetta, and black pepper. Incredibly creamy without any cream.',
    imageUrl: 'https://images.unsplash.com/photo-1608796881204-681349a1d1b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['Spaghetti', '3 large eggs', '1/2 cup grated Pecorino Romano', '1/2 cup grated Parmesan', '4 oz pancetta', '2 cloves garlic', 'Black pepper', 'Salt'],
    instructions: [
      'Bring a large pot of salted water to a boil. Cook spaghetti until al dente.',
      'While pasta cooks, crisp the pancetta in a skillet. Add garlic and cook for 1 minute.',
      'In a bowl, whisk eggs and cheeses. Season with black pepper.',
      'Drain pasta, reserving 1 cup of pasta water. Add pasta to the skillet with pancetta.',
      'Remove from heat. Slowly pour in egg mixture, stirring quickly until a creamy sauce forms. Add pasta water if too thick.',
      'Serve immediately with extra cheese and pepper.'
    ],
    tags: ['Pasta', 'Italian', 'Dinner', 'Classic']
  },
  {
    title: 'Classic Tomato Bruschetta',
    description: 'A simple and refreshing Italian appetizer of grilled bread rubbed with garlic and topped with fresh tomatoes, basil, and olive oil.',
    imageUrl: 'https://images.unsplash.com/photo-1579979119565-3c4155142518?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['Baguette', '4 ripe tomatoes', '1/4 cup fresh basil', '2 cloves garlic', '2 tbsp olive oil', '1 tbsp balsamic vinegar', 'Salt and pepper'],
    instructions: [
      'Preheat oven to 375°F (190°C). Slice baguette and arrange on a baking sheet.',
      'Toast bread for 10-12 minutes, until golden and crisp.',
      'Dice tomatoes and chop basil. Mince garlic.',
      'In a bowl, combine tomatoes, basil, garlic, olive oil, and balsamic vinegar. Season with salt and pepper.',
      'Rub the toasted bread slices with a whole garlic clove for extra flavor.',
      'Top each slice with the tomato mixture and serve immediately.'
    ],
    tags: ['Appetizer', 'Italian', 'Vegetarian', 'Quick & Easy']
  },
  {
    title: 'Chicken Avocado Salad',
    description: 'A creamy and healthy salad with shredded chicken and avocado, perfect for a light lunch or a filling for sandwiches.',
    imageUrl: 'https://images.unsplash.com/photo-1592417817038-d13fd7342605?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['2 cups cooked chicken, shredded', '1 large avocado, diced', '1/4 cup red onion, finely chopped', '1/4 cup cilantro, chopped', '2 tbsp lime juice', 'Salt and pepper to taste'],
    instructions: [
      'In a medium bowl, combine the shredded chicken, diced avocado, chopped red onion, and cilantro.',
      'Drizzle with lime juice.',
      'Gently mix everything together until well combined. Be careful not to mash the avocado too much.',
      'Season with salt and pepper to your liking.',
      'Serve chilled on its own, in a sandwich, or with crackers.'
    ],
    tags: ['Salad', 'Lunch', 'Healthy', 'Gluten-Free', 'Quick & Easy']
  },
  {
    title: 'Simple Beef Tacos',
    description: 'Classic ground beef tacos that are a guaranteed family favorite. Ready in under 30 minutes for a perfect weeknight meal.',
    imageUrl: 'https://images.unsplash.com/photo-1599974579601-216c5b766a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['1 lb ground beef', '1 packet taco seasoning', '3/4 cup water', '12 hard taco shells', 'Lettuce, shredded', 'Tomatoes, diced', 'Cheddar cheese, shredded', 'Sour cream'],
    instructions: [
      'In a large skillet, cook ground beef over medium-high heat until no longer pink. Drain excess grease.',
      'Stir in taco seasoning and water. Bring to a simmer and cook for 5-7 minutes, until the sauce has thickened.',
      'While the meat is cooking, warm the taco shells according to package directions.',
      'Assemble the tacos by filling each shell with the beef mixture.',
      'Top with lettuce, tomatoes, cheese, and a dollop of sour cream.'
    ],
    tags: ['Dinner', 'Mexican', 'Family-Friendly', 'Quick & Easy']
  },
  {
    title: 'Creamy Tomato Soup',
    description: 'A rich and comforting tomato soup with a velvety texture, perfect for pairing with a grilled cheese sandwich.',
    imageUrl: 'https://images.unsplash.com/photo-1553787499-62a62820b380?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['1 tbsp olive oil', '1 onion, chopped', '2 cloves garlic, minced', '28 oz can crushed tomatoes', '2 cups vegetable broth', '1/2 cup heavy cream', '1 tsp sugar', 'Salt and pepper'],
    instructions: [
        'Heat olive oil in a large pot or Dutch oven over medium heat.',
        'Add onion and cook until softened, about 5 minutes. Stir in garlic and cook for another minute.',
        'Pour in the crushed tomatoes and vegetable broth. Add sugar, salt, and pepper.',
        'Bring to a simmer, then reduce heat and let it cook for 20 minutes.',
        'Use an immersion blender to blend the soup until smooth. Or, carefully transfer in batches to a regular blender.',
        'Stir in the heavy cream and heat through. Do not boil. Serve hot with croutons or grilled cheese.'
    ],
    tags: ['Soup', 'Vegetarian', 'Comfort Food', 'Lunch']
  },
  {
    title: 'Lemon Herb Roasted Chicken',
    description: 'A juicy and flavorful whole roasted chicken with crispy skin, seasoned with fresh lemon, rosemary, and thyme.',
    imageUrl: 'https://images.unsplash.com/photo-1599307739112-883a48a33554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['1 whole chicken (4-5 lbs)', '1 lemon, halved', '4 sprigs fresh rosemary', '4 sprigs fresh thyme', '1 head of garlic, halved', '2 tbsp olive oil', 'Salt and freshly ground black pepper'],
    instructions: [
        'Preheat oven to 425°F (220°C). Pat the chicken dry with paper towels.',
        'Season the chicken generously inside and out with salt and pepper.',
        'Stuff the chicken cavity with the lemon halves, rosemary, thyme, and garlic.',
        'Tie the legs together with kitchen twine and tuck the wing tips under the body of the chicken.',
        'Place the chicken in a roasting pan or large oven-proof skillet. Drizzle with olive oil.',
        'Roast for 1 hour to 1 hour 15 minutes, or until the juices run clear. Let rest for 10-15 minutes before carving.'
    ],
    tags: ['Dinner', 'Roast', 'Gluten-Free', 'Classic']
  },
  {
    title: 'Garlic Butter Shrimp Scampi',
    description: 'A quick and elegant pasta dish with plump shrimp sautéed in a delicious garlic-butter and white wine sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1625944228741-cf3b9b48c138?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['1 lb linguine', '4 tbsp butter', '4 cloves garlic, minced', '1 lb large shrimp, peeled and deveined', '1/2 cup dry white wine', '1/4 cup chopped parsley', 'Juice of 1 lemon', 'Red pepper flakes'],
    instructions: [
        'Cook linguine according to package directions.',
        'In a large skillet, melt butter over medium heat. Add garlic and cook until fragrant, about 30 seconds.',
        'Add shrimp and cook until pink, about 2-3 minutes. Remove shrimp from the skillet.',
        'Pour in white wine and lemon juice. Bring to a simmer and cook for 2 minutes. Season with red pepper flakes.',
        'Return shrimp to the skillet. Stir in parsley.',
        'Add the drained linguine to the skillet and toss to combine. Serve immediately.'
    ],
    tags: ['Pasta', 'Seafood', 'Dinner', 'Quick & Easy', 'Italian']
  },
  {
    title: 'Caprese Salad',
    description: 'The essence of Italian summer on a plate: slices of fresh mozzarella, ripe tomatoes, and sweet basil, seasoned with olive oil and salt.',
    imageUrl: 'https://images.unsplash.com/photo-1579113800032-c38bd7635ba4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['2 large ripe tomatoes', '8 oz fresh mozzarella cheese', '1/4 cup fresh basil leaves', '2 tbsp extra virgin olive oil', '1 tbsp balsamic glaze', 'Salt and freshly ground black pepper'],
    instructions: [
        'Slice the tomatoes and mozzarella into 1/4-inch thick rounds.',
        'Arrange alternating slices of tomato and mozzarella on a platter.',
        'Tuck the fresh basil leaves in between the slices.',
        'Drizzle with extra virgin olive oil and balsamic glaze.',
        'Season with salt and pepper to taste.',
        'Serve immediately as a fresh and simple appetizer or side dish.'
    ],
    tags: ['Salad', 'Appetizer', 'Italian', 'Vegetarian', 'Gluten-Free', 'Quick & Easy']
  },
   {
    title: 'Classic Fluffy Pancakes',
    description: 'Light, fluffy, and golden-brown pancakes that are perfect for a weekend breakfast. Serve with your favorite toppings!',
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['1 1/2 cups all-purpose flour', '2 tbsp sugar', '2 tsp baking powder', '1/2 tsp salt', '1 1/4 cups milk', '1 large egg', '2 tbsp melted butter', 'Maple syrup and berries for serving'],
    instructions: [
        'In a large bowl, whisk together flour, sugar, baking powder, and salt.',
        'In a separate bowl, whisk together milk, egg, and melted butter.',
        'Pour the wet ingredients into the dry ingredients and stir until just combined. Do not overmix; a few lumps are okay.',
        'Heat a lightly oiled griddle or frying pan over medium-high heat.',
        'Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake.',
        'Cook until bubbles appear on the surface, then flip and cook until golden brown on the other side.',
        'Serve hot with maple syrup and fresh berries.'
    ],
    tags: ['Breakfast', 'Family-Friendly', 'Quick & Easy', 'Classic']
  },
  {
    title: 'Healthy Quinoa Salad',
    description: 'A vibrant and nutritious quinoa salad packed with fresh vegetables and chickpeas, tossed in a zesty lemon vinaigrette.',
    imageUrl: 'https://images.unsplash.com/photo-1512427691650-15fc38914b1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['1 cup quinoa, rinsed', '2 cups water or vegetable broth', '1 cucumber, diced', '1 bell pepper, diced', '1/2 red onion, finely chopped', '1 cup chickpeas, rinsed', '1/4 cup chopped parsley', 'Lemon vinaigrette'],
    instructions: [
        'In a medium saucepan, combine rinsed quinoa and water/broth. Bring to a boil.',
        'Reduce heat, cover, and simmer for 15 minutes, or until liquid is absorbed.',
        'Remove from heat and let stand, covered, for 5 minutes. Fluff with a fork and let cool.',
        'In a large bowl, combine the cooled quinoa, cucumber, bell pepper, red onion, chickpeas, and parsley.',
        'Drizzle with lemon vinaigrette and toss to combine.',
        'Serve chilled or at room temperature. It\'s a great make-ahead lunch!'
    ],
    tags: ['Salad', 'Healthy', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Lunch', 'Meal Prep']
  },
  {
    title: 'Ultimate Chocolate Chip Cookies',
    description: 'The best chewy and soft chocolate chip cookies with crispy edges. A timeless classic that everyone loves.',
    imageUrl: 'https://images.unsplash.com/photo-1593289298036-7c98a58a9825?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['1 cup unsalted butter, softened', '3/4 cup granulated sugar', '3/4 cup packed brown sugar', '2 large eggs', '1 tsp vanilla extract', '2 1/4 cups all-purpose flour', '1 tsp baking soda', '1/2 tsp salt', '2 cups semi-sweet chocolate chips'],
    instructions: [
        'Preheat oven to 375°F (190°C).',
        'In a large bowl, cream together the softened butter, granulated sugar, and brown sugar until light and fluffy.',
        'Beat in the eggs one at a time, then stir in the vanilla.',
        'In a separate bowl, whisk together the flour, baking soda, and salt. Gradually add the dry ingredients to the wet ingredients and mix until just combined.',
        'Stir in the chocolate chips.',
        'Drop rounded tablespoons of dough onto ungreased baking sheets.',
        'Bake for 9 to 11 minutes, or until the edges are golden brown. Let cool on the baking sheets for a few minutes before transferring to wire racks to cool completely.'
    ],
    tags: ['Dessert', 'Baking', 'Family-Friendly', 'Classic']
  },
  {
    title: 'Classic Beef Chili',
    description: 'A hearty and flavorful beef chili with beans, tomatoes, and spices. Perfect for a cold day and great for a crowd.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1664478227650-b960975a452a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['1 lb ground beef', '1 onion, chopped', '2 cloves garlic, minced', '1 (28 oz) can diced tomatoes', '1 (15 oz) can kidney beans, rinsed', '1 (15 oz) can pinto beans, rinsed', '2 tbsp chili powder', '1 tsp cumin', 'Salt and pepper to taste'],
    instructions: [
        'In a large pot or Dutch oven, cook the ground beef and onion over medium heat until the beef is browned. Drain excess fat.',
        'Stir in the garlic and cook for one more minute until fragrant.',
        'Add the diced tomatoes (with their juice), kidney beans, pinto beans, chili powder, and cumin.',
        'Season with salt and pepper. Stir everything together.',
        'Bring the chili to a boil, then reduce the heat to low, cover, and simmer for at least 1 hour, stirring occasionally.',
        'Serve hot with your favorite toppings like shredded cheese, sour cream, or chopped onions.'
    ],
    tags: ['Dinner', 'Comfort Food', 'Soup', 'Family-Friendly', 'Meal Prep']
  },
  {
    title: 'Vegan Lentil Soup',
    description: 'A hearty and nutritious vegan soup made with lentils, carrots, celery, and savory herbs. A perfect one-pot meal.',
    imageUrl: 'https://images.unsplash.com/photo-1593254359925-9b56f8595b86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['1 tbsp olive oil', '1 large onion, chopped', '2 carrots, chopped', '2 celery stalks, chopped', '4 cloves garlic, minced', '1 cup brown or green lentils, rinsed', '8 cups vegetable broth', '1 (14.5 oz) can diced tomatoes', '1 tsp dried thyme', '2 bay leaves', 'Salt and pepper to taste'],
    instructions: [
        'Heat olive oil in a large pot or Dutch oven over medium heat. Add onion, carrots, and celery. Cook until softened, about 5-7 minutes.',
        'Stir in garlic and cook for another minute until fragrant.',
        'Add the rinsed lentils, vegetable broth, diced tomatoes, thyme, and bay leaves.',
        'Bring to a boil, then reduce heat and simmer for 45-60 minutes, until lentils are tender.',
        'Remove bay leaves. Season with salt and pepper. For a creamier soup, blend one or two cups and stir it back in.',
        'Serve hot, garnished with fresh parsley.'
    ],
    tags: ['Soup', 'Vegan', 'Vegetarian', 'Healthy', 'Gluten-Free', 'Meal Prep', 'Dinner']
  },
  {
    title: 'Black Bean Burgers',
    description: 'Flavorful and satisfying homemade black bean burgers that are easy to make and hold together perfectly on the grill or in a pan.',
    imageUrl: 'https://images.unsplash.com/photo-1598585436503-4b65c352a1b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['1 (15 oz) can black beans, rinsed and drained', '1/2 green bell pepper, chopped', '1/2 onion, chopped', '2 cloves garlic', '1 egg', '1/2 cup bread crumbs', '1 tbsp chili powder', '1 tsp cumin', 'Salt and pepper'],
    instructions: [
        'Preheat oven to 375°F (190°C). Mash the black beans in a large bowl until thick and pasty.',
        'In a food processor, pulse the bell pepper, onion, and garlic until finely chopped. Add to the mashed beans.',
        'Stir in the egg, bread crumbs, chili powder, cumin, salt, and pepper. Mix until well combined.',
        'Divide the mixture into 4-5 equal portions and shape them into patties.',
        'Place patties on a lightly greased baking sheet. Bake for 10 minutes on each side.',
        'Serve on buns with your favorite burger toppings.'
    ],
    tags: ['Vegetarian', 'Dinner', 'Family-Friendly', 'Healthy']
  },
  {
    title: 'Sheet Pan Lemon Herb Chicken & Veggies',
    description: 'An easy and delicious one-pan meal with tender chicken and roasted vegetables, all seasoned with lemon and herbs.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1673580981944-09855358055c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['4 boneless, skinless chicken breasts', '1 lb baby potatoes, halved', '1 lb broccoli florets', '1 red onion, cut into wedges', '2 lemons', '3 tbsp olive oil', '1 tsp dried oregano', '1 tsp dried thyme', 'Salt and pepper'],
    instructions: [
        'Preheat oven to 400°F (200°C).',
        'On a large sheet pan, toss the potatoes and red onion with half the olive oil, salt, and pepper. Roast for 15 minutes.',
        'While potatoes cook, season the chicken with oregano, thyme, salt, and pepper.',
        'Push the potatoes and onions to one side of the pan. Add the chicken to the center and the broccoli to the other side. Drizzle everything with the remaining olive oil and the juice of one lemon.',
        'Roast for another 20-25 minutes, or until the chicken is cooked through and the vegetables are tender.',
        'Squeeze the second lemon over the dish before serving.'
    ],
    tags: ['Dinner', 'One-Pan', 'Healthy', 'Quick & Easy', 'Gluten-Free', 'Meal Prep']
  },
  {
    title: 'Banana Bread',
    description: 'A moist and delicious banana bread recipe that is easy to make and perfect for using up overripe bananas.',
    imageUrl: 'https://images.unsplash.com/photo-1627485850992-cf6753a80f84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['3 ripe bananas, mashed', '1/2 cup melted butter', '1 tsp baking soda', 'Pinch of salt', '3/4 cup sugar', '1 large egg, beaten', '1 tsp vanilla extract', '1 1/2 cups all-purpose flour'],
    instructions: [
        'Preheat the oven to 350°F (175°C). Butter and flour a 9x5-inch loaf pan.',
        'In a mixing bowl, stir the mashed bananas and melted butter together.',
        'Mix in the baking soda and salt. Stir in the sugar, beaten egg, and vanilla extract.',
        'Mix in the flour until just combined. Do not overmix.',
        'Pour the batter into the prepared loaf pan.',
        'Bake for 50 to 60 minutes, or until a toothpick inserted into the center comes out clean. Let cool in the pan for a few minutes before transferring to a wire rack to cool completely.'
    ],
    tags: ['Baking', 'Dessert', 'Breakfast', 'Family-Friendly', 'Classic']
  }
];
