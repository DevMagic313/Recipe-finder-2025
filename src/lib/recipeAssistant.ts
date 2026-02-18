
import { groq } from "./groq";
import { searchMealsByName, getMealsByCategory, getRandomMeal, Meal } from "@/api/mealdb";

export interface RecipeSuggestion {
    recipeName: string;
    category: string;
    area: string;
    ingredients: { name: string; amount: string }[];
    instructions: string[];
    videoLink?: string;
    image?: string;
}

interface GroqResponse {
    type: "search" | "category" | "random" | "none";
    keyword?: string;
    thinking?: string;
}

export const getRecipeSuggestions = async (userQuery: string): Promise<RecipeSuggestion | null> => {
    try {
        // 1. Ask Groq to interpret the user's intent
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a helper for a Recipe Finder app. Your job is to interpret the user's request and map it to one of the following actions:
            1. "search": If the user asks for a specific dish (e.g., "Lasagne", "Cake", "something with chicken").
            2. "category": If the user asks for a type of food (e.g., "Vegetarian", "Seafood", "Breakfast").
            3. "random": If the user asks for a random suggestion.
            4. "none": If the request is unrelated to food.

            Return a valid JSON object with the following structure:
            {
              "type": "search" | "category" | "random" | "none",
              "keyword": "string (the search term or category name to use with TheMealDB API)",
              "thinking": "string (brief explanation of why you chose this)"
            }

            Supported Categories: Beef, Chicken, Dessert, Lamb, Miscellaneous, Pasta, Pork, Seafood, Side, Starter, Vegan, Vegetarian, Breakfast, Goat.
            If the user asks for a category not in the list (e.g., "Dinner"), map it to "search" with a relevant keyword or "random".
            `
                },
                {
                    role: "user",
                    content: userQuery,
                },
            ],
            model: "llama-3.3-70b-versatile", // Fast and capable model
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) return null;

        const result: GroqResponse = JSON.parse(content);
        console.log("AI Decision:", result);

        let meal: Meal | null = null;

        // 2. Execute the action
        if (result.type === "random") {
            meal = await getRandomMeal();
        } else if (result.type === "category" && result.keyword) {
            const meals = await getMealsByCategory(result.keyword);
            // Pick a random one from the category to show
            if (meals && meals.length > 0) {
                // We need full details, getMealsByCategory only returns partial info.
                // So we need to fetch the full meal details by ID.
                const randomMeal = meals[Math.floor(Math.random() * meals.length)];
                // Consider implementing getMealById in mealdb.ts if not robust, but checking mealdb.ts it exists.
                // Wait, I need to check if getMealsByCategory returns full details.
                // Checking mealdb.ts... it returns Meal[].
                // But the API for 'filter' only returns {strMeal, strMealThumb, idMeal}.
                // So I must fetch details.
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
        return formatMealToSuggestion(meal);

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

    // Split instructions by newlines and filter empty strings
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
        image: meal.strMealThumb
    };
};
