
import { searchMealsByName, getMealsByCategory, getRandomMeal, getMealById, Meal } from "@/api/mealdb";

export interface RecipeSuggestion {
    recipeName: string;
    category: string;
    area: string;
    ingredients: { name: string; amount: string }[];
    instructions: string[];
    videoLink?: string;
    image?: string;
    substitutions?: { ingredient: string; alternative: string }[];
    tips?: string[];
    calories?: number;
    dietaryInfo?: {
        vegan: boolean;
        keto: boolean;
        glutenFree: boolean;
        dairyFree: boolean;
    };
    allergens?: string[];
}

export interface MealPlan {
    mealPlan: {
        day: string;
        breakfast: string;
        lunch: string;
        dinner: string;
        calories: number;
    }[];
    shoppingList: string[];
}

interface GroqResponse {
    type: "search" | "category" | "random" | "plan" | "none";
    keyword?: string;
    thinking?: string;
}

interface GroqEnhancementResponse {
    refinedSteps?: string[];
    substitutions?: { ingredient: string; alternative: string }[];
    tips?: string[];
    calories?: number;
    dietaryInfo?: {
        vegan: boolean;
        keto: boolean;
        glutenFree: boolean;
        dairyFree: boolean;
    };
    allergens?: string[];
}

// Set to true only if you have the backend server running
const USE_BACKEND_AI = false;

export const getRecipeSuggestions = async (userQuery: string): Promise<RecipeSuggestion | MealPlan | null> => {
    try {
        let result: GroqResponse;

        // 1. Analyze Intent via Backend (with Fallback)
        try {
            if (!USE_BACKEND_AI) throw new Error('Backend disabled');

            const intentResponse = await fetch('/api/analyze-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userQuery })
            });

            if (!intentResponse.ok) throw new Error('Backend unavailable');
            result = await intentResponse.json();
            console.log("AI Decision:", result);
        } catch (error) {
            if (USE_BACKEND_AI) console.warn("Backend unavailable, using local heuristic:", error);
            // Local fallback logic
            const queryLower = userQuery.toLowerCase();
            if (queryLower.includes('plan') || queryLower.includes('schedule')) {
                result = { type: "plan", keyword: userQuery };
            } else if (queryLower.includes('random')) {
                result = { type: "random" };
            } else {
                // Heuristic: Check if it looks like a category or just a search term
                // For simplicity, treat as search
                result = { type: "search", keyword: userQuery };
            }
        }

        if (result.type === "plan") {
            // Generate Meal Plan via Backend (with Fallback)
            try {
                if (!USE_BACKEND_AI) throw new Error('Backend disabled');

                const planResponse = await fetch('/api/generate-meal-plan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ preferences: result.keyword || userQuery })
                });

                if (!planResponse.ok) throw new Error('Backend unavailable');
                const plan: MealPlan = await planResponse.json();
                return plan;
            } catch (error) {
                if (USE_BACKEND_AI) console.warn("Backend unavailable for meal plan, using mock data:", error);
                // Mock Meal Plan
                return {
                    mealPlan: [
                        { day: "Monday", breakfast: "Oatmeal with Berries", lunch: "Grilled Chicken Salad", dinner: "Creamy Tomato Pasta", calories: 2000 },
                        { day: "Tuesday", breakfast: "Scrambled Eggs & Toast", lunch: "Turkey & Cheese Sandwich", dinner: "Vegetable Stir Fry", calories: 1900 },
                        { day: "Wednesday", breakfast: "Greek Yogurt Parfait", lunch: "Lentil Soup", dinner: "Roasted Chicken & Veggies", calories: 2100 },
                    ],
                    shoppingList: ["Oats", "Berries", "Chicken Breast", "Lettuce", "Tomatoes", "Pasta", "Eggs", "Bread", "Turkey", "Cheese", "Mixed Vegetables", "Yogurt", "Lentils"]
                };
            }
        }

        let meal: Meal | null = null;

        // 2. Execute the action (TheMealDB)
        if (result.type === "random") {
            meal = await getRandomMeal();
        } else if (result.type === "category" && result.keyword) {
            const meals = await getMealsByCategory(result.keyword);
            if (meals && meals.length > 0) {
                const randomMeal = meals[Math.floor(Math.random() * meals.length)];
                // Need full details
                const fullDetails = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randomMeal.idMeal}`)
                    .then(res => res.json())
                    .then(data => data.meals?.[0]);
                meal = fullDetails;
            }
        } else if (result.type === "search" && result.keyword) {
            const meals = await searchMealsByName(result.keyword);
            if (meals && meals.length > 0) {
                meal = meals[0];
            }
        }

        if (!meal) return null;

        // 3. Format the response
        const baseSuggestion = formatMealToSuggestion(meal);

        // 4. Enhance via Backend (with Fallback)
        try {
            if (!USE_BACKEND_AI) throw new Error('Backend disabled');

            const enhanceResponse = await fetch('/api/enhance-recipe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipeName: baseSuggestion.recipeName,
                    ingredients: baseSuggestion.ingredients.map(i => `${i.amount} ${i.name}`),
                    instructions: baseSuggestion.instructions.join('\n')
                })
            });

            if (enhanceResponse.ok) {
                const enhancement: GroqEnhancementResponse = await enhanceResponse.json();
                // ... map enhancement ...
                if (enhancement.refinedSteps && enhancement.refinedSteps.length > 0) baseSuggestion.instructions = enhancement.refinedSteps;
                if (enhancement.substitutions) baseSuggestion.substitutions = enhancement.substitutions;
                if (enhancement.tips) baseSuggestion.tips = enhancement.tips;
                if (enhancement.calories) baseSuggestion.calories = enhancement.calories;
                if (enhancement.dietaryInfo) baseSuggestion.dietaryInfo = enhancement.dietaryInfo;
                if (enhancement.allergens) baseSuggestion.allergens = enhancement.allergens;
            }
        } catch (enhancementError) {
            // Silently fail enhancement if backend is missing, just use base suggestion
            if (USE_BACKEND_AI) console.log("Skipping AI enhancement (backend unavailable)");
        }

        return baseSuggestion;

    } catch (error) {
        console.error("Error getting recipe suggestions:", error);
        return null;
    }
};

const formatMealToSuggestion = (meal: Meal): RecipeSuggestion => {
    const ingredients: { name: string; amount: string }[] = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}` as keyof Meal];
        const measure = meal[`strMeasure${i}` as keyof Meal];

        if (ingredient && typeof ingredient === 'string' && ingredient.trim()) {
            ingredients.push({
                name: ingredient.trim(),
                amount: (typeof measure === 'string' ? measure.trim() : '')
            });
        }
    }

    const instructions = meal.strInstructions
        ? meal.strInstructions.split(/\r\n|\n/).filter(step => step.trim().length > 0)
        : [];

    return {
        recipeName: meal.strMeal,
        category: meal.strCategory,
        area: meal.strArea,
        ingredients,
        instructions,
        videoLink: meal.strYoutube,
        image: meal.strMealThumb,
        substitutions: [],
        tips: []
    };
};
