import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Analyze Intent
app.post('/api/analyze-intent', async (req, res) => {
    try {
        const { query } = req.body;
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a helper for a Recipe Finder app. Your job is to interpret the user's request and map it to one of the following actions:
            1. "search": If the user asks for a specific dish (e.g., "Lasagne", "Cake", "something with chicken").
            2. "category": If the user asks for a type of food (e.g., "Vegetarian", "Seafood", "Breakfast").
            3. "random": If the user asks for a random suggestion.
            4. "plan": If the user asks for a meal plan (e.g., "Plan my meals", "Weekly keto plan").
            5. "none": If the request is unrelated to food.

            Return a valid JSON object with the following structure:
            {
              "type": "search" | "category" | "random" | "plan" | "none",
              "keyword": "string (the search term or category name to use with TheMealDB API, or details for the planner)",
              "thinking": "string (brief explanation of why you chose this)"
            }

            Supported Categories: Beef, Chicken, Dessert, Lamb, Miscellaneous, Pasta, Pork, Seafood, Side, Starter, Vegan, Vegetarian, Breakfast, Goat.
            If the user asks for a category not in the list (e.g., "Dinner"), map it to "search" with a relevant keyword or "random".
            for "plan", keyword should contain the user's preferences (e.g. "keto", "vegetarian", "1500 cal").
            `
                },
                { role: "user", content: query }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        res.json(JSON.parse(completion.choices[0]?.message?.content || "{}"));
    } catch (error) {
        console.error("Error analyzing intent:", error);
        res.status(500).json({ error: "Failed to analyze intent" });
    }
});

// Enhance Recipe
app.post('/api/enhance-recipe', async (req, res) => {
    try {
        const { recipeName, ingredients, instructions } = req.body;
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert chef assistant. I will provide a recipe. Your job is to:
                    1. Provide 3-5 substitutions for ingredients with dietary restrictions in mind (e.g., vegan, gluten-free).
                    2. Provide 2-3 pro cooking tips for this specific dish.
                    3. Refine the cooking instructions if they are unclear or poorly formatted.
                    4. Estimate the calories per serving (integer).
                    5. Determine dietary suitability (vegan, keto, glutenFree, dairyFree) as booleans.
                    6. List common allergens present (e.g., Peanuts, Dairy, Gluten, Shellfish, Soy, Eggs).

                    Return a valid JSON object:
                    {
                        "refinedSteps": ["Step 1...", "Step 2..."],
                        "substitutions": [{ "ingredient": "original", "alternative": "substitution" }],
                        "tips": ["Tip 1", "Tip 2"],
                        "calories": 500,
                        "dietaryInfo": { "vegan": false, "keto": true, "glutenFree": false, "dairyFree": false },
                        "allergens": ["Dairy", "Gluten"]
                    }
                    `
                },
                {
                    role: "user",
                    content: `Recipe: ${recipeName}
                    Ingredients: ${ingredients.join(', ')}
                    Instructions: ${instructions}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        res.json(JSON.parse(completion.choices[0]?.message?.content || "{}"));
    } catch (error) {
        console.error("Error enhancing recipe:", error);
        res.status(500).json({ error: "Failed to enhance recipe" });
    }
});

// Meal Planner
app.post('/api/generate-meal-plan', async (req, res) => {
    try {
        const { preferences } = req.body;
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an AI nutrition planner. Generate a 7-day meal plan based on the user's preferences.
                    
                    Return a valid JSON object:
                    {
                      "mealPlan": [
                        {
                          "day": "Monday",
                          "breakfast": "...",
                          "lunch": "...",
                          "dinner": "...",
                          "calories": 2000
                        },
                        {
                          "day": "Tuesday",
                          "breakfast": "...",
                          "lunch": "...",
                          "dinner": "...",
                          "calories": 2000
                        },
                        {
                          "day": "Wednesday",
                          "breakfast": "...",
                          "lunch": "...",
                          "dinner": "...",
                          "calories": 2000
                        },
                        {
                          "day": "Thursday",
                          "breakfast": "...",
                          "lunch": "...",
                          "dinner": "...",
                          "calories": 2000
                        },
                        {
                          "day": "Friday",
                          "breakfast": "...",
                          "lunch": "...",
                          "dinner": "...",
                          "calories": 2000
                        },
                        {
                          "day": "Saturday",
                          "breakfast": "...",
                          "lunch": "...",
                          "dinner": "...",
                          "calories": 2000
                        },
                        {
                          "day": "Sunday",
                          "breakfast": "...",
                          "lunch": "...",
                          "dinner": "...",
                          "calories": 2000
                        }
                      ],
                      "shoppingList": ["Item 1", "Item 2"...]
                    }
                    `
                },
                { role: "user", content: `Preferences: ${preferences}` }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        res.json(JSON.parse(completion.choices[0]?.message?.content || "{}"));
    } catch (error) {
        console.error("Error generating meal plan:", error);
        res.status(500).json({ error: "Failed to generate meal plan" });
    }
});


const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
