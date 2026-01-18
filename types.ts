
export interface Ingredient {
  id: string;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  kcal: number;
  color: string;
  emoji?: string;
}

export interface AddOn extends Ingredient {
  weightLabel: string;
}

export interface FruitPackItem {
  fruitId: string;
  weight: number;
}

export interface FruitPack {
  id: string;
  name: string;
  items: FruitPackItem[];
  description: string;
  proteinMultiplier?: number;
  tag?: string;
  image?: string;
}

export interface NutritionValues {
  protein: number;
  carbs: number;
  fat: number;
  kcal: number;
}

export interface SmoothieState {
  base: string | null;
  fruitPackId: string | null;
  protein: string | null;
  selectedAddOns: string[];
}

/**
 * Snapshot of a completed smoothie for comparison
 */
export interface SmoothieSnap {
  baseId: string | null;
  fruitPackId: string | null;
  proteinId: string | null;
  selectedAddOns: string[];
  nutrition: NutritionValues;
}
