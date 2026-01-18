import { Ingredient, FruitPack, AddOn } from './types';

/**
 * Static data for ingredients and preset mapping.
 */

// Hydration Bases
export const BASES: Ingredient[] = [
  { id: 'almond-milk', name: 'Almond Milk', protein: 0.6, carbs: 1.0, fat: 1.1, kcal: 15, color: '#EFEBE9' },
  { id: 'coconut-water', name: 'Coconut Water', protein: 0.7, carbs: 3.7, fat: 0.2, kcal: 19, color: '#E0F7FA' },
  { id: 'oat-milk', name: 'Oat Milk', protein: 1.0, carbs: 6.5, fat: 1.5, kcal: 45, color: '#FFF8E1' },
  { id: 'almond-oat-soy', name: 'Almond-Oat-Soy Blend', protein: 2.5, carbs: 4.0, fat: 2.0, kcal: 40, color: '#F9FBE7' },
  { id: 'fresh-milk', name: 'Fresh Milk', protein: 3.3, carbs: 4.8, fat: 3.3, kcal: 66, color: '#F5F5F5' },
  { id: 'skim-milk', name: 'Skim Milk', protein: 3.4, carbs: 5.0, fat: 0.3, kcal: 37, color: '#FAFAFA' },
];

// Master Fruit Data
export const FRUITS_MASTER: Ingredient[] = [
  { id: 'pineapple', name: 'Pineapple', protein: 0.5, carbs: 13.1, fat: 0.1, kcal: 50, color: '#FFEB3B', emoji: '🍍' },
  { id: 'mango', name: 'Mango', protein: 0.8, carbs: 15.0, fat: 0.4, kcal: 60, color: '#FFC107', emoji: '🥭' },
  { id: 'soursop', name: 'Soursop', protein: 1.0, carbs: 16.8, fat: 0.3, kcal: 66, color: '#C5E1A5', emoji: '🍈' },
  { id: 'blueberry', name: 'Blueberry', protein: 0.7, carbs: 14.5, fat: 0.3, kcal: 57, color: '#3F51B5', emoji: '🫐' },
  { id: 'strawberry', name: 'Strawberry', protein: 0.7, carbs: 7.7, fat: 0.3, kcal: 32, color: '#E91E63', emoji: '🍓' },
  { id: 'blackberry', name: 'Blackberry', protein: 1.4, carbs: 9.6, fat: 0.5, kcal: 43, color: '#4A148C', emoji: '🍇' },
  { id: 'peach', name: 'Peach', protein: 0.9, carbs: 9.5, fat: 0.3, kcal: 39, color: '#FFAB91', emoji: '🍑' },
  { id: 'beetroot', name: 'Beetroot', protein: 1.6, carbs: 9.6, fat: 0.2, kcal: 43, color: '#880E4F', emoji: '🍠' },
  { id: 'banana', name: 'Banana', protein: 1.1, carbs: 23.0, fat: 0.3, kcal: 89, color: '#FFF176', emoji: '🍌' },
];

