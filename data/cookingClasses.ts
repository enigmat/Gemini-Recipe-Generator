import { CookingClass } from '../types';

export const cookingClasses: CookingClass[] = [
  {
    id: 'class1',
    title: 'Mastering Sourdough Bread',
    description: 'From starter to bake, learn the art and science behind creating the perfect loaf of sourdough bread with a chewy crumb and a crispy crust.',
    chef: 'Elena Rossi',
    thumbnailUrl: 'https://images.unsplash.com/photo-1533087352348-154eac765509?auto=format&fit=crop&q=80&w=870',
    steps: [
      { id: 's1', title: 'Lesson 1: Creating & Maintaining Your Starter', duration: '15:30', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
      { id: 's2', title: 'Lesson 2: Mixing, Folding, and Bulk Fermentation', duration: '18:10', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
      { id: 's3', title: 'Lesson 3: Shaping and Proofing', duration: '12:45', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
      { id: 's4', title: 'Lesson 4: Baking the Perfect Loaf', duration: '22:00', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
    ],
  },
  {
    id: 'class2',
    title: 'The Art of French Sauces',
    description: 'Unlock the secrets to the five mother sauces of classical French cuisine, the foundation of countless dishes.',
    chef: 'Jean-Pierre Dubois',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598214886806-2c88b8509d13?auto=format&fit=crop&q=80&w=870',
    steps: [
      { id: 's1', title: 'Lesson 1: Béchamel & Velouté', duration: '14:20', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' },
      { id: 's2', title: 'Lesson 2: Espagnole', duration: '16:55', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
      { id: 's3', title: 'Lesson 3: Sauce Tomate', duration: '13:50', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
      { id: 's4', title: 'Lesson 4: The Emulsion: Hollandaise', duration: '10:15', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
    ],
  },
];
