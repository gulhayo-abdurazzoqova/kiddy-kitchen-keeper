
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Ingredient, Meal, ServingEvent, Alert, Report } from '@/lib/types';
import { 
  mockIngredients, 
  mockMeals, 
  mockServingEvents, 
  mockAlerts, 
  mockReports 
} from '@/lib/mockData';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface KitchenContextType {
  // State
  ingredients: Ingredient[];
  meals: Meal[];
  servingEvents: ServingEvent[];
  alerts: Alert[];
  reports: Report[];
  
  // Actions
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
  updateIngredient: (ingredient: Ingredient) => void;
  deleteIngredient: (id: string) => void;
  
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  updateMeal: (meal: Meal) => void;
  deleteMeal: (id: string) => void;
  
  serveMeal: (mealId: string, portionsCount: number) => boolean;
  getPossiblePortions: (meal: Meal) => number;
  
  markAlertAsRead: (id: string) => void;
}

const KitchenContext = createContext<KitchenContextType | undefined>(undefined);

export const KitchenProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>(mockIngredients);
  const [meals, setMeals] = useState<Meal[]>(mockMeals);
  const [servingEvents, setServingEvents] = useState<ServingEvent[]>(mockServingEvents);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [reports] = useState<Report[]>(mockReports);
  
  // Check for low stock alerts
  useEffect(() => {
    ingredients.forEach(ingredient => {
      if (ingredient.quantity < ingredient.minimumQuantity) {
        const existingAlert = alerts.find(
          alert => 
            alert.type === 'ingredient_low' && 
            alert.message.includes(ingredient.name)
        );
        
        if (!existingAlert) {
          const newAlert: Alert = {
            id: Date.now().toString(),
            type: 'ingredient_low',
            message: `${ingredient.name} stock is below minimum`,
            date: new Date().toISOString(),
            read: false
          };
          
          setAlerts(prev => [...prev, newAlert]);
          
          toast({
            variant: "destructive",
            title: "Low Stock Alert",
            description: newAlert.message,
          });
        }
      }
    });
  }, [ingredients, alerts]);
  
  const addIngredient = (ingredient: Omit<Ingredient, 'id'>) => {
    const newIngredient = {
      ...ingredient,
      id: Date.now().toString()
    };
    setIngredients(prev => [...prev, newIngredient]);
    toast({
      title: "Ingredient Added",
      description: `${ingredient.name} has been added to inventory`,
    });
  };
  
  const updateIngredient = (ingredient: Ingredient) => {
    setIngredients(prev => 
      prev.map(i => i.id === ingredient.id ? ingredient : i)
    );
    toast({
      title: "Ingredient Updated",
      description: `${ingredient.name} has been updated`,
    });
  };
  
  const deleteIngredient = (id: string) => {
    const ingredient = ingredients.find(i => i.id === id);
    if (!ingredient) return;
    
    // First check if any meals use this ingredient
    const mealsUsingIngredient = meals.filter(meal => 
      meal.ingredients.some(mi => mi.ingredientId === id)
    );
    
    if (mealsUsingIngredient.length > 0) {
      toast({
        variant: "destructive",
        title: "Cannot Delete Ingredient",
        description: `${ingredient.name} is used in ${mealsUsingIngredient.length} meal(s)`,
      });
      return;
    }
    
    setIngredients(prev => prev.filter(i => i.id !== id));
    toast({
      title: "Ingredient Deleted",
      description: `${ingredient.name} has been removed from inventory`,
    });
  };
  
  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newMeal = {
      ...meal,
      id: Date.now().toString()
    };
    setMeals(prev => [...prev, newMeal]);
    toast({
      title: "Meal Added",
      description: `${meal.name} has been added to the menu`,
    });
  };
  
  const updateMeal = (meal: Meal) => {
    setMeals(prev => 
      prev.map(m => m.id === meal.id ? meal : m)
    );
    toast({
      title: "Meal Updated",
      description: `${meal.name} has been updated`,
    });
  };
  
  const deleteMeal = (id: string) => {
    const meal = meals.find(m => m.id === id);
    if (!meal) return;
    
    setMeals(prev => prev.filter(m => m.id !== id));
    toast({
      title: "Meal Deleted",
      description: `${meal.name} has been removed from the menu`,
    });
  };
  
  const getPossiblePortions = (meal: Meal): number => {
    if (!meal.ingredients.length) return 0;
    
    return Math.floor(
      Math.min(
        ...meal.ingredients.map(mealIngredient => {
          const ingredient = ingredients.find(i => i.id === mealIngredient.ingredientId);
          if (!ingredient) return 0;
          return Math.floor(ingredient.quantity / mealIngredient.quantity);
        })
      )
    );
  };
  
  const serveMeal = (mealId: string, portionsCount: number): boolean => {
    if (!user) return false;
    
    const meal = meals.find(m => m.id === mealId);
    if (!meal) return false;
    
    // Check if we have enough ingredients
    const possiblePortions = getPossiblePortions(meal);
    if (possiblePortions < portionsCount) {
      toast({
        variant: "destructive",
        title: "Insufficient Ingredients",
        description: `Only ${possiblePortions} portions of ${meal.name} can be prepared with current stock`,
      });
      return false;
    }
    
    // Deduct ingredients
    const updatedIngredients = [...ingredients];
    meal.ingredients.forEach(mealIngredient => {
      const ingredientIndex = updatedIngredients.findIndex(
        i => i.id === mealIngredient.ingredientId
      );
      
      if (ingredientIndex !== -1) {
        updatedIngredients[ingredientIndex] = {
          ...updatedIngredients[ingredientIndex],
          quantity: updatedIngredients[ingredientIndex].quantity - (mealIngredient.quantity * portionsCount)
        };
      }
    });
    
    setIngredients(updatedIngredients);
    
    // Record serving event
    const newServingEvent: ServingEvent = {
      id: Date.now().toString(),
      mealId,
      userId: user.id,
      date: new Date().toISOString(),
      portionsServed: portionsCount
    };
    
    setServingEvents(prev => [...prev, newServingEvent]);
    
    toast({
      title: "Meal Served",
      description: `${portionsCount} portions of ${meal.name} have been served`,
    });
    
    return true;
  };
  
  const markAlertAsRead = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id 
          ? { ...alert, read: true } 
          : alert
      )
    );
  };

  return (
    <KitchenContext.Provider value={{
      ingredients,
      meals,
      servingEvents,
      alerts,
      reports,
      
      addIngredient,
      updateIngredient,
      deleteIngredient,
      
      addMeal,
      updateMeal,
      deleteMeal,
      
      serveMeal,
      getPossiblePortions,
      
      markAlertAsRead
    }}>
      {children}
    </KitchenContext.Provider>
  );
};

export const useKitchen = () => {
  const context = useContext(KitchenContext);
  if (context === undefined) {
    throw new Error('useKitchen must be used within a KitchenProvider');
  }
  return context;
};
