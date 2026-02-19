const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export interface Meal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate?: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  [key: string]: string | undefined;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface ApiResponse {
  meals: Meal[] | null;
}

export interface CategoriesResponse {
  categories: Category[] | null;
}

// Get random meal
export const getRandomMeal = async (): Promise<Meal | null> => {
  try {
    const response = await fetch(`${BASE_URL}/random.php`);
    const data: ApiResponse = await response.json();
    return data.meals?.[0] || null;
  } catch (error) {
    console.error('Error fetching random meal:', error);
    return null;
  }
};

// Search meals by name
export const searchMealsByName = async (name: string): Promise<Meal[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
    const data: ApiResponse = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error searching meals:', error);
    return [];
  }
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${BASE_URL}/categories.php`);
    const data: CategoriesResponse = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Filter meals by category
export const getMealsByCategory = async (category: string): Promise<Meal[]> => {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    const data: ApiResponse = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error filtering meals by category:', error);
    return [];
  }
};

// Get meal by ID
export const getMealById = async (id: string): Promise<Meal | null> => {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data: ApiResponse = await response.json();
    return data.meals?.[0] || null;
  } catch (error) {
    console.error('Error fetching meal by ID:', error);
    return null;
  }
};

// Helper function to extract ingredients from meal object
export const extractIngredients = (meal: Meal): Array<{ ingredient: string; measure: string }> => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || ''
      });
    }
  }
  return ingredients;
};