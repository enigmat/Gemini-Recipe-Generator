import { Recipe } from '../types';

export const newRecipes: Recipe[] = [
  {
    id: 101,
    title: 'Spicy Tuna Crispy Rice',
    image: 'https://images.unsplash.com/photo-1624561172644-856758a01d63?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A trendy and delicious appetizer featuring spicy tuna on a pan-fried crispy rice cake, topped with avocado and serrano.',
    cookTime: '45 minutes',
    servings: '4',
    calories: 'Approx. 450 kcal',
    ingredients: [
      { name: 'sushi rice', metric: { quantity: 185, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'sushi-grade tuna, finely chopped', metric: { quantity: 225, unit: 'g' }, us: { quantity: '1/2', unit: 'lb' } },
      { name: 'sriracha', metric: { quantity: 15, unit: 'ml' }, us: { quantity: 1, unit: 'tbsp' } },
      { name: 'mayonnaise', metric: { quantity: 30, unit: 'ml' }, us: { quantity: 2, unit: 'tbsp' } },
      { name: 'Avocado and serrano slices for topping', metric: { quantity: 'as needed', unit: '' }, us: { quantity: 'as needed', unit: '' } }
    ],
    instructions: ['Cook sushi rice, then press into a pan and chill.', 'Cut chilled rice into squares and pan-fry until crispy.', 'Mix tuna with sriracha and mayonnaise.', 'Top each crispy rice cake with spicy tuna, avocado, and a slice of serrano.'],
    tags: ['Japanese', 'Appetizer', 'Seafood', 'Premium'],
    winePairing: {
      suggestion: 'Sake or a dry Rosé',
      description: 'The crispness of Sake or a dry Rosé cuts through the richness of the spicy tuna and complements the crispy rice texture perfectly.'
    }
  },
  {
    id: 102,
    title: 'Vegan Shepherd\'s Pie',
    image: 'https://images.unsplash.com/photo-1604321946356-a3699015119b?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'A hearty and comforting plant-based version of the classic casserole, with a savory lentil and vegetable filling topped with creamy mashed sweet potatoes.',
    cookTime: '1 hour 15 minutes',
    servings: '6',
    calories: 'Approx. 550 kcal',
    ingredients: [
      { name: 'brown lentils', metric: { quantity: 200, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'vegetable broth', metric: { quantity: 720, unit: 'ml' }, us: { quantity: 3, unit: 'cups' } },
      { name: 'mixed vegetables (carrots, peas, corn)', metric: { quantity: 300, unit: 'g' }, us: { quantity: 2, unit: 'cups' } },
      { name: 'sweet potatoes, peeled and cubed', metric: { quantity: 1, unit: 'kg' }, us: { quantity: 2.2, unit: 'lbs' } },
      { name: 'plant-based milk', metric: { quantity: 60, unit: 'ml' }, us: { quantity: '1/4', unit: 'cup' } }
    ],
    instructions: ['Cook lentils with vegetables and broth until tender and thick.', 'Boil and mash sweet potatoes with plant-based milk.', 'Spread lentil mixture in a baking dish and top with mashed sweet potatoes.', 'Bake at [temp:200:400] for 20 minutes until heated through and golden on top.'],
    tags: ['Vegan', 'Dinner', 'Healthy', 'Premium'],
    winePairing: {
      suggestion: 'Earthy Pinot Noir',
      description: 'An earthy Pinot Noir complements the savory lentil filling without overpowering the subtle sweetness of the sweet potato topping.'
    }
  },
  {
    id: 103,
    title: 'Salted Caramel Cheesecake',
    image: 'https://images.unsplash.com/photo-1542826438-c32144d12a2f?auto=format&fit=crop&q=80&w=870&ixlib=rb-4.0.3',
    description: 'An indulgent, creamy cheesecake with a graham cracker crust, topped with a rich homemade salted caramel sauce.',
    cookTime: '1 hour 30 minutes (+ chilling)',
    servings: '12',
    calories: 'Approx. 550 kcal per slice',
    ingredients: [
      { name: 'graham cracker crumbs', metric: { quantity: 150, unit: 'g' }, us: { quantity: '1 1/2', unit: 'cups' } },
      { name: 'melted butter', metric: { quantity: 113, unit: 'g' }, us: { quantity: '1/2', unit: 'cup' } },
      { name: 'packages cream cheese, softened', metric: { quantity: 4, unit: '(225g each)' }, us: { quantity: 4, unit: '(8 oz each)' } },
      { name: 'sugar', metric: { quantity: 200, unit: 'g' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'heavy cream', metric: { quantity: 240, unit: 'ml' }, us: { quantity: 1, unit: 'cup' } },
      { name: 'sea salt', metric: { quantity: 5, unit: 'ml' }, us: { quantity: 1, unit: 'tsp' } }
    ],
    instructions: ['Make cheesecake base and bake. Let cool, then chill for at least 4 hours.', 'Make caramel sauce by melting sugar, then whisking in cream, butter, and salt.', 'Pour cooled caramel sauce over the chilled cheesecake before serving.'],
    tags: ['Dessert', 'Baking', 'Premium'],
     winePairing: {
      suggestion: 'Late Harvest Riesling or a glass of Tawny Port',
      description: 'The sweetness of a late harvest wine or the nutty complexity of Tawny Port balances the rich, salty caramel and creamy cheesecake.'
    }
  }
];