// Preset Fruit Packs (Main Fruit Components)
export const FRUIT_PACKS: FruitPack[] = [
  { id: 'green-grenade', name: 'Green Grenade', tag: '2x Protein', proteinMultiplier: 2, description: 'Peach, Mango, Banana (High Carb Fuel)', image: 'https://images.unsplash.com/photo-1543648964-18ab160d3dca?auto=format&fit=crop&w=300&q=80', items: [{ fruitId: 'peach', weight: 50 }, { fruitId: 'mango', weight: 70 }, { fruitId: 'banana', weight: 90 }] },
  { id: 'tropic-thunder', name: 'Tropic Thunder', tag: '2x Protein', proteinMultiplier: 2, description: 'Pineapple, Soursop, Mango (Tropical Mix)', image: 'https://images.unsplash.com/photo-1596701062351-be5f6a21021f?auto=format&fit=crop&w=300&q=80', items: [{ fruitId: 'pineapple', weight: 100 }, { fruitId: 'soursop', weight: 80 }, { fruitId: 'mango', weight: 70 }] },
  { id: 'tropical-dawn', name: 'Tropical Dawn', description: 'Pineapple, Mango, Soursop', image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?auto=format&fit=crop&w=300&q=80', items: [{ fruitId: 'pineapple', weight: 100 }, { fruitId: 'mango', weight: 70 }, { fruitId: 'soursop', weight: 80 }] },
  { id: 'super-berries', name: 'Super Berries', description: 'Blueberry, Strawberry, Blackberry + Banana', image: 'https://images.unsplash.com/photo-1554133682-630449420790?auto=format&fit=crop&w=300&q=80', items: [{ fruitId: 'blueberry', weight: 35 }, { fruitId: 'strawberry', weight: 30 }, { fruitId: 'blackberry', weight: 20 }, { fruitId: 'banana', weight: 90 }] },
  { id: 'super-berries-no-banana', name: 'Super Berries (No Banana)', description: 'Blueberry, Strawberry, Blackberry', image: 'https://images.unsplash.com/photo-1554133682-630449420790?auto=format&fit=crop&w=300&q=80', items: [{ fruitId: 'blueberry', weight: 35 }, { fruitId: 'strawberry', weight: 30 }, { fruitId: 'blackberry', weight: 20 }] },
  { id: 'bpm', name: 'BPM', description: 'Peach, Mango + Banana', image: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&w=300&q=80', items: [{ fruitId: 'peach', weight: 50 }, { fruitId: 'mango', weight: 70 }, { fruitId: 'banana', weight: 90 }] },
  { id: 'bpm-no-banana', name: 'BPM (No Banana)', description: 'Peach, Mango', image: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&w=300&q=80', items: [{ fruitId: 'peach', weight: 50 }, { fruitId: 'mango', weight: 70 }] },
  { id: 'triple-b', name: 'Triple B', description: 'Blueberry, Beetroot + Banana', image: 'https://images.unsplash.com/photo-1628113310821-914c636f0494?auto=format&fit=crop&w=300&q=80', items: [{ fruitId: 'blueberry', weight: 50 }, { fruitId: 'beetroot', weight: 50 }, { fruitId: 'banana', weight: 90 }] },
  { id: 'triple-b-no-banana', name: 'Triple B (No Banana)', description: 'Blueberry, Beetroot', image: 'https://images.unsplash.com/photo-1628113310821-914c636f0494?auto=format&fit=crop&w=300&q=80', items: [{ fruitId: 'blueberry', weight: 50 }, { fruitId: 'beetroot', weight: 50 }] },
  { id: 'red-rooter', name: 'Red Rooter', description: 'Strawberry, Beetroot + Banana', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=300&q=80', items: [{ fruitId: 'strawberry', weight: 70 }, { fruitId: 'beetroot', weight: 50 }, { fruitId: 'banana', weight: 90 }] },
  { id: 'red-rooter-no-banana', name: 'Red Rooter (No Banana)', description: 'Strawberry, Beetroot', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=300&q=80', items: [{ fruitId: 'strawberry', weight: 70 }, { fruitId: 'beetroot', weight: 50 }] },
  { id: 'gorilla', name: 'Gorilla', description: 'Double Banana', image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=300&q=80', items: [{ fruitId: 'banana', weight: 180 }] },
  { id: 'king-kong', name: 'King Kong', tag: '2x Protein', proteinMultiplier: 2, image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=300&q=80', description: 'Double Banana - Double Scoop Active', items: [{ fruitId: 'banana', weight: 180 }] },
  { id: 'godzilla', name: 'Godzilla', tag: '2x Protein', proteinMultiplier: 2, image: 'https://images.unsplash.com/photo-1554133682-630449420790?auto=format&fit=crop&w=300&q=80', description: 'Super Berries Mix - Double Scoop Active', items: [{ fruitId: 'blueberry', weight: 35 }, { fruitId: 'strawberry', weight: 30 }, { fruitId: 'blackberry', weight: 20 }, { fruitId: 'banana', weight: 90 }] },
];

/**
 * MANDATORY EXTRA INGREDIENTS PER PRESET (Non-removable)
 */
export interface ExtraIngredient {
  name: string;
  weight: number;
  p: number;
  c: number;
  f: number;
  kcal: number;
}

export const PRESET_EXTRA: Record<string, ExtraIngredient[]> = {
  gorilla: [
    { name: 'Dates', weight: 12, p: 0.2, c: 9.0, f: 0.0, kcal: 34 },
    { name: 'Chia Seed', weight: 4, p: 0.6, c: 2.3, f: 1.9, kcal: 20 },
    { name: 'Almonds', weight: 5, p: 1.0, c: 1.1, f: 2.2, kcal: 29 }
  ],
  'king-kong': [
    { name: 'Dates', weight: 12, p: 0.2, c: 9.0, f: 0.0, kcal: 34 },
    { name: 'Chia Seed', weight: 4, p: 0.6, c: 2.3, f: 1.9, kcal: 20 },
    { name: 'Almonds', weight: 5, p: 1.0, c: 1.1, f: 2.2, kcal: 29 },
    { name: 'Collagen', weight: 5, p: 4.5, c: 0.0, f: 0.0, kcal: 18 },
    { name: 'Egg-White Powder', weight: 5, p: 4.3, c: 0.0, f: 0.0, kcal: 17 },
    { name: 'Creatine', weight: 5, p: 0.0, c: 0.0, f: 0.0, kcal: 0 },
    { name: 'Rolled Oats', weight: 25, p: 3.4, c: 15.9, f: 2.7, kcal: 97 },
    { name: 'Peanut Butter', weight: 30, p: 7.7, c: 4.8, f: 16.3, kcal: 188 }
  ],
  'super-berries': [
    { name: 'Dates', weight: 12, p: 0.2, c: 9.0, f: 0.0, kcal: 34 },
    { name: 'Chia Seed', weight: 4, p: 0.6, c: 2.3, f: 1.9, kcal: 20 }
  ],
  'super-berries-no-banana': [
    { name: 'Dates', weight: 12, p: 0.2, c: 9.0, f: 0.0, kcal: 34 },
    { name: 'Chia Seed', weight: 4, p: 0.6, c: 2.3, f: 1.9, kcal: 20 }
  ],
  godzilla: [
    { name: 'Dates', weight: 12, p: 0.2, c: 9.0, f: 0.0, kcal: 34 },
    { name: 'Chia Seed', weight: 4, p: 0.6, c: 2.3, f: 1.9, kcal: 20 },
    { name: 'Collagen', weight: 5, p: 4.5, c: 0.0, f: 0.0, kcal: 18 },
    { name: 'Egg-White Powder', weight: 5, p: 4.3, c: 0.0, f: 0.0, kcal: 17 },
    { name: 'Creatine', weight: 5, p: 0.0, c: 0.0, f: 0.0, kcal: 0 },
    { name: 'Rolled Oats', weight: 25, p: 3.4, c: 15.9, f: 2.7, kcal: 97 },
    { name: 'Peanut Butter', weight: 30, p: 7.7, c: 4.8, f: 16.3, kcal: 188 }
  ],
  'tropical-dawn': [
    { name: 'Chia Seed', weight: 4, p: 0.6, c: 2.3, f: 1.9, kcal: 20 },
    { name: 'Honey', weight: 0.5, p: 0.0, c: 0.6, f: 0.0, kcal: 2 }
  ],
  'tropic-thunder': [
    { name: 'Chia Seed', weight: 4, p: 0.6, c: 2.3, f: 1.9, kcal: 20 },
    { name: 'Honey', weight: 0.5, p: 0.0, c: 0.6, f: 0.0, kcal: 2 },
    { name: 'Turmeric', weight: 1.5, p: 0.0, c: 0.3, f: 0.0, kcal: 4 },
    { name: 'Goji Berry', weight: 5, p: 0.1, c: 3.9, f: 0.1, kcal: 19 }
  ],
  bpm: [
    { name: 'Chia Seed', weight: 4, p: 0.6, c: 2.3, f: 1.9, kcal: 20 },
    { name: 'Honey', weight: 0.5, p: 0.0, c: 0.6, f: 0.0, kcal: 2 },
    { name: 'Dates', weight: 12, p: 0.2, c: 9.0, f: 0.0, kcal: 34 }
  ],
  'bpm-no-banana': [
    { name: 'Chia Seed', weight: 4, p: 0.6, c: 2.3, f: 1.9, kcal: 20 },
    { name: 'Honey', weight: 0.5, p: 0.0, c: 0.6, f: 0.0, kcal: 2 },
    { name: 'Dates', weight: 12, p: 0.2, c: 9.0, f: 0.0, kcal: 34 }
  ],
  'green-grenade': [
    { name: 'Chia Seed', weight: 4, p: 0.6, c: 2.3, f: 1.9, kcal: 20 },
    { name: 'Honey', weight: 0.5, p: 0.0, c: 0.6, f: 0.0, kcal: 2 },
    { name: 'Dates', weight: 12, p: 0.2, c: 9.0, f: 0.0, kcal: 34 },
    { name: 'Spirulina', weight: 3.5, p: 2.3, c: 1.0, f: 0.5, kcal: 14 },
    { name: 'Creatine', weight: 5, p: 0.0, c: 0.0, f: 0.0, kcal: 0 }
  ],
  'red-rooter': [
    { name: 'Goji Berry', weight: 5, p: 0.1, c: 3.9, f: 0.1, kcal: 19 },
    { name: 'Dates', weight: 12, p: 0.2, c: 9.0, f: 0.0, kcal: 34 }
  ],
  'red-rooter-no-banana': [
    { name: 'Goji Berry', weight: 5, p: 0.1, c: 3.9, f: 0.1, kcal: 19 },
    { name: 'Dates', weight: 12, p: 0.2, c: 9.0, f: 0.0, kcal: 34 }
  ],
  'triple-b': [
    { name: 'Flax Seed', weight: 4, p: 0.8, c: 1.6, f: 2.0, kcal: 22 }
  ],
  'triple-b-no-banana': [
    { name: 'Flax Seed', weight: 4, p: 0.8, c: 1.6, f: 2.0, kcal: 22 }
  ]
};

// Protein Selection
export const PROTEINS: Ingredient[] = [
  { id: 'platinum-isolate', name: 'Platinum Isolate Synta', protein: 30.0, carbs: 0.6, fat: 0.3, kcal: 122.2, color: '#E0E0E0' },
  { id: 'vegan-vanilla', name: 'Vegan Vanilla (Pea)', protein: 30.0, carbs: 2.4, fat: 1.2, kcal: 138.0, color: '#FDF5E6' },
  { id: 'vegan-chocolate', name: 'Vegan Chocolate (Pea)', protein: 30.0, carbs: 4.4, fat: 1.9, kcal: 150.0, color: '#5D4037' },
  { id: 'unflavored-vegan', name: 'Unflavored Vegan (Pea)', protein: 30.0, carbs: 1.2, fat: 1.2, kcal: 132.0, color: '#F5F5F5' },
  { id: 'gold-vanilla', name: 'Gold Std Vanilla', protein: 30.0, carbs: 3.8, fat: 1.9, kcal: 150.0, color: '#FFF9C4' },
  { id: 'gold-chocolate', name: 'Gold Std Chocolate', protein: 30.0, carbs: 3.8, fat: 1.3, kcal: 150.0, color: '#795548' },
];

// Optional Add-Ons
export const ADD_ONS: AddOn[] = [
  { id: 'goji', name: 'Goji Berry', weightLabel: '5 g', protein: 0.1, carbs: 3.9, fat: 0.1, kcal: 19, color: '#E91E63' },
  // Fix: Renamed property 'f' to 'fat' to match the Ingredient interface.
  { id: 'chia', name: 'Chia Seed', weightLabel: '4 g', protein: 0.6, carbs: 2.3, fat: 1.9, kcal: 20, color: '#2D2D2D' },
  { id: 'flax', name: 'Flax Seed', weightLabel: '4 g', protein: 0.8, carbs: 1.6, fat: 2.0, kcal: 22, color: '#A67C52' },
  { id: 'oat', name: 'Rolled Oat', weightLabel: '25 g', protein: 3.4, carbs: 15.9, fat: 2.7, kcal: 97, color: '#F5F5DC' },
  { id: 'dates', name: 'Dates', weightLabel: '12 g', protein: 0.2, carbs: 9.0, fat: 0.0, kcal: 34, color: '#4E2728' },
  { id: 'honey', name: 'Honey', weightLabel: '0.5 ml', protein: 0.0, carbs: 0.6, fat: 0.0, kcal: 2, color: '#FFD700' },
  { id: 'turmeric', name: 'Turmeric', weightLabel: '1.5 g', protein: 0.0, carbs: 0.3, fat: 0.0, kcal: 4, color: '#FFC30B' },
  { id: 'spirulina', name: 'Spirulina', weightLabel: '3.5 g', protein: 2.3, carbs: 1.0, fat: 0.5, kcal: 14, color: '#006400' },
  { id: 'almonds', name: 'Almonds', weightLabel: '5 g', protein: 1.0, carbs: 1.1, fat: 2.2, kcal: 29, color: '#DEB887' },
  { id: 'cacao', name: 'Cacao Nibs', weightLabel: '4.5 g', protein: 0.9, carbs: 2.2, fat: 2.3, kcal: 25, color: '#3D1F1F' },
  { id: 'walnut', name: 'Walnut', weightLabel: '5 g', protein: 0.8, carbs: 1.0, fat: 3.3, kcal: 33, color: '#8B4513' },
  { id: 'egg-powder', name: 'Egg-White Powder', weightLabel: '5 g', protein: 4.3, carbs: 0.0, fat: 0.0, kcal: 17, color: '#FFFFFF' },
  { id: 'creatine', name: 'Creatine', weightLabel: '5 g', protein: 0.0, carbs: 0.0, fat: 0.0, kcal: 0, color: '#E5E5E5' },
  { id: 'mct', name: 'MCT Oil', weightLabel: '0.5 ml', protein: 0.0, carbs: 0.0, fat: 0.5, kcal: 4, color: '#FFFFFF' },
  { id: 'pb-30', name: 'Peanut Butter', weightLabel: '30 g', protein: 7.7, carbs: 4.8, fat: 16.3, kcal: 188, color: '#CD853F' },
  { id: 'pb-60', name: 'Double Peanut Butter', weightLabel: '60 g', protein: 15.4, carbs: 9.6, fat: 32.6, kcal: 376, color: '#8B4513' },
  { id: 'collagen', name: 'Collagen', weightLabel: '5 g', protein: 4.5, carbs: 0.0, fat: 0.0, kcal: 18, color: '#FFF0F5' },
];

export const WEIGHTS = {
  BASE_VOLUME: 100,
};