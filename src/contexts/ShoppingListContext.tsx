import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Meal } from '@/api/mealdb';

interface ShoppingListItem {
  id: string;
  recipeId: string;
  recipeName: string;
  ingredient: string;
  measure: string;
  checked: boolean;
}

interface ShoppingListContextType {
  items: ShoppingListItem[];
  addIngredient: (recipeId: string, recipeName: string, ingredient: string, measure: string) => void;
  addAllIngredients: (recipe: Meal) => void;
  addIngredientsByRecipeId: (recipeId: string) => void;
  removeIngredient: (id: string) => void;
  removeAllFromRecipe: (recipeId: string) => void;
  toggleChecked: (id: string) => void;
  clearList: () => void;
  isInShoppingList: (recipeId: string, ingredient: string) => boolean;
  isRecipeInShoppingList: (recipeId: string) => boolean;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
}

interface ShoppingListProviderProps {
  children: ReactNode;
}

export function ShoppingListProvider({ children }: ShoppingListProviderProps) {
  const [items, setItems] = useState<ShoppingListItem[]>(() => {
    const savedItems = localStorage.getItem('shoppingList');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const addIngredient = (recipeId: string, recipeName: string, ingredient: string, measure: string) => {
    // Check if ingredient already exists for this recipe
    const exists = items.some(item => 
      item.recipeId === recipeId && item.ingredient.toLowerCase() === ingredient.toLowerCase()
    );

    if (!exists) {
      setItems(prev => [
        ...prev,
        {
          id: `${recipeId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          recipeId,
          recipeName,
          ingredient,
          measure,
          checked: false
        }
      ]);
    }
  };

  const addAllIngredients = (recipe: Meal) => {
    const ingredients: { ingredient: string; measure: string }[] = [];
    
    // Extract all ingredients from the recipe
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}` as keyof Meal] as string;
      const measure = recipe[`strMeasure${i}` as keyof Meal] as string;
      
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure?.trim() || ''
        });
      }
    }

    // Add all ingredients to shopping list
    const newItems = ingredients.map(item => ({
      id: `${recipe.idMeal}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      recipeId: recipe.idMeal,
      recipeName: recipe.strMeal,
      ingredient: item.ingredient,
      measure: item.measure,
      checked: false
    }));

    // Filter out duplicates
    const filteredNewItems = newItems.filter(newItem => 
      !items.some(existingItem => 
        existingItem.recipeId === newItem.recipeId && 
        existingItem.ingredient.toLowerCase() === newItem.ingredient.toLowerCase()
      )
    );

    setItems(prev => [...prev, ...filteredNewItems]);
  };

  const removeIngredient = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const removeAllFromRecipe = (recipeId: string) => {
    setItems(prev => prev.filter(item => item.recipeId !== recipeId));
  };

  const toggleChecked = (id: string) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const clearList = () => {
    setItems([]);
  };

  const isInShoppingList = (recipeId: string, ingredient: string) => {
    return items.some(
      item => item.recipeId === recipeId && item.ingredient.toLowerCase() === ingredient.toLowerCase()
    );
  };

  const isRecipeInShoppingList = (recipeId: string) => {
    return items.some(item => item.recipeId === recipeId);
  };

  const addIngredientsByRecipeId = (recipeId: string) => {
    // Find the recipe in the database or API
    // For now, we'll just add all ingredients from the recipe that's already in the shopping list
    const recipeItems = items.filter(item => item.recipeId === recipeId);
    if (recipeItems.length > 0) {
      const recipeName = recipeItems[0].recipeName;
      // Add all ingredients from this recipe
      // This is a simplified implementation - in a real app, you would fetch the recipe details
      // and then add all ingredients
    }
  };

  const value = {
    items,
    addIngredient,
    addAllIngredients,
    addIngredientsByRecipeId,
    removeIngredient,
    removeAllFromRecipe,
    toggleChecked,
    clearList,
    isInShoppingList,
    isRecipeInShoppingList
  };

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
}