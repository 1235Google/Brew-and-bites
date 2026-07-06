import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Coffee (Hot Brew)',
    description: 'Freshly brewed aromatic dark roast espresso blend, sweetened with gourmet sugarcane nectar.',
    price: 49,
    emoji: '☕',
    category: 'Beverage',
    badge: 'Best Seller',
    bgColor: 'bg-amber-50',
    gradient: 'from-amber-100 to-amber-200 text-amber-900 border-amber-300'
  },
  {
    id: 'm2',
    name: 'Milkshake (Chocolate / Vanilla)',
    description: 'Creamy double-blended rich milkshake layered with cold Belgian chocolate chips and white vanilla bean.',
    price: 129,
    emoji: '🥤',
    category: 'Shake',
    badge: 'Popular',
    bgColor: 'bg-neutral-50',
    gradient: 'from-amber-100 via-rose-100 to-amber-200 text-neutral-900 border-amber-200'
  },
  {
    id: 'm3',
    name: 'Cold Drink (Chilled Refreshment)',
    description: 'Crisp carbonated carbon-filter sparkling lemonade served over ice shards for instant freeze.',
    price: 59,
    emoji: '🧃',
    category: 'Beverage',
    badge: 'Chilled',
    bgColor: 'bg-blue-50',
    gradient: 'from-sky-100 to-blue-200 text-blue-950 border-blue-200'
  },
  {
    id: 'm4',
    name: 'Sandwich (Veg Classic)',
    description: 'Sourdough toast stuffed with layered farmhouse cucumbers, heirloom tomatoes, pesto, and melted cheddar.',
    price: 99,
    emoji: '🥪',
    category: 'Snack',
    badge: 'Healthy Fit',
    bgColor: 'bg-emerald-50',
    gradient: 'from-emerald-100 to-teal-200 text-emerald-950 border-emerald-200'
  },
  {
    id: 'm5',
    name: 'Cake Slice (Chocolate Special)',
    description: 'Five-layer molten dark fudge sponge cake dusted with fine Swiss cacao powder.',
    price: 149,
    emoji: '🍰',
    category: 'Dessert',
    badge: 'Chef Special',
    bgColor: 'bg-pink-50',
    gradient: 'from-rose-100 to-pink-200 text-rose-950 border-pink-200'
  }
];
