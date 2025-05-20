
import { Ingredient, Meal, User, ServingEvent, Report, Alert } from './types';

// Mock Users
export const mockUsers: User[] = [
  { id: '1', name: 'Admin User', role: 'admin' },
  { id: '2', name: 'Cook User', role: 'cook' },
  { id: '3', name: 'Manager User', role: 'manager' },
];

// Mock Ingredients
export const mockIngredients: Ingredient[] = [
  { id: '1', name: 'Potatoes', quantity: 10000, unit: 'g', minimumQuantity: 2000, deliveryDate: '2025-05-15' },
  { id: '2', name: 'Carrots', quantity: 5000, unit: 'g', minimumQuantity: 1000, deliveryDate: '2025-05-14' },
  { id: '3', name: 'Chicken', quantity: 8000, unit: 'g', minimumQuantity: 2000, deliveryDate: '2025-05-16' },
  { id: '4', name: 'Rice', quantity: 12000, unit: 'g', minimumQuantity: 3000, deliveryDate: '2025-05-13' },
  { id: '5', name: 'Milk', quantity: 8000, unit: 'ml', minimumQuantity: 2000, deliveryDate: '2025-05-17' },
];

// Mock Meals
export const mockMeals: Meal[] = [
  {
    id: '1',
    name: 'Chicken and Rice',
    ingredients: [
      { ingredientId: '3', quantity: 100 }, // 100g of chicken per portion
      { ingredientId: '4', quantity: 80 }, // 80g of rice per portion
    ],
  },
  {
    id: '2',
    name: 'Mashed Potatoes',
    ingredients: [
      { ingredientId: '1', quantity: 150 }, // 150g of potatoes per portion
      { ingredientId: '5', quantity: 50 }, // 50ml of milk per portion
    ],
  },
  {
    id: '3',
    name: 'Vegetable Soup',
    ingredients: [
      { ingredientId: '1', quantity: 100 }, // 100g of potatoes per portion
      { ingredientId: '2', quantity: 80 }, // 80g of carrots per portion
    ],
  },
];

// Mock Serving Events
export const mockServingEvents: ServingEvent[] = [
  { id: '1', mealId: '1', userId: '2', date: '2025-05-18T10:30:00Z', portionsServed: 25 },
  { id: '2', mealId: '2', userId: '2', date: '2025-05-18T12:15:00Z', portionsServed: 20 },
  { id: '3', mealId: '3', userId: '2', date: '2025-05-19T11:00:00Z', portionsServed: 22 },
];

// Mock Reports
export const mockReports: Report[] = [
  { month: '2025-04', portionsServed: 450, possiblePortions: 500, differencePercentage: 10 },
  { month: '2025-03', portionsServed: 480, possiblePortions: 510, differencePercentage: 6 },
  { month: '2025-02', portionsServed: 420, possiblePortions: 500, differencePercentage: 16 },
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  { id: '1', type: 'ingredient_low', message: 'Carrots stock is below minimum', date: '2025-05-19T09:15:00Z', read: false },
  { id: '2', type: 'potential_misuse', message: 'February 2025 - Usage discrepancy exceeds 15%', date: '2025-03-01T08:00:00Z', read: true },
];

// Current user (for authentication mockup)
export let currentUser = mockUsers[0]; // Default to admin
