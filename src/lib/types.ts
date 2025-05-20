
export type Role = 'admin' | 'cook' | 'manager';

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: 'g' | 'kg' | 'ml' | 'l' | 'piece';
  minimumQuantity: number;
  deliveryDate: string;
}

export interface MealIngredient {
  ingredientId: string;
  quantity: number;
}

export interface Meal {
  id: string;
  name: string;
  ingredients: MealIngredient[];
}

export interface ServingEvent {
  id: string;
  mealId: string;
  userId: string;
  date: string;
  portionsServed: number;
}

export interface Report {
  month: string;
  portionsServed: number;
  possiblePortions: number;
  differencePercentage: number;
}

export interface Alert {
  id: string;
  type: 'ingredient_low' | 'potential_misuse';
  message: string;
  date: string;
  read: boolean;
}
