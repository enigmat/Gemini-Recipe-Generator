import { Recipe } from '../types';

export const recipes: Recipe[] = [
  {
    title: 'Spicy Gochujang Noodles',
    description: 'A quick, fiery, and deeply flavorful noodle dish featuring the popular Korean chili paste. Perfect for a fast and satisfying weeknight meal.',
    imageUrl: 'https://images.unsplash.com/photo-1626083099243-918455113c4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    ingredients: ['200g ramen or udon noodles', '30g gochujang paste', '15ml soy sauce', '10ml sesame oil', '5g minced garlic', '15g honey or maple syrup', '60ml water', '1 soft-boiled egg', 'Spring onions, chopped', 'Toasted sesame seeds'],
    instructions: [
      'Cook noodles according to package directions. Drain and set aside.',
      'In a small bowl, whisk together gochujang, soy sauce, sesame oil, garlic, honey, and water to create the sauce.',
      'In a skillet or wok over medium heat, pour in the sauce and bring it to a gentle simmer.',
      'Add the cooked noodles to the skillet and toss continuously until every strand is coated in the glossy sauce.',
      'Transfer the noodles to a bowl.',
      'Top with a halved soft-boiled egg, a generous sprinkle of chopped spring onions, and toasted sesame seeds before serving.'
    ],
    tags: ['Premium', 'Spicy', 'Korean', 'Quick & Easy', 'Noodles']
  },
  {
    title: 'Seared Scallops with Lemon-Butter Sauce',
    description: 'Perfectly seared scallops with a golden-brown crust, bathed in a luxurious and tangy lemon-butter pan sauce with fresh herbs.',
    imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5b3834351ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
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
    tags: ['Premium', 'Seafood', 'Elegant', 'Dinner', 'Gluten-Free']
  },
  {
    title: 'Whipped Feta Dip with Roasted Tomatoes',
    description: 'A creamy, tangy, and utterly addictive whipped feta dip topped with sweet, juicy cherry tomatoes roasted with garlic and herbs.',
    imageUrl: 'https://images.unsplash.com/photo-1654922349382-3534e14f1712?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
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
    tags: ['Premium', 'Appetizer', 'Vegetarian', 'Mediterranean', 'Party Food']
  }
];
