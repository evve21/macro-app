
import { BASES, FRUITS_MASTER, FRUIT_PACKS, PROTEINS, ADD_ONS, WEIGHTS } from '../constants';
import { NutritionValues, SmoothieState } from '../types';

export const calculateNutrition = (state: SmoothieState): NutritionValues => {
  let protein = 0, carbs = 0, fat = 0, kcal = 0;

  const baseObj = BASES.find(b => b.id === state.base);
  if (baseObj) {
    const factor = WEIGHTS.BASE_VOLUME / 100;
    protein += baseObj.protein * factor;
    carbs += baseObj.carbs * factor;
    fat += baseObj.fat * factor;
    kcal += baseObj.kcal * factor;
  }

  const pack = FRUIT_PACKS.find(p => p.id === state.fruitPackId);
  const multiplier = pack?.proteinMultiplier || 1;

  if (pack) {
    pack.items.forEach(item => {
      const fruit = FRUITS_MASTER.find(f => f.id === item.fruitId);
      if (fruit) {
        const factor = item.weight / 100;
        protein += fruit.protein * factor;
        carbs += fruit.carbs * factor;
        fat += fruit.fat * factor;
        kcal += fruit.kcal * factor;
      }
    });
  }

  const proteinObj = PROTEINS.find(p => p.id === state.protein);
  if (proteinObj) {
    protein += proteinObj.protein * multiplier;
    carbs += proteinObj.carbs * multiplier;
    fat += proteinObj.fat * multiplier;
    kcal += proteinObj.kcal * multiplier;
  }

  if (state.selectedAddOns?.length > 0) {
    state.selectedAddOns.forEach(id => {
      const addOn = ADD_ONS.find(a => a.id === id);
      if (addOn) {
        protein += addOn.protein;
        carbs += addOn.carbs;
        fat += addOn.fat;
        kcal += addOn.kcal;
      }
    });
  }

  return { protein, carbs, fat, kcal };
};

export const formatValue = (val: number): string => {
  if (val > 0 && val < 0.5) return '~';
  return val.toFixed(1);
};